'use client'
import { useState, useRef, useEffect } from 'react'
import { Mic, Square, FileText, Loader2, Play, Pause, Trash2, Download, Copy, Check, Volume2 } from 'lucide-react'

export default function VoiceNotes() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [formattedNotes, setFormattedNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [copied, setCopied] = useState(false)
  const [browserSupported, setBrowserSupported] = useState(true)
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setBrowserSupported(false)
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    let finalTranscriptBuffer = ''

    recognition.onresult = (event) => {
      let interimTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscriptBuffer += transcript + ' '
          setTranscript(finalTranscriptBuffer)
        } else {
          interimTranscript += transcript
        }
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access to use voice notes.')
      }
      stopRecording()
    }

    recognition.onend = () => {
      if (isRecording) {
        // Restart if still supposed to be recording
        try {
          recognition.start()
        } catch (e) {
          console.error('Failed to restart recognition:', e)
        }
      }
    }

    recognition.start()
    recognitionRef.current = recognition
    setIsRecording(true)
    setRecordingTime(0)

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRecording(false)
  }

  const formatNotes = async () => {
    if (!transcript.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: transcript, type: 'voice' }),
      })

      const data = await response.json()
      if (data.error) {
        setFormattedNotes('Error formatting notes. Please try again.')
      } else {
        setFormattedNotes(data.summary)
      }
    } catch (error) {
      console.error('Error:', error)
      setFormattedNotes('Connection error. Please check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearAll = () => {
    setTranscript('')
    setFormattedNotes('')
    setRecordingTime(0)
  }

  const copyNotes = () => {
    navigator.clipboard.writeText(formattedNotes)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadNotes = () => {
    const blob = new Blob([formattedNotes], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'study-notes.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!browserSupported) {
    return (
      <div className="max-w-4xl mx-auto px-2">
        <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-4 sm:p-6 md:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-red-200 dark:border-red-800">
            <Mic size={32} className="text-red-500 dark:text-red-400 sm:hidden" />
            <Mic size={40} className="text-red-500 dark:text-red-400 hidden sm:block" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text mb-2 font-playfair">Browser Not Supported</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-muted mb-4">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6 mb-2 md:mb-4 card-hover">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange rounded-button flex items-center justify-center flex-shrink-0 border-2 border-brand-orange/30 dark:border-dark-orange/50">
            <Mic size={20} className="text-white sm:hidden" />
            <Mic size={24} className="text-white hidden sm:block md:hidden" />
            <Mic size={28} className="text-white hidden md:block" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-text font-playfair">Voice to Study Notes</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-muted mt-0.5 hidden sm:block">Speak your thoughts, get organized notes instantly</p>
          </div>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6 mb-2 md:mb-4">
        <div className="flex flex-col items-center">
          {/* Recording Status */}
          <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mb-4 md:mb-6 transition-all border-2 ${
            isRecording 
              ? 'bg-red-500 animate-pulse-ring border-red-400' 
              : 'bg-gradient-to-br from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange border-brand-orange/50 dark:border-dark-orange'
          }`}>
            {isRecording ? (
              <div className="text-center text-white">
                <Volume2 size={24} className="mx-auto mb-1 animate-pulse sm:hidden" />
                <Volume2 size={32} className="mx-auto mb-1 animate-pulse hidden sm:block" />
                <span className="text-sm sm:text-lg font-bold">{formatTime(recordingTime)}</span>
              </div>
            ) : (
              <>
                <Mic size={32} className="text-white sm:hidden" />
                <Mic size={40} className="text-white hidden sm:block md:hidden" />
                <Mic size={48} className="text-white hidden md:block" />
              </>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange text-white rounded-button border-2 border-brand-orange dark:border-dark-orange hover:from-deep-orange hover:to-dark-orange transition-all flex items-center gap-2 sm:gap-3 font-medium btn-glow text-sm sm:text-base"
              >
                <Mic size={18} className="sm:hidden" />
                <Mic size={24} className="hidden sm:block" />
                <span className="hidden sm:inline">Start</span> Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-red-500 text-white rounded-button border-2 border-red-600 hover:bg-red-600 transition-colors flex items-center gap-2 sm:gap-3 font-medium text-sm sm:text-base"
              >
                <Square size={18} className="sm:hidden" />
                <Square size={24} className="hidden sm:block" />
                Stop
              </button>
            )}

            <button
              onClick={formatNotes}
              disabled={!transcript.trim() || loading || isRecording}
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-deep-orange to-dark-orange dark:from-dark-orange dark:to-deep-orange text-white rounded-button border-2 border-deep-orange dark:border-dark-orange hover:from-dark-orange hover:to-deep-orange transition-all flex items-center gap-2 sm:gap-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed btn-glow text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span className="hidden sm:inline">Formatting...</span>
                </>
              ) : (
                <>
                  <FileText size={18} className="sm:hidden" />
                  <FileText size={24} className="hidden sm:block" />
                  <span className="hidden sm:inline">Format</span> Notes
                </>
              )}
            </button>

            <button
              onClick={clearAll}
              disabled={(!transcript && !formattedNotes) || isRecording}
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gray-200 dark:bg-dark-card-hover text-gray-700 dark:text-dark-text rounded-button border-2 border-gray-300 dark:border-dark-border-strong hover:bg-gray-300 dark:hover:bg-dark-border transition-colors flex items-center gap-2 sm:gap-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <Trash2 size={18} className="sm:hidden" />
              <Trash2 size={24} className="hidden sm:block" />
              <span className="hidden md:inline">Clear All</span>
            </button>
          </div>

          {isRecording && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-muted mt-3 sm:mt-4 animate-pulse text-center">
              🎙️ Listening... Speak clearly
            </p>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
        {/* Raw Transcript */}
        <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6 card-hover">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2 font-playfair">
              <Mic size={16} className="text-brand-orange dark:text-dark-orange sm:hidden" />
              <Mic size={20} className="text-brand-orange dark:text-dark-orange hidden sm:block" />
              Voice Transcript
            </h3>
            {transcript && (
              <span className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted">
                {transcript.split(' ').filter(w => w).length} words
              </span>
            )}
          </div>
          <div className="h-48 sm:h-64 md:h-80 lg:h-96 overflow-y-auto bg-cream dark:bg-dark-bg rounded-input p-3 sm:p-4 border-2 border-border-dark dark:border-dark-border">
            {transcript ? (
              <p className="text-sm sm:text-base text-gray-700 dark:text-dark-text whitespace-pre-wrap leading-relaxed">{transcript}</p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-dark-text-muted">
                <Mic size={36} className="mb-3 opacity-50 sm:hidden" />
                <Mic size={48} className="mb-4 opacity-50 hidden sm:block" />
                <p className="text-center text-sm sm:text-base">
                  Start recording to see your<br />transcript here...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Formatted Notes */}
        <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6 card-hover">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2 font-playfair">
              <FileText size={16} className="text-deep-orange dark:text-dark-orange sm:hidden" />
              <FileText size={20} className="text-deep-orange dark:text-dark-orange hidden sm:block" />
              <span className="hidden sm:inline">Formatted</span> Study Notes
            </h3>
            {formattedNotes && (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={copyNotes}
                  className="p-1.5 sm:p-2 hover:bg-soft-orange dark:hover:bg-dark-card-hover rounded-input transition-colors"
                  title="Copy notes"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-gray-600 dark:text-dark-text-muted" />
                  )}
                </button>
                <button
                  onClick={downloadNotes}
                  className="p-1.5 sm:p-2 hover:bg-soft-orange dark:hover:bg-dark-card-hover rounded-input transition-colors"
                  title="Download as markdown"
                >
                  <Download size={16} className="text-gray-600 dark:text-dark-text-muted" />
                </button>
              </div>
            )}
          </div>
          <div className="h-48 sm:h-64 md:h-80 lg:h-96 overflow-y-auto bg-gradient-to-br from-soft-orange to-peach dark:from-dark-card-hover dark:to-dark-bg rounded-input p-3 sm:p-4 border-2 border-deep-orange dark:border-dark-orange">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Loader2 size={36} className="animate-spin text-deep-orange dark:text-dark-orange mb-3 sm:hidden" />
                <Loader2 size={48} className="animate-spin text-deep-orange dark:text-dark-orange mb-4 hidden sm:block" />
                <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-muted">AI is organizing your notes...</p>
              </div>
            ) : formattedNotes ? (
              <div className="prose prose-sm max-w-none text-gray-900 dark:text-dark-text text-sm sm:text-base">
                {formattedNotes.split('\n').map((line, i) => {
                  // Basic markdown rendering
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-xl font-bold mb-2">{line.slice(2)}</h1>
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-lg font-bold mb-2">{line.slice(3)}</h2>
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-base font-bold mb-1">{line.slice(4)}</h3>
                  }
                  if (line.startsWith('- ') || line.startsWith('* ')) {
                    return <li key={i} className="ml-4 mb-1">{line.slice(2)}</li>
                  }
                  if (line.match(/^\d+\./)) {
                    return <li key={i} className="ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>
                  }
                  if (line.trim() === '') {
                    return <br key={i} />
                  }
                  return <p key={i} className="mb-2">{line}</p>
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-dark-text-muted">
                <FileText size={36} className="mb-3 opacity-50 sm:hidden" />
                <FileText size={48} className="mb-4 opacity-50 hidden sm:block" />
                <p className="text-center text-sm sm:text-base">
                  Formatted notes will appear<br />here after processing...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-2 md:mt-4 bg-soft-orange dark:bg-dark-orange/20 border-2 border-deep-orange dark:border-dark-orange rounded-card p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-700 dark:text-dark-text">
          <strong>💡 Tips:</strong> Speak clearly and at a moderate pace. 
          <span className="hidden sm:inline">Pause briefly between different topics. The AI will organize your thoughts into structured notes with headings and bullet points.</span>
        </p>
      </div>
    </div>
  )
}
