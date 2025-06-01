import { NextResponse } from "next/server";
import MercuryParser from "@postlight/mercury-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const { tavilyResults } = await request.json();

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Process only the top result
    const topResult = tavilyResults[0];
    const parsed = await MercuryParser.parse(topResult.url);

    const prompt = `Read the article below and return a deeply thoughtful summary that captures the key takeaways, but do **not** make it look like a summary. Write in a compelling, narrative tone — as if you're explaining it to someone curious but time-limited.

Avoid all formatting — no bold text, no bullet numbers, no section headers like "Key Points". However, if a short list would help the flow, you may use plain bullet points (like dashes), sparingly. Use smart words and phrases to make it interesting to read. Write in structured, well-defined paragraphs — enough to guide the reader, but not so many that it feels overwhelming.

Include a "TL;DR" at the end that distills the core insight in one or two sharp sentences.

Here is the article:

${parsed.content}
`;

    const summary = await model.generateContent(prompt);
    const summaryText = await summary.response.text();

    return NextResponse.json({
      title: topResult.title,
      summary: summaryText,
      url: topResult.url,
      publishedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
