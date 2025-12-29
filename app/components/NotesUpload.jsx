'use client'
import { useState, useRef } from 'react'
import { Upload, FileText, Loader2, Sparkles, Image, File, X, Copy, Check, Download, ClipboardList } from 'lucide-react'

export default function NotesUpload() {
  const [file, setFile] = useState(null)
  const [textInput, setTextInput] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputMode, setInputMode] = useState('upload') // 'upload' or 'text'
  const [copied, setCopied] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (uploadedFile) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    
    if (!allowedTypes.includes(uploadedFile.type) && !uploadedFile.name.endsWith('.txt') && !uploadedFile.name.endsWith('.md')) {
      alert('Please upload a TXT, MD, PDF, or image file (JPG, PNG)')
      return
    }

    setFile(uploadedFile)
    
    // If it's a text file, read its content
    if (uploadedFile.type === 'text/plain' || uploadedFile.name.endsWith('.txt') || uploadedFile.name.endsWith('.md')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setTextInput(e.target.result)
      }
      reader.readAsText(uploadedFile)
    }
  }

  const summarizeContent = async () => {
    const content = textInput.trim()
    if (!content) {
      alert('Please enter or upload some text content first')
      return
    }

    setLoading(true)
    setSummary('')

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: 'text' }),
      })

      const data = await response.json()
      
      if (data.error) {
        setSummary('Error generating summary. Please try again.')
      } else {
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error:', error)
      setSummary('Connection error. Please check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateQuiz = async () => {
    const content = textInput.trim() || summary.trim()
    if (!content) {
      alert('Please enter or upload some text content first')
      return
    }

    // Store content for quiz generation and switch tab (this would need to be handled by parent)
    localStorage.setItem('quizContent', content)
    alert('Content saved! Go to Quiz Generator tab to create a quiz from this content.')
  }

  const clearAll = () => {
    setFile(null)
    setTextInput('')
    setSummary('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'summary.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileIcon = () => {
    if (!file) return <Upload size={48} className="text-brand-orange" />
    if (file.type.startsWith('image/')) return <Image size={48} className="text-brand-orange" />
    return <File size={48} className="text-brand-orange" />
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6 mb-2 md:mb-4 card-hover">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange rounded-button flex items-center justify-center flex-shrink-0 border-2 border-brand-orange/30 dark:border-dark-orange/50">
            <FileText size={20} className="text-white sm:hidden" />
            <FileText size={24} className="text-white hidden sm:block md:hidden" />
            <FileText size={28} className="text-white hidden md:block" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-text font-playfair">Upload Study Notes</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-muted mt-0.5 hidden sm:block">Get instant AI-powered summaries from your notes</p>
          </div>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-2 sm:p-3 md:p-4 mb-2 md:mb-4">
        <div className="flex gap-2 sm:gap-4 justify-center">
          <button
            onClick={() => setInputMode('upload')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-button font-medium transition-all text-sm sm:text-base ${
              inputMode === 'upload'
                ? 'bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange text-white border-2 border-brand-orange dark:border-dark-orange'
                : 'bg-cream dark:bg-dark-card-hover text-gray-700 dark:text-dark-text border-2 border-border-dark dark:border-dark-border hover:border-brand-orange dark:hover:border-dark-orange'
            }`}
          >
            <Upload size={16} className="inline mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Upload</span> File
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-button font-medium transition-all text-sm sm:text-base ${
              inputMode === 'text'
                ? 'bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange text-white border-2 border-brand-orange dark:border-dark-orange'
                : 'bg-cream dark:bg-dark-card-hover text-gray-700 dark:text-dark-text border-2 border-border-dark dark:border-dark-border hover:border-brand-orange dark:hover:border-dark-orange'
            }`}
          >
            <FileText size={16} className="inline mr-1.5 sm:mr-2" />
            Paste Text
          </button>
        </div>
      </div>

      {/* Content Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-4">
        {/* Left Side - Input */}
        <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-dark-text mb-3 sm:mb-4 flex items-center gap-2 font-playfair">
            <FileText size={16} className="text-brand-orange dark:text-dark-orange sm:hidden" />
            <FileText size={20} className="text-brand-orange dark:text-dark-orange hidden sm:block" />
            Your Notes
          </h3>

          {inputMode === 'upload' ? (
            <>
              {/* Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-4 border-dashed rounded-card bg-cream dark:bg-dark-bg cursor-pointer transition-all ${
                  dragActive
                    ? 'border-brand-orange dark:border-dark-orange bg-soft-orange dark:bg-dark-orange/20'
                    : 'border-gray-300 dark:border-dark-border hover:border-brand-orange dark:hover:border-dark-orange hover:bg-light-orange dark:hover:bg-dark-card-hover'
                }`}
              >
                <label className="flex flex-col items-center justify-center h-32 sm:h-40 md:h-48 cursor-pointer px-3">
                  <Upload size={32} className="text-brand-orange dark:text-dark-orange sm:hidden" />
                  <Upload size={40} className="text-brand-orange dark:text-dark-orange hidden sm:block md:hidden" />
                  <Upload size={48} className="text-brand-orange dark:text-dark-orange hidden md:block" />
                  <span className="text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-dark-text mt-3 sm:mt-4 text-center">
                    {file ? file.name : 'Drop file here or tap to upload'}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted mt-1 sm:mt-2">
                    TXT, MD, PDF, JPG, PNG
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".txt,.md,.pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </label>

                {file && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      clearAll()
                    }}
                    className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X size={14} className="sm:hidden" />
                    <X size={18} className="hidden sm:block" />
                  </button>
                )}
              </div>

              {/* Text preview from file */}
              {textInput && (
                <div className="mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-muted mb-1.5 sm:mb-2">Content Preview:</p>
                  <div className="h-28 sm:h-32 md:h-40 overflow-y-auto bg-cream dark:bg-dark-bg rounded-input p-3 sm:p-4 border-2 border-border-dark dark:border-dark-border">
                    <p className="text-gray-700 dark:text-dark-text text-xs sm:text-sm whitespace-pre-wrap">
                      {textInput.slice(0, 500)}{textInput.length > 500 ? '...' : ''}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Text Input Area */
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your study notes, lecture content, or any text you want to summarize..."
              className="w-full h-48 sm:h-56 md:h-72 px-3 sm:px-4 py-2.5 sm:py-3 bg-cream dark:bg-dark-bg border-2 border-border-dark dark:border-dark-border rounded-input focus:outline-none focus:border-brand-orange dark:focus:border-dark-orange resize-none text-sm sm:text-base text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-text-muted"
            />
          )}

          {/* Word Count */}
          {textInput && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted mt-1.5 sm:mt-2">
              {textInput.split(/\s+/).filter(w => w).length} words
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
            <button
              onClick={summarizeContent}
              disabled={!textInput.trim() || loading}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange text-white rounded-button border-2 border-brand-orange dark:border-dark-orange hover:from-deep-orange hover:to-dark-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 btn-glow text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Summarize
                </>
              )}
            </button>
            <button
              onClick={generateQuiz}
              disabled={!textInput.trim() && !summary.trim()}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-deep-orange text-white rounded-button border-2 border-deep-orange hover:bg-dark-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <ClipboardList size={18} />
              Make Quiz
            </button>
          </div>
        </div>

        {/* Right Side - Summary */}
        <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2 font-playfair">
              <Sparkles size={16} className="text-deep-orange dark:text-dark-orange sm:hidden" />
              <Sparkles size={20} className="text-deep-orange dark:text-dark-orange hidden sm:block" />
              AI Summary
            </h3>
            {summary && (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 sm:p-2 hover:bg-soft-orange dark:hover:bg-dark-card-hover rounded-input transition-colors"
                  title="Copy summary"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-gray-600 dark:text-dark-text-muted" />
                  )}
                </button>
                <button
                  onClick={downloadSummary}
                  className="p-1.5 sm:p-2 hover:bg-soft-orange dark:hover:bg-dark-card-hover rounded-input transition-colors"
                  title="Download as markdown"
                >
                  <Download size={16} className="text-gray-600 dark:text-dark-text-muted" />
                </button>
              </div>
            )}
          </div>

          <div className="h-48 sm:h-64 md:h-80 overflow-y-auto bg-gradient-to-br from-soft-orange to-peach dark:from-dark-card-hover dark:to-dark-bg rounded-input p-3 sm:p-4 border-2 border-deep-orange dark:border-dark-orange">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Loader2 size={36} className="animate-spin text-deep-orange dark:text-dark-orange mb-3 sm:hidden" />
                <Loader2 size={48} className="animate-spin text-deep-orange dark:text-dark-orange mb-4 hidden sm:block" />
                <p className="text-sm sm:text-base text-gray-700 dark:text-dark-text font-medium">Analyzing your notes...</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted mt-1 sm:mt-2 hidden sm:block">Extracting key concepts</p>
              </div>
            ) : summary ? (
              <div className="prose prose-sm max-w-none text-gray-900 dark:text-dark-text text-sm sm:text-base">
                {summary.split('\n').map((line, i) => {
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
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold mb-2">{line.slice(2, -2)}</p>
                  }
                  if (line.trim() === '') {
                    return <br key={i} />
                  }
                  return <p key={i} className="mb-2">{line}</p>
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-dark-text-muted">
                <Sparkles size={36} className="mb-3 opacity-50 sm:hidden" />
                <Sparkles size={48} className="mb-4 opacity-50 hidden sm:block" />
                <p className="text-center text-sm sm:text-base">
                  Your AI-powered summary<br />will appear here...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-soft-orange dark:bg-dark-orange/20 border-2 border-deep-orange dark:border-dark-orange rounded-card p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-700 dark:text-dark-text">
          <strong>💡 Pro Tips:</strong> For best results, upload clean text files.
          <span className="hidden sm:inline"> The AI will extract key concepts, definitions, and important facts. You can then use the "Make Quiz" button to test your knowledge!</span>
        </p>
      </div>
    </div>
  )
}
