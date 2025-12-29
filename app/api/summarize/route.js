import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { content, type = 'text' } = await request.json()

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      // Return a demo response if no API key
      const demoSummary = type === 'voice' 
        ? `# Voice Notes Summary

## Key Points
- Your voice recording has been transcribed
- AI formatting requires an API key to be configured
- Get your free Groq API key from https://console.groq.com/

## Next Steps
1. Sign up for a free Groq account
2. Generate an API key
3. Add it to your .env.local file
4. Restart the development server

Once configured, your voice notes will be automatically formatted into structured study notes!`
        : `# Notes Summary

## Overview
Your notes have been received successfully.

## Configuration Required
- AI summarization requires an API key
- Get your free Groq API key from https://console.groq.com/

## How to Set Up
1. Create a Groq account (free)
2. Generate an API key
3. Add GROQ_API_KEY to .env.local
4. Restart the server

Once done, your notes will be automatically summarized with key concepts, definitions, and important facts!`

      return NextResponse.json({ summary: demoSummary })
    }

    // Define prompts based on type
    const prompts = {
      voice: `You are StudySync AI's voice-to-notes converter. Transform the following spoken/transcribed text into well-organized study notes.

INSTRUCTIONS:
1. Create clear section headings (use plain text, no special formatting)
2. Extract and organize main topics and subtopics
3. Use simple dashes (-) for bullet points
4. Remove filler words, repetitions, and speech artifacts
5. Maintain the original meaning while improving clarity
6. Add blank lines between different sections
7. Format lists clearly with proper indentation
8. If numbers, dates, or specific facts are mentioned, present them clearly

IMPORTANT: Do NOT use markdown formatting like **bold**, *italic*, or # headers. Write in clean, professional plain text only.

TRANSCRIBED VOICE NOTES:
${content}

OUTPUT: Well-structured plain text study notes`,

      text: `You are StudySync AI's intelligent summarizer. Analyze and summarize the following study material.

INSTRUCTIONS:
1. Start with a brief overview (2-3 sentences)
2. Identify and list KEY CONCEPTS with clear explanations
3. Extract IMPORTANT DEFINITIONS and terms
4. Present CRUCIAL FACTS, dates, or figures clearly
5. Note any RELATIONSHIPS between concepts
6. Create a quick review section at the end
7. Use clean plain text formatting with dashes for lists
8. Be concise but comprehensive

IMPORTANT: Do NOT use markdown formatting like **bold**, *italic*, or # headers. Write in clean, professional plain text only.

STUDY MATERIAL:
${content}

OUTPUT: Comprehensive summary with all key information in clean plain text`
    }

    const prompt = prompts[type] || prompts.text

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert study assistant that creates clear, well-organized study materials. NEVER use markdown formatting like **bold**, *italic*, or # headers. Write in clean, professional plain text only. Use simple dashes (-) for bullet points and blank lines for section breaks.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2000,
        top_p: 0.9,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Groq API error:', errorData)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to summarize content' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      summary: data.choices[0].message.content,
      usage: data.usage
    })

  } catch (error) {
    console.error('Summarize API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    service: 'StudySync AI Summarize API'
  })
}
