import { getStripe } from "@/lib/stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function planFromPriceId(priceId: string): string {
  // Server-only env vars. The previous code also accepted
  // NEXT_PUBLIC_STRIPE_PLUS_*_PRICE_ID values as a fallback — but any
  // `NEXT_PUBLIC_` env is baked into the client bundle and visible in
  // browser dev tools. Reading them on the server normalized the
  // practice of putting billing config in public env. Vercel prod
  // already has both server-only vars set, so the public fallback was
  // dead in practice; this removes it so a future deploy that drops
  // the server-only var fails loudly instead of silently using a leaky
  // public copy.
  const monthlyId = process.env.STRIPE_PLUS_MONTHLY_PRICE_ID;
  const yearlyId = process.env.STRIPE_PLUS_YEARLY_PRICE_ID;
  if (monthlyId && priceId === monthlyId) return "plus_monthly";
  if (yearlyId && priceId === yearlyId) return "plus_yearly";
  return "free";
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const item = sub.items.data[0];
        const priceId = item?.price.id || "";
        const periodEnd = item?.current_period_end ?? (sub as unknown as { current_period_end?: number }).current_period_end;
        await convex.mutation(api.subscriptions.updateSubscription, {
          stripeCustomerId: sub.customer as string,
          subscriptionId: sub.id,
          subscriptionStatus: sub.status === "active" ? "active" : sub.status,
          plan: planFromPriceId(priceId),
          planExpiresAt: periodEnd ? periodEnd * 1000 : undefined,
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await convex.mutation(api.subscriptions.updateSubscription, {
          stripeCustomerId: sub.customer as string,
          subscriptionId: sub.id,
          subscriptionStatus: "canceled",
          plan: "free",
        });
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
