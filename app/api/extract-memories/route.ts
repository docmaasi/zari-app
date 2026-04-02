import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();

    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const extractionPrompt = `Analyze this message and extract any facts, events, people mentioned, or topics worth remembering about the user. Return a JSON array of memories.

Each memory object should have:
- "category": one of "personal", "interests", "goals", "relationships", "preferences", "events"
- "fact": a concise statement of the fact or event
- "people": an array of names mentioned (empty array if none)

Only extract meaningful, specific information. Skip greetings, filler, and vague statements.
If there's nothing worth remembering, return an empty array [].

Message: "${message}"

Respond ONLY with valid JSON array, nothing else.`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: extractionPrompt }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "[]";

    let memories: Array<{
      category: string;
      fact: string;
      people: string[];
    }> = [];

    try {
      memories = JSON.parse(text);
    } catch {
      return NextResponse.json({ count: 0 });
    }

    if (!Array.isArray(memories)) {
      return NextResponse.json({ count: 0 });
    }

    let savedCount = 0;
    for (const memory of memories) {
      if (memory.category && memory.fact) {
        const result = await convex.mutation(api.memories.addMemory, {
          userId: user._id,
          category: memory.category,
          fact: memory.fact,
          people: memory.people || [],
        });
        if (result) savedCount++;
      }
    }

    return NextResponse.json({ count: savedCount });
  } catch (error) {
    console.error("Memory extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract memories" },
      { status: 500 }
    );
  }
}
