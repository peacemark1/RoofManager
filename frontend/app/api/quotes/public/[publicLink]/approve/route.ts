import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function POST(
  request: Request,
  { params }: { params: { publicLink: string } }
) {
  try {
    const body = await request.json()
    const response = await fetch(`${API_BASE_URL}/quotes/public/${params.publicLink}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to approve quote' } },
      { status: 500 }
    )
  }
}
