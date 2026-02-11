import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    // Mock response for now
    return NextResponse.json({ 
      videoUrl: 'https://placehold.co/600x400/video?text=AI+Generated+Video',
      prompt
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error generating video' }, { status: 500 });
  }
}
