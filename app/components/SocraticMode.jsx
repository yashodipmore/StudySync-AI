'use client'
import { useState, useRef, useEffect } from 'react'
import { Brain, Send, Loader2, Bot, User, Lightbulb, RefreshCw, HelpCircle, Sparkles } from 'lucide-react'

export default function SocraticMode() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState('')
  const [sessionStarted, setSessionStarted] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  // Helper function to handle streaming response
  const handleStreamingResponse = async (response) => {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            setMessages(prev => [...prev, { role: 'assistant', content: fullContent }])
            setStreamingContent('')
            return fullContent
          }
          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              fullContent += parsed.content
              setStreamingContent(fullContent)
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
    return fullContent
  }

  const startSession = async () => {
    if (!topic.trim()) return

    setSessionStarted(true)
    setLoading(true)
    setStreamingContent('')

    const initialMessage = { 
      role: 'user', 
      content: `I want to learn about: ${topic}` 
    }
    setMessages([initialMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [initialMessage],
          mode: 'socratic' 
        }),
      })

      await handleStreamingResponse(response)
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Let's start exploring this topic together. What do you already know about it?",
      }])
      setStreamingContent('')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          mode: 'socratic' 
        }),
      })

      await handleStreamingResponse(response)
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Interesting thought! Can you elaborate on that? What makes you think so?",
      }])
      setStreamingContent('')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!sessionStarted) {
        startSession()
      } else {
        sendMessage()
      }
    }
  }

  const resetSession = () => {
    setMessages([])
    setTopic('')
    setSessionStarted(false)
    setStreamingContent('')
  }

  // Quick hint
  const getHint = async () => {
    if (messages.length < 2 || loading) return

    setLoading(true)
    setStreamingContent('')
    const hintRequest = { 
      role: 'user', 
      content: "I'm stuck. Can you give me a small hint without giving away the answer?" 
    }
    setMessages(prev => [...prev, hintRequest])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, hintRequest],
          mode: 'socratic' 
        }),
      })

      await handleStreamingResponse(response)
    } catch (error) {
      console.error('Error:', error)
      setStreamingContent('')
    } finally {
      setLoading(false)
    }
  }

  // Topic suggestions
  const topicSuggestions = [
    "How does photosynthesis work?",
    "Why do we dream?",
    "How does gravity work?",
    "What causes economic inflation?",
    "How do computers store memory?",
    "Why is the sky blue?"
  ]

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-orange to-brand-orange dark:from-dark-orange dark:to-deep-orange border-2 border-deep-orange dark:border-dark-orange rounded-card p-3 sm:p-4 md:p-6 mb-2 md:mb-4 text-white card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur rounded-button flex items-center justify-center flex-shrink-0 border-2 border-white/30">
              <Brain size={20} className="text-white sm:hidden" />
              <Brain size={26} className="text-white hidden sm:block md:hidden" />
              <Brain size={32} className="text-white hidden md:block" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-playfair">Socratic Teaching Mode</h2>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5 hidden sm:block">I'll guide you to discover answers yourself</p>
            </div>
          </div>
          {sessionStarted && (
            <button
              onClick={resetSession}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 rounded-button transition-colors border-2 border-white/20"
            >
              <RefreshCw size={16} className="sm:hidden" />
              <RefreshCw size={18} className="hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">New Topic</span>
            </button>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-soft-orange dark:bg-dark-orange/20 border-2 border-deep-orange dark:border-dark-orange rounded-card p-3 sm:p-4 mb-2 md:mb-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <Lightbulb className="text-deep-orange dark:text-dark-orange flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs sm:text-sm text-gray-800 dark:text-dark-text font-medium">How Socratic Mode Works</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-muted mt-1 hidden sm:block">
              Instead of giving direct answers, I'll ask thought-provoking questions that help you think through the problem. 
              This strengthens your understanding and helps you truly learn the concept!
            </p>
            <p className="text-xs text-gray-600 dark:text-dark-text-muted mt-1 sm:hidden">
              I'll ask questions to help you discover the answers yourself!
            </p>
          </div>
        </div>
      </div>

      {!sessionStarted ? (
        // Topic Selection Screen
        <div className="flex-1 bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center animate-fadeIn overflow-y-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-soft-orange to-peach dark:from-dark-orange/30 dark:to-dark-orange/10 rounded-full flex items-center justify-center mb-4 md:mb-6 animate-float border-2 border-peach dark:border-dark-orange/40">
            <Brain size={32} className="text-deep-orange dark:text-dark-orange sm:hidden" />
            <Brain size={40} className="text-deep-orange dark:text-dark-orange hidden sm:block md:hidden" />
            <Brain size={48} className="text-deep-orange dark:text-dark-orange hidden md:block" />
          </div>
          
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-text mb-2 text-center font-playfair">What would you like to explore?</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-muted mb-4 sm:mb-6 md:mb-8 text-center max-w-md px-2">
            Enter a topic or question, and I'll guide you to understand it through thoughtful questions.
          </p>

          {/* Topic Input */}
          <div className="w-full max-w-xl mb-4 sm:mb-6 px-2">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a topic or question..."
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-cream dark:bg-dark-bg border-2 border-border-dark dark:border-dark-border rounded-input focus:outline-none focus:border-deep-orange dark:focus:border-dark-orange text-sm sm:text-base text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-text-muted"
              />
              <button
                onClick={startSession}
                disabled={!topic.trim()}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-deep-orange to-brand-orange dark:from-dark-orange dark:to-deep-orange text-white rounded-button border-2 border-deep-orange dark:border-dark-orange hover:from-dark-orange hover:to-deep-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium btn-glow text-sm sm:text-base"
              >
                Start Learning
              </button>
            </div>
          </div>

          {/* Topic Suggestions */}
          <div className="w-full max-w-2xl px-2">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted mb-2 sm:mb-3 text-center">Or try one of these:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {topicSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(suggestion)}
                  className="p-2.5 sm:p-3 bg-light-orange dark:bg-dark-card-hover hover:bg-soft-orange dark:hover:bg-dark-border text-left text-xs sm:text-sm text-gray-700 dark:text-dark-text rounded-input border-2 border-border-dark dark:border-dark-border hover:border-deep-orange dark:hover:border-dark-orange transition-all flex items-center gap-2"
                >
                  <HelpCircle size={14} className="text-deep-orange dark:text-dark-orange flex-shrink-0 sm:hidden" />
                  <HelpCircle size={16} className="text-deep-orange dark:text-dark-orange flex-shrink-0 hidden sm:block" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Chat Area
        <>
          <div className="flex-1 bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6 overflow-y-auto mb-2 md:mb-4">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-bubble`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-deep-orange to-dark-orange' 
                        : 'bg-gradient-to-br from-purple-500 to-purple-700'
                    }`}>
                      {msg.role === 'user' ? (
                        <User size={14} className="text-white sm:hidden" />
                      ) : (
                        <Brain size={14} className="text-white sm:hidden" />
                      )}
                      {msg.role === 'user' ? (
                        <User size={16} className="text-white hidden sm:block" />
                      ) : (
                        <Brain size={16} className="text-white hidden sm:block" />
                      )}
                    </div>
                    
                    {/* Message Content */}
                    <div
                      className={`p-2.5 sm:p-3 md:p-4 rounded-card border-2 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-deep-orange to-brand-orange dark:from-dark-orange dark:to-deep-orange text-white border-deep-orange dark:border-dark-orange'
                          : 'bg-gradient-to-br from-light-orange to-soft-orange dark:from-dark-card-hover dark:to-dark-bg text-gray-900 dark:text-dark-text border-deep-orange dark:border-dark-orange'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-1 mb-1.5 sm:mb-2 text-deep-orange dark:text-dark-orange">
                          <Sparkles size={12} className="sm:hidden" />
                          <Sparkles size={14} className="hidden sm:block" />
                          <span className="text-[10px] sm:text-xs font-semibold">Socratic Guide</span>
                        </div>
                      )}
                      <div className="prose prose-sm max-w-none text-sm sm:text-base">
                        {msg.content.split('\n').map((line, i) => (
                          <p key={i} className={`mb-1 last:mb-0 break-words ${msg.role === 'user' ? 'text-white' : ''}`}>
                            {line || '\u00A0'}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Streaming / Loading indicator */}
              {loading && (
                <div className="flex justify-start message-bubble">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center border-2 border-purple-400 dark:border-purple-600">
                      <Brain size={14} className="text-white sm:hidden" />
                      <Brain size={16} className="text-white hidden sm:block" />
                    </div>
                    <div className="bg-gradient-to-br from-light-orange to-soft-orange dark:from-dark-card-hover dark:to-dark-bg p-2.5 sm:p-3 md:p-4 rounded-card border-2 border-deep-orange dark:border-dark-orange min-w-[150px] sm:min-w-[200px]">
                      {streamingContent ? (
                        <>
                          <div className="flex items-center gap-1 mb-1.5 sm:mb-2 text-deep-orange dark:text-dark-orange">
                            <Sparkles size={12} className="sm:hidden" />
                            <Sparkles size={14} className="hidden sm:block" />
                            <span className="text-[10px] sm:text-xs font-semibold">Socratic Guide</span>
                          </div>
                          <div className="prose prose-sm max-w-none text-sm sm:text-base dark:text-dark-text">
                            {streamingContent.split('\n').map((line, i) => (
                              <p key={i} className="mb-1 last:mb-0 break-words">
                                {line || '\u00A0'}
                              </p>
                            ))}
                            <span className="inline-block w-2 h-4 bg-deep-orange dark:bg-dark-orange ml-0.5 animate-pulse" />
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Loader2 className="animate-spin text-deep-orange dark:text-dark-orange" size={16} />
                          <span className="text-gray-600 dark:text-dark-text-muted text-xs sm:text-sm">Crafting a guiding question...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Hint Button */}
          {messages.length >= 2 && !loading && (
            <div className="flex justify-center mb-1 sm:mb-2">
              <button
                onClick={getHint}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-deep-orange dark:text-dark-orange hover:bg-soft-orange dark:hover:bg-dark-card-hover rounded-button transition-colors"
              >
                <Lightbulb size={12} className="sm:hidden" />
                <Lightbulb size={14} className="hidden sm:block" />
                I'm stuck, give me a hint
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white border-2 border-border-dark rounded-card p-2.5 sm:p-3 md:p-4">
            <div className="flex gap-2 sm:gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts..."
                rows={1}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-light-orange border-2 border-gray-200 rounded-input focus:outline-none focus:border-deep-orange resize-none text-sm sm:text-base text-gray-900 placeholder-gray-500"
                style={{ minHeight: '44px', maxHeight: '100px' }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-deep-orange to-dark-orange text-white rounded-button border-2 border-deep-orange hover:from-dark-orange hover:to-deep-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 btn-glow"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-dark-text-muted mt-1.5 sm:mt-2 text-center hidden sm:block">
              Think carefully and share your reasoning • Don't worry about being wrong!
            </p>
          </div>
        </>
      )}
    </div>
  )
}
