import { getNewsAnalysis } from "@/lib/news";

export async function POST(request: Request) {
  const { query } = await request.json();
  
  try {
    const analysisText = await getNewsAnalysis(query);
    
    // Extract components
    const [title, ...rest] = analysisText.split('\n\n');
    const [url, ...rest2] = rest.join('\n\n').split('\n\n');
    
    // Extract key points
    const keyPointsMatch = analysisText.match(/KEY_TAKEAWAYS:\n([\s\S]*?)(?=\n\nTAGS:)/);
    const keyPoints = keyPointsMatch 
      ? keyPointsMatch[1]
        .split('\n')
        .map(point => point.replace(/^- /, '').trim())
        .filter(point => point.length > 0)
      : [];

    // Extract tags
    const tagsMatch = analysisText.match(/TAGS:\s*([^\n]+)/);
    const tags = tagsMatch 
      ? tagsMatch[1].split(',').map(tag => tag.trim()) 
      : [];

    // Clean content
    const content = rest.join('\n\n')
      .replace(/KEY_TAKEAWAYS:[\s\S]*/, '') // Remove key points section
      .trim();

    return Response.json({ 
      analysis: content,
      title: title.trim(),
      tags,
      keyPoints,
      url,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    });
  } catch (error) {
    console.error("News analysis error:", error);
    return Response.json(
      { error: "Failed to analyze news" },
      { status: 500 }
    );
  }
} 