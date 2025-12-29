'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User, Trash2, Copy, Check, RefreshCw } from 'lucide-react'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(null)
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

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Handle streaming response
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
              // Streaming complete - add full message
              setMessages(prev => [...prev, { role: 'assistant', content: fullContent }])
              setStreamingContent('')
              break
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
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Connection error. Please check your internet and try again.',
        error: true 
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
      sendMessage()
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const clearChat = () => {
    setMessages([])
    setStreamingContent('')
  }

  const regenerateResponse = async () => {
    if (messages.length < 2) return
    
    // Remove last assistant message
    const newMessages = messages.slice(0, -1)
    setMessages(newMessages)
    
    // Get the last user message
    const lastUserMessage = newMessages[newMessages.length - 1]
    if (!lastUserMessage || lastUserMessage.role !== 'user') return

    setLoading(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      // Handle streaming response
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
              break
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
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Suggested prompts
  const suggestedPrompts = [
    "Explain photosynthesis in simple terms",
    "Help me understand calculus derivatives",
    "What are the key events of World War II?",
    "Explain Newton's laws of motion",
  ]

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6 mb-2 md:mb-4 card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange rounded-button flex items-center justify-center flex-shrink-0 border-2 border-brand-orange/30 dark:border-dark-orange/50">
              <Bot size={20} className="text-white sm:hidden" />
              <Bot size={24} className="text-white hidden sm:block md:hidden" />
              <Bot size={28} className="text-white hidden md:block" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-text font-playfair">AI Study Assistant</h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-muted mt-0.5 hidden sm:block">Ask me anything about your studies</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-gray-600 dark:text-dark-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-button transition-colors border-2 border-transparent hover:border-red-200 dark:hover:border-red-800"
            >
              <Trash2 size={16} className="sm:hidden" />
              <Trash2 size={18} className="hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6 overflow-y-auto mb-2 md:mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn px-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-soft-orange to-peach dark:from-dark-orange/30 dark:to-dark-orange/10 rounded-full flex items-center justify-center mb-4 md:mb-6 animate-float border-2 border-peach dark:border-dark-orange/40">
              <Bot size={28} className="text-deep-orange dark:text-dark-orange sm:hidden" />
              <Bot size={32} className="text-deep-orange dark:text-dark-orange hidden sm:block md:hidden" />
              <Bot size={40} className="text-deep-orange dark:text-dark-orange hidden md:block" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-dark-text mb-2 font-playfair">Ready to help you learn!</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-muted mb-4 sm:mb-6 md:mb-8 max-w-md px-2">
              I can explain concepts, solve problems, summarize topics, and help you study more effectively.
            </p>
            
            {/* Suggested Prompts */}
            <div className="w-full max-w-2xl px-2">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted mb-2 sm:mb-3">Try asking:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(prompt)}
                    className="p-2.5 sm:p-3 bg-cream dark:bg-dark-card-hover hover:bg-soft-orange dark:hover:bg-dark-border text-left text-xs sm:text-sm text-gray-700 dark:text-dark-text rounded-input border-2 border-border-dark dark:border-dark-border hover:border-brand-orange dark:hover:border-dark-orange transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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
                      ? 'bg-gradient-to-br from-brand-orange to-deep-orange' 
                      : 'bg-gradient-to-br from-gray-700 to-gray-900'
                  }`}>
                    {msg.role === 'user' ? (
                      <User size={14} className="text-white sm:hidden" />
                    ) : (
                      <Bot size={14} className="text-white sm:hidden" />
                    )}
                    {msg.role === 'user' ? (
                      <User size={16} className="text-white hidden sm:block" />
                    ) : (
                      <Bot size={16} className="text-white hidden sm:block" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div
                    className={`p-2.5 sm:p-3 md:p-4 rounded-card border-2 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange text-white border-brand-orange dark:border-dark-orange'
                        : msg.error 
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800'
                          : 'bg-cream dark:bg-dark-card-hover text-gray-900 dark:text-dark-text border-border-dark dark:border-dark-border'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none text-sm sm:text-base">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={`mb-1 last:mb-0 ${msg.role === 'user' ? 'text-white' : ''} break-words`}>
                          {line || '\u00A0'}
                        </p>
                      ))}
                    </div>
                    
                    {/* Copy button for assistant messages */}
                    {msg.role === 'assistant' && !msg.error && (
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-dark-text-muted hover:text-brand-orange dark:hover:text-dark-orange transition-colors"
                      >
                        {copied === idx ? (
                          <>
                            <Check size={12} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Streaming message */}
            {streamingContent && (
              <div className="flex justify-start message-bubble">
                <div className="flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[85%] md:max-w-[80%]">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-dark-border dark:to-dark-card flex items-center justify-center flex-shrink-0 border-2 border-gray-600 dark:border-dark-border-strong">
                    <Bot size={14} className="text-white sm:hidden" />
                    <Bot size={16} className="text-white hidden sm:block" />
                  </div>
                  <div className="p-2.5 sm:p-3 md:p-4 rounded-card border-2 bg-cream dark:bg-dark-card-hover text-gray-900 dark:text-dark-text border-border-dark dark:border-dark-border">
                    <div className="prose prose-sm max-w-none text-sm sm:text-base">
                      {streamingContent.split('\n').map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0 break-words">
                          {line || '\u00A0'}
                        </p>
                      ))}
                      <span className="inline-block w-2 h-4 bg-brand-orange animate-pulse ml-1"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading indicator - only show when loading but not streaming */}
            {loading && !streamingContent && (
              <div className="flex justify-start message-bubble">
                <div className="flex gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-dark-border dark:to-dark-card flex items-center justify-center border-2 border-gray-600 dark:border-dark-border-strong">
                    <Bot size={14} className="text-white sm:hidden" />
                    <Bot size={16} className="text-white hidden sm:block" />
                  </div>
                  <div className="bg-cream dark:bg-dark-card-hover p-2.5 sm:p-3 md:p-4 rounded-card border-2 border-border-dark dark:border-dark-border">
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin text-brand-orange dark:text-dark-orange" size={16} />
                      <span className="text-gray-600 dark:text-dark-text-muted text-xs sm:text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Regenerate button */}
      {messages.length >= 2 && !loading && messages[messages.length - 1].role === 'assistant' && (
        <div className="flex justify-center mb-2">
          <button
            onClick={regenerateResponse}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-dark-text-muted hover:text-brand-orange dark:hover:text-dark-orange transition-colors"
          >
            <RefreshCw size={14} />
            Regenerate response
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-2.5 sm:p-3 md:p-4">
        <div className="flex gap-2 sm:gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            rows={1}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-cream dark:bg-dark-bg border-2 border-border-dark dark:border-dark-border rounded-input focus:outline-none focus:border-brand-orange dark:focus:border-dark-orange resize-none text-sm sm:text-base text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-text-muted"
            style={{ minHeight: '44px', maxHeight: '100px' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange text-white rounded-button border-2 border-brand-orange dark:border-dark-orange hover:from-deep-orange hover:to-dark-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 btn-glow"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            <span className="font-medium hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-dark-text-muted mt-1.5 sm:mt-2 text-center hidden sm:block">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  )
}
