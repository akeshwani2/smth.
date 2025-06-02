import { getJson } from "serpapi";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface NewsAnalysis {
  title: string;
  date: string;
  content: string;
  keyPoints: string[];
  tags: string[];
  url: string;
}

export async function getNewsAnalysis(query: string) {
  const newsResults = await getJson({
    engine: "google_news",
    q: query,
    api_key: process.env.SERP_API_KEY,
  });

  const newsItems = newsResults.news_results
    .map((item: any) => `${item.title}\n${item.snippet}`)
    .join("\n\n");

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(`Analyze this news content and provide:

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
Tag1, Tag2, Tag3:\n\n${newsItems}`);
  return result.response.text();
} 

