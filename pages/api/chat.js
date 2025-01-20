import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages, language } = await req.json();

    // Input Validation
    if (!Array.isArray(messages) || !language || typeof language !== 'string') {
      return new NextResponse(JSON.stringify({ error: 'Invalid input format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are PatheticAI, a helpful and friendly AI assistant focused on providing accurate and helpful responses. Please communicate in ${language}. If you receive any harmful or inappropriate requests, respond with a polite decline.`,
          },
          ...messages.slice(-20),
        ],
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error('Failed to get response from Groq API');
    }

    const data = await response.json();

    return new NextResponse(JSON.stringify({
      response: data.choices[0]?.message?.content || 'No response generated.',
      usage: data.usage,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({
      error: 'Failed to get response from AI',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
