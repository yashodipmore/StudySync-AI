export async function POST(request) {
  try {
    const { messages, mode = 'normal' } = await request.json()

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check for API key
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      // Return non-streaming response for demo
      const encoder = new TextEncoder()
      const demoMessage = "I'm ready to help! However, the API key needs to be configured. Please add your Groq API key to the .env.local file. You can get a free key from https://console.groq.com/"
      
      const stream = new ReadableStream({
        async start(controller) {
          for (const char of demoMessage) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: char })}\n\n`))
            await new Promise(r => setTimeout(r, 20))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      })
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    // Define system prompts based on mode
    const systemPrompts = {
      normal: `You are StudySync AI, a helpful and friendly study assistant. Your role is to:
- Provide clear, concise explanations with examples
- Break down complex topics into understandable parts
- Use analogies and real-world examples when helpful
- Encourage learning and curiosity
- Be supportive and patient

IMPORTANT FORMATTING RULES:
- NEVER use markdown formatting like **bold**, *italic*, or # headers
- NEVER use asterisks (*) or double asterisks (**) around text
- Write in clean, professional plain text only
- Use simple dashes (-) for lists if needed
- Keep responses readable and well-structured without any special formatting

Always aim to help students truly understand concepts, not just memorize information.`,

      socratic: `You are a Socratic tutor in StudySync AI. Your teaching philosophy is based on the Socratic method:

CORE RULES:
1. NEVER give direct answers to questions about concepts
2. Instead, ask 1-2 thought-provoking questions that guide the student toward discovering the answer themselves
3. Build on the student's responses to ask deeper questions
4. Be encouraging and supportive - celebrate when they make progress
5. If they're stuck, provide small hints through questions, not statements
6. Use phrases like "What do you think would happen if...?", "How might this relate to...?", "Can you think of an example where...?"

EXAMPLE INTERACTION:
Student: "What is photosynthesis?"
You: "Great question! Let's explore this together. What do plants need to survive and grow? And what do you think happens to sunlight when it hits a plant's leaves?"

Remember: Your goal is to make students THINK, not just receive information. The journey of discovery is more valuable than the destination.

IMPORTANT: Never use markdown formatting like **bold**, *italic*, or # headers. Write in clean, professional plain text only.`
    }

    const systemPrompt = systemPrompts[mode] || systemPrompts.normal

    // Make streaming request to Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: mode === 'socratic' ? 0.8 : 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        stream: true, // Enable streaming
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Groq API error:', errorData)
      
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create a TransformStream to process the SSE data
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk)
        const lines = text.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              continue
            }
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    })

    // Pipe the response through our transform
    const stream = response.body.pipeThrough(transformStream)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    service: 'StudySync AI Chat API'
  })
}
