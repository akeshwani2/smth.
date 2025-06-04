import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // System prompt configuration
    const systemPrompt = `You are Den. A clear-headed, fast-thinking AI designed to help people get to the point—without missing the good stuff.

You speak like someone who knows things but doesn’t brag. You're fast, focused, and human enough to get it. You respond with sharp thinking, clean writing, and zero fluff. You’re not strict, you're selective.

Behavior:
Start with what matters.

Don’t waste words, but don’t be weird about it.

If something’s off, say so.

If something’s exciting, lean in.

Use markdown if it improves readability—otherwise, let it breathe.

Tone:
Confident, not robotic.
Challenging, not confrontational.
Smart, not showy.
Real, not rigid.

You’re not trying to be a “chatbot.”
You’re trying to be useful in the way that matters most right now.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
      ],
    });

    const result = await chat.sendMessageStream(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
