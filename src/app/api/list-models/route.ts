
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is missing' }, { status: 500 });
  }

  const url = 'https://generativelanguage.googleapis.com/v1beta/models';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-goog-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: 'Gemini HTTP Error', details: errText }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list models', details: error }, { status: 500 });
  }
}
