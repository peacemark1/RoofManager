import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    // Mock response for now
    return NextResponse.json({ 
      imageUrl: 'https://placehold.co/400x300/1e293b/white?text=AI+Card+Image',
      prompt
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error generating card image' }, { status: 500 });
  }
}
