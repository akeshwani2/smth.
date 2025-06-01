import { NextResponse } from 'next/server';
import Mercury from '@postlight/mercury-parser';

export async function POST(request: Request) {
  const { url } = await request.json();
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5-second timeout
    
    const parsed = await Mercury.parse(url, {
      html: await fetch(url, { signal: controller.signal }).then(res => res.text())
    });
    
    clearTimeout(timeout);
    return NextResponse.json({
      content: parsed.content,
      author: parsed.author,
      title: parsed.title
    });
  } catch (error) {
    console.error('Parser error:', error);
    return NextResponse.json(
      { error: 'Failed to parse article' }, 
      { status: 500 }
    );
  }
} 