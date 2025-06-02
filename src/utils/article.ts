import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export interface Article {
  title: string;
  content: string;
  date: string;
  tags: string[];
  keyPoints: string[];
  url: string;
}

export async function fetchAndParseArticle(url: string): Promise<Article> {
  try {
    // Use our API route for parsing
    const parseResponse = await fetch("/api/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!parseResponse.ok) {
      throw new Error("Failed to parse article");
    }

    const { data: parseResult } = await parseResponse.json();

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Prepare prompt for Gemini
    const prompt = `
Analyze this news content and provide:

1. Multiple paragraphs separated by TWO NEWLINES (each for distinct events) "\n\n"
2. Bullet-pointed key takeaways
3. Comma-separated tags
4. the title needs to be very very smart, and related to the topics in the news articles, not the platform. also, make it 
interesting. Don't include name of the source in the title.

Format EXACTLY like this - NO MARKDOWN:

First event description. This should be a full paragraph with complete sentences and proper punctuation.

Second event description. Another full paragraph explaining a different news item.

Third event description. Another full paragraph explaining a different news item.

Fourth event description. Another full paragraph explaining a different news item.

KEY_TAKEAWAYS:
- First core takeaway
- Second core takeaway
- Third core takeaway

TAGS (Limit to 3) (2 words max), the tags need to be really smart, and related to the topics in the article. Not just names of countries, but concepts:
Tag1, Tag2, Tag3

Article content:
${parseResult.content}
`;

    // Generate summary with Gemini
    const response = await model.generateContent(prompt);
    const text = response.response.text();

    // Extract AI-generated title (first line before content)
    const aiTitle = text.split('\n\n')[0].trim();

    // Handle different paragraph separators
    const normalizedText = text
      .replace(/\n\s*\n/g, '\n\n') // Collapse multiple newlines
      .replace(/(\S)\n(\S)/g, '$1 $2'); // Fix mid-paragraph line breaks

    // Split into content and metadata sections
    const [contentSection] = normalizedText.split('\n\nKEY_TAKEAWAYS:');
    const paragraphs = contentSection
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    // Join paragraphs with double newlines for proper spacing
    const formattedContent = paragraphs.join('\n\n');

    // Extract key points
    const keyPointsMatch = text.match(/KEY_TAKEAWAYS:\n([\s\S]*?)(?=\n\nTAGS:)/);
    const keyPoints = keyPointsMatch 
      ? keyPointsMatch[1]
        .split('\n')
        .map(point => point.replace(/^- /, '').trim())
        .filter(point => point.length > 0)
      : [];

    // Extract tags 
    const tagsMatch = text.match(/TAGS:\n([\s\S]*?)$/);
    const tags = tagsMatch
      ? tagsMatch[1]
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      : [];

    return {
      title: aiTitle || parseResult.title,
      content: formattedContent,
      date: new Date(parseResult.date_published || Date.now()).toLocaleDateString('en-US', { 
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      tags,
      keyPoints,
      url
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
}
