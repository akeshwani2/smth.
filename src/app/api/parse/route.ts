import { NextResponse } from 'next/server';
import Mercury from '@postlight/mercury-parser';

export async function POST(request: Request) {
  const { url } = await request.json();
  
  try {
    const result = await Mercury.parse(url);
    return NextResponse.json({
      success: true,
      data: {
        title: result.title,
        content: result.content,
        date_published: result.date_published
      }
    });
  } catch (error) {
    console.error('Mercury parse error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to parse article' },
      { status: 500 }
    );
  }
} 