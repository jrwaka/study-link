import React, { useState, useEffect } from 'react'
import Question from './components/Question'
import Score from './components/Score'

function Quiz() {
  const [category, setCategory] = useState('')
  const [quizData, setQuizData] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showCorrect, setShowCorrect] = useState(false)
  const [currentExplanation, setCurrentExplanation] = useState('')

  const subjects = ['HISTORY', 'LANGUAGE', 'GEOGRAPHY', 'ECONOMICS', 'CULTURE']

  // Fetch questions when category changes
  useEffect(() => {
    if (!category) return

    fetch(`http://127.0.0.1:8000/api/quiz/questions/?category=${category}`)
      .then(res => res.json())
      .then(data => setQuizData(data.questions))
      .catch(err => console.error(err))

    // Reset quiz state
    setCurrent(0)
    setScore(0)
    setShowScore(false)
    setSelected(null)
    setShowCorrect(false)
    setCurrentExplanation('')
  }, [category])

  const handleNext = () => {
    if (!selected) return

    // Show correct answer + explanation
    setShowCorrect(true)
    setCurrentExplanation(quizData[current].explanation)

    // Update score
    if (selected === quizData[current].correct_answer) {
      setScore(s => s + 1)
    }

    // Move to next question after 1.2s
    setTimeout(() => {
      setShowCorrect(false)
      setSelected(null)
      setCurrentExplanation('')

      if (current < quizData.length - 1) setCurrent(c => c + 1)
      else setShowScore(true)
    }, 1200)
  }

  const handleRestart = () => {
    setCategory('')
    setQuizData([])
    setCurrent(0)
    setScore(0)
    setShowScore(false)
    setSelected(null)
    setShowCorrect(false)
    setCurrentExplanation('')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-6 py-16">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Study Link Quiz</h1>
      <p className="text-slate-500 mb-10">Choose a subject to begin</p>

      {/* SUBJECT SELECTION */}
      {!category && (
        <div className="flex flex-wrap gap-3 justify-center max-w-xl">
          {subjects.map(sub => (
            <button
              key={sub}
              onClick={() => setCategory(sub)}
              className="px-5 py-2 bg-white rounded-full shadow-sm hover:shadow-md text-slate-700 text-sm font-medium transition"
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* QUIZ CARD */}
      {quizData.length > 0 && !showScore && (
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10 mt-10 flex flex-col gap-6">
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
            <div
              className="bg-blue-500 h-2 transition-all duration-300"
              style={{ width: `${((current + 1) / quizData.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-slate-400 mb-2">
            Question {current + 1} / {quizData.length}
          </p>

          <Question
            question={quizData[current].question_text}
            options={quizData[current].options}
            selected={selected}
            onSelect={setSelected}
            showCorrect={showCorrect}
            correctAnswer={quizData[current].correct_answer}
            explanation={currentExplanation}
          />

          <button
            onClick={handleNext}
            disabled={!selected || showCorrect}
            className="self-end text-blue-600 font-semibold hover:underline disabled:text-gray-300"
          >
            {current === quizData.length - 1 ? 'Finish →' : 'Next →'}
          </button>
        </div>
      )}

      {/* SCORE CARD */}
      {showScore && (
        <Score score={score} total={quizData.length} onRestart={handleRestart} />
      )}

      <p className="mt-20 text-xs text-slate-400">Powered by Study Link</p>
    </div>
  )
}

export default Quiz