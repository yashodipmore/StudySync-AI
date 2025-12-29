import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { content, numQuestions = 5 } = await request.json()

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
      // Return demo quiz if no API key
      const demoQuiz = [
        {
          question: "What is required to use the AI quiz generator?",
          options: [
            "A paid subscription",
            "A Groq API key (free)",
            "Premium membership",
            "No configuration needed"
          ],
          correct: 1,
          explanation: "You need a free Groq API key from console.groq.com to generate AI-powered quizzes."
        },
        {
          question: "Where can you get a free API key for StudySync AI?",
          options: [
            "OpenAI website",
            "Google Cloud Console",
            "Groq Console (console.groq.com)",
            "Microsoft Azure"
          ],
          correct: 2,
          explanation: "Groq offers free API keys at console.groq.com that power StudySync AI's features."
        },
        {
          question: "What should you do after getting your API key?",
          options: [
            "Share it publicly",
            "Add it to .env.local file",
            "Email it to support",
            "Delete it immediately"
          ],
          correct: 1,
          explanation: "API keys should be stored securely in the .env.local file and never shared publicly."
        }
      ]
      return NextResponse.json({ quiz: demoQuiz })
    }

    const prompt = `You are a quiz generator for StudySync AI. Based on the following study content, generate exactly ${numQuestions} multiple-choice questions.

STUDY CONTENT:
${content}

REQUIREMENTS:
1. Each question should test understanding, not just memorization
2. Include a mix of difficulty levels (easy, medium, challenging)
3. All 4 options should be plausible to prevent guessing
4. The correct answer should be definitively correct based on the content
5. Explanations should be educational and helpful

RETURN FORMAT:
Return ONLY a valid JSON array with no additional text, markdown, or explanation. Format:
[
  {
    "question": "Clear, well-formed question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Why the correct answer is right"
  }
]

IMPORTANT:
- "correct" is the index (0-3) of the correct option
- Return ONLY the JSON array, no other text
- Ensure valid JSON syntax
- Do NOT use any markdown formatting like **bold** or *italic* in questions, options, or explanations
- Write all text in clean, professional plain text`

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
            content: 'You are a JSON generator. You ONLY output valid JSON arrays. No markdown, no explanations, no code blocks - just pure JSON.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON
        max_tokens: 3000,
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
        { error: 'Failed to generate quiz' },
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

    const text = data.choices[0].message.content

    // Clean and parse JSON
    let quiz
    try {
      // Remove any markdown code blocks
      let cleanText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      // Find the JSON array
      const startIndex = cleanText.indexOf('[')
      const endIndex = cleanText.lastIndexOf(']')
      
      if (startIndex === -1 || endIndex === -1) {
        throw new Error('No JSON array found')
      }
      
      cleanText = cleanText.substring(startIndex, endIndex + 1)
      quiz = JSON.parse(cleanText)

      // Validate quiz structure
      if (!Array.isArray(quiz) || quiz.length === 0) {
        throw new Error('Invalid quiz format')
      }

      // Validate each question
      quiz = quiz.map((q, idx) => {
        if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error(`Invalid question format at index ${idx}`)
        }
        return {
          question: String(q.question),
          options: q.options.map(o => String(o)),
          correct: typeof q.correct === 'number' ? q.correct : 0,
          explanation: String(q.explanation || 'No explanation provided.')
        }
      })

    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', text)
      
      // Return a fallback quiz
      return NextResponse.json({
        quiz: [
          {
            question: "The quiz couldn't be generated. What should you try?",
            options: [
              "Use more detailed content",
              "Try with different material",
              "Check your internet connection",
              "All of the above"
            ],
            correct: 3,
            explanation: "If quiz generation fails, try providing more detailed content, different material, or checking your connection."
          }
        ],
        warning: 'Quiz generation had issues. Please try with different content.'
      })
    }

    return NextResponse.json({ 
      quiz,
      usage: data.usage
    })

  } catch (error) {
    console.error('Quiz API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    service: 'StudySync AI Quiz API'
  })
}
