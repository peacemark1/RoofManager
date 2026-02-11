import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    // Mock response for now
    return NextResponse.json({ 
      imageUrl: 'https://placehold.co/600x400/1e293b/white?text=AI+Generated+Image',
      prompt
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error generating image' }, { status: 500 });
  }
}
