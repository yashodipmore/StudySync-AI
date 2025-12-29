'use client'
import { useState, useEffect } from 'react'
import { ClipboardList, Loader2, CheckCircle2, XCircle, Trophy, RotateCcw, Sparkles, ChevronRight, AlertCircle } from 'lucide-react'

export default function QuizGenerator() {
  const [content, setContent] = useState('')
  const [quiz, setQuiz] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [numQuestions, setNumQuestions] = useState(5)

  // Check for saved content from NotesUpload
  useEffect(() => {
    const savedContent = localStorage.getItem('quizContent')
    if (savedContent) {
      setContent(savedContent)
      localStorage.removeItem('quizContent')
    }
  }, [])

  const generateQuiz = async () => {
    if (!content.trim()) {
      alert('Please enter some content to generate a quiz from')
      return
    }

    setLoading(true)
    setQuiz([])
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setQuizCompleted(false)

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, numQuestions }),
      })

      const data = await response.json()
      
      if (data.error) {
        alert('Error generating quiz. Please try again.')
      } else if (data.quiz && data.quiz.length > 0) {
        setQuiz(data.quiz)
      } else {
        alert('Could not generate quiz. Please try with different content.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Connection error. Please check your internet and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (optionIndex) => {
    if (showResult) return
    setSelectedAnswer(optionIndex)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === quiz[currentQuestion].correct
    setShowResult(true)
    
    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    setAnswers(prev => [...prev, {
      question: currentQuestion,
      selected: selectedAnswer,
      correct: quiz[currentQuestion].correct,
      isCorrect
    }])
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setQuizCompleted(false)
  }

  const newQuiz = () => {
    setQuiz([])
    restartQuiz()
  }

  const getScoreMessage = () => {
    const percentage = (score / quiz.length) * 100
    if (percentage === 100) return { message: "Perfect Score! 🎉", color: "text-green-600" }
    if (percentage >= 80) return { message: "Excellent Work! 🌟", color: "text-green-500" }
    if (percentage >= 60) return { message: "Good Job! 👍", color: "text-yellow-600" }
    if (percentage >= 40) return { message: "Keep Practicing! 💪", color: "text-orange-500" }
    return { message: "Time to Review! 📚", color: "text-red-500" }
  }

  // Sample topics for quiz
  const sampleTopics = [
    "Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen. This occurs in the chloroplasts, specifically in the thylakoid membranes where light reactions occur, and the stroma where the Calvin cycle takes place.",
    "Newton's Laws of Motion: 1) An object at rest stays at rest unless acted upon by a force. 2) Force equals mass times acceleration (F=ma). 3) For every action, there is an equal and opposite reaction.",
    "The French Revolution began in 1789 and led to major political and social changes in France. Key events include the storming of the Bastille, the Reign of Terror, and the rise of Napoleon Bonaparte.",
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6 mb-2 md:mb-4 card-hover">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange rounded-button flex items-center justify-center flex-shrink-0 border-2 border-brand-orange/30 dark:border-dark-orange/50">
            <ClipboardList size={20} className="text-white sm:hidden" />
            <ClipboardList size={24} className="text-white hidden sm:block md:hidden" />
            <ClipboardList size={28} className="text-white hidden md:block" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-text font-playfair">Quiz Generator</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-muted mt-0.5 hidden sm:block">Test your knowledge with AI-generated quizzes</p>
          </div>
        </div>
      </div>

      {quiz.length === 0 ? (
        // Quiz Setup Screen
        <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Left - Content Input */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-dark-text mb-3 sm:mb-4 flex items-center gap-2 font-playfair">
                <Sparkles size={16} className="text-brand-orange dark:text-dark-orange sm:hidden" />
                <Sparkles size={20} className="text-brand-orange dark:text-dark-orange hidden sm:block" />
                Content for Quiz
              </h3>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your study notes, textbook content, or any material you want to be quizzed on..."
                className="w-full h-40 sm:h-52 md:h-64 px-3 sm:px-4 py-2.5 sm:py-3 bg-cream dark:bg-dark-bg border-2 border-border-dark dark:border-dark-border rounded-input focus:outline-none focus:border-brand-orange dark:focus:border-dark-orange resize-none text-sm sm:text-base text-gray-900 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-text-muted"
              />
              <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted mt-2">
                {content.split(/\s+/).filter(w => w).length} words
              </p>

              {/* Settings */}
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-soft-orange dark:bg-dark-orange/20 rounded-input border-2 border-deep-orange/30 dark:border-dark-orange/40">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                  Number of Questions
                </label>
                <div className="flex flex-wrap gap-2">
                  {[3, 5, 7, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumQuestions(num)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-button text-sm sm:text-base font-medium transition-all ${
                        numQuestions === num
                          ? 'bg-brand-orange dark:bg-dark-orange text-white'
                          : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text border-2 border-border-dark dark:border-dark-border hover:border-brand-orange dark:hover:border-dark-orange'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateQuiz}
                disabled={!content.trim() || loading}
                className="w-full mt-3 sm:mt-4 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange text-white rounded-button border-2 border-brand-orange dark:border-dark-orange hover:from-deep-orange hover:to-dark-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 btn-glow text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating...
                  </>
                ) : (
                  <>
                    <ClipboardList size={20} />
                    Generate Quiz
                  </>
                )}
              </button>
            </div>

            {/* Right - Sample Topics */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-dark-text mb-3 sm:mb-4 font-playfair">Try a Sample Topic</h3>
              <div className="space-y-2 sm:space-y-3">
                {sampleTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => setContent(topic)}
                    className="w-full p-3 sm:p-4 bg-cream dark:bg-dark-card-hover hover:bg-soft-orange dark:hover:bg-dark-border text-left text-xs sm:text-sm text-gray-700 dark:text-dark-text rounded-input border-2 border-border-dark dark:border-dark-border hover:border-brand-orange dark:hover:border-dark-orange transition-all"
                  >
                    <p className="line-clamp-2">{topic}</p>
                  </button>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-light-orange dark:bg-dark-orange/20 rounded-card border-2 border-deep-orange/30 dark:border-dark-orange/40">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertCircle size={16} className="text-deep-orange dark:text-dark-orange flex-shrink-0 mt-0.5 sm:hidden" />
                  <AlertCircle size={20} className="text-deep-orange dark:text-dark-orange flex-shrink-0 mt-0.5 hidden sm:block" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-dark-text">Tips for better quizzes</p>
                    <ul className="text-[10px] sm:text-xs text-gray-600 dark:text-dark-text-muted mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
                      <li>• Include factual information and key concepts</li>
                      <li>• More detailed content = better questions</li>
                      <li className="hidden sm:block">• Include definitions, dates, and specific facts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !quizCompleted ? (
        // Quiz in Progress
        <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-3 sm:p-4 md:p-6">
          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-dark-text-muted">
                Question {currentQuestion + 1} of {quiz.length}
              </span>
              <span className="text-xs sm:text-sm font-medium text-brand-orange dark:text-dark-orange">
                Score: {score}/{answers.length}
              </span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-dark-text mb-4 sm:mb-6 font-playfair">
              {quiz[currentQuestion]?.question}
            </h3>

            {/* Options */}
            <div className="space-y-2 sm:space-y-3">
              {quiz[currentQuestion]?.options.map((option, idx) => {
                let optionClass = "p-3 sm:p-4 rounded-card border-2 transition-all cursor-pointer quiz-option "
                
                if (showResult) {
                  if (idx === quiz[currentQuestion].correct) {
                    optionClass += "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300"
                  } else if (idx === selectedAnswer && idx !== quiz[currentQuestion].correct) {
                    optionClass += "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300"
                  } else {
                    optionClass += "bg-gray-50 dark:bg-dark-card-hover border-gray-200 dark:border-dark-border text-gray-500 dark:text-dark-text-muted"
                  }
                } else {
                  if (idx === selectedAnswer) {
                    optionClass += "bg-soft-orange dark:bg-dark-orange/30 border-brand-orange dark:border-dark-orange text-gray-900 dark:text-dark-text"
                  } else {
                    optionClass += "bg-cream dark:bg-dark-card-hover border-border-dark dark:border-dark-border hover:border-brand-orange dark:hover:border-dark-orange text-gray-700 dark:text-dark-text"
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showResult}
                    className={optionClass + " w-full text-left flex items-center gap-2 sm:gap-3 text-sm sm:text-base"}
                  >
                    <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                      showResult
                        ? idx === quiz[currentQuestion].correct
                          ? 'bg-green-500 text-white'
                          : idx === selectedAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        : idx === selectedAnswer
                          ? 'bg-brand-orange text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && idx === quiz[currentQuestion].correct && (
                      <CheckCircle2 size={18} className="text-green-500 sm:hidden" />
                    )}
                    {showResult && idx === quiz[currentQuestion].correct && (
                      <CheckCircle2 size={24} className="text-green-500 hidden sm:block" />
                    )}
                    {showResult && idx === selectedAnswer && idx !== quiz[currentQuestion].correct && (
                      <XCircle size={18} className="text-red-500 sm:hidden" />
                    )}
                    {showResult && idx === selectedAnswer && idx !== quiz[currentQuestion].correct && (
                      <XCircle size={24} className="text-red-500 hidden sm:block" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Explanation */}
          {showResult && quiz[currentQuestion]?.explanation && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-soft-orange dark:bg-dark-orange/20 rounded-card border-2 border-deep-orange dark:border-dark-orange animate-fadeIn">
              <p className="text-xs sm:text-sm font-medium text-deep-orange dark:text-dark-orange mb-1">Explanation:</p>
              <p className="text-sm sm:text-base text-gray-700 dark:text-dark-text">{quiz[currentQuestion].explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            {!showResult ? (
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange text-white rounded-button border-2 border-brand-orange dark:border-dark-orange hover:from-deep-orange hover:to-dark-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium btn-glow text-sm sm:text-base"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-brand-orange to-deep-orange dark:from-dark-orange dark:to-deep-orange text-white rounded-button border-2 border-brand-orange dark:border-dark-orange hover:from-deep-orange hover:to-dark-orange transition-all font-medium flex items-center justify-center gap-2 btn-glow text-sm sm:text-base"
              >
                {currentQuestion < quiz.length - 1 ? (
                  <>
                    Next <span className="hidden sm:inline">Question</span>
                    <ChevronRight size={18} />
                  </>
                ) : (
                  <>
                    See Results
                    <Trophy size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        // Quiz Results
        <div className="bg-white dark:bg-dark-card border-2 border-border-dark dark:border-dark-border-strong rounded-card p-4 sm:p-6 md:p-8 text-center animate-scaleIn">
          {/* Trophy */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-float border-2 border-yellow-300">
            <Trophy size={32} className="text-white sm:hidden" />
            <Trophy size={40} className="text-white hidden sm:block md:hidden" />
            <Trophy size={48} className="text-white hidden md:block" />
          </div>

          {/* Score */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-text mb-2 font-playfair">Quiz Complete!</h2>
          <p className={`text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 ${getScoreMessage().color}`}>
            {getScoreMessage().message}
          </p>
          
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-orange dark:text-dark-orange mb-4 sm:mb-6">
            {score}/{quiz.length}
          </div>

          <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-muted mb-4 sm:mb-6 md:mb-8">
            You got {Math.round((score / quiz.length) * 100)}% correct
          </p>

          {/* Answer Review */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-dark-text mb-3 sm:mb-4 text-left font-playfair">Answer Review</h3>
            <div className="space-y-1.5 sm:space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
              {answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-input ${
                    answer.isCorrect ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'
                  }`}
                >
                  {answer.isCorrect ? (
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-red-500 flex-shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-dark-text text-left flex-1 truncate">
                    Q{idx + 1}: {quiz[idx].question.slice(0, 40)}{quiz[idx].question.length > 40 ? '...' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <button
              onClick={restartQuiz}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-orange dark:bg-dark-orange text-white rounded-button border-2 border-brand-orange dark:border-dark-orange hover:bg-deep-orange transition-all font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <RotateCcw size={18} />
              Retry Quiz
            </button>
            <button
              onClick={newQuiz}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-cream dark:bg-dark-card-hover text-gray-700 dark:text-dark-text rounded-button border-2 border-gray-300 dark:border-dark-border-strong hover:border-brand-orange dark:hover:border-dark-orange transition-all font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <ClipboardList size={18} />
              New Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
