import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId } = await request.json();
    if (!priceId || typeof priceId !== "string") {
      return NextResponse.json(
        { error: "Price ID required" },
        { status: 400 }
      );
    }

    // Server-side allowlist — only accept Zari Plus monthly/yearly prices.
    // Without this, a client could pass any price ID (e.g. a $0 price they create
    // and then trick the webhook into granting Plus).
    const ALLOWED_PRICE_IDS = [
      process.env.STRIPE_PLUS_MONTHLY_PRICE_ID,
      process.env.STRIPE_PLUS_YEARLY_PRICE_ID,
    ].filter(Boolean) as string[];

    if (!ALLOWED_PRICE_IDS.includes(priceId)) {
      return NextResponse.json(
        { error: "Invalid price" },
        { status: 400 }
      );
    }

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reuse or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        name: user.name,
        metadata: { clerkId },
      });
      customerId = customer.id;
      await convex.mutation(api.subscriptions.setStripeCustomerId, {
        clerkId,
        stripeCustomerId: customerId,
      });
    }

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.headers.get("origin")}/chat?upgraded=true`,
      cancel_url: `${request.headers.get("origin")}/pricing`,
      metadata: { clerkId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
