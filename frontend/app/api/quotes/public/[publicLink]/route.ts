import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export async function GET(
  request: Request,
  { params }: { params: { publicLink: string } }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/quotes/public/${params.publicLink}`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch quote' } },
      { status: 500 }
    )
  }
}
