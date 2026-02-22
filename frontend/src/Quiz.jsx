import React, { useState, useEffect, useRef } from 'react'
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
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [loading, setLoading] = useState(false)

  const scoreRef = useRef(0)
  const subjects = ['HISTORY', 'LANGUAGE', 'GEOGRAPHY', 'ECONOMICS', 'CULTURE']

  useEffect(() => {
    if (!category) return
    fetch(`http://127.0.0.1:8000/api/quiz/questions/?category=${category}`)
      .then(res => res.json())
      .then(data => setQuizData(data.questions))
      .catch(err => console.error(err))
    setCurrent(0); setScore(0); scoreRef.current = 0
    setShowScore(false); setSelected(null); setShowCorrect(false)
    setCurrentExplanation(''); setCorrectAnswer(null)
  }, [category])

  const handleNext = async () => {
    if (!selected || loading) return
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/quiz/check-answer/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: quizData[current].id, selected_answer: selected })
      })
      const data = await res.json()
      if (data.is_correct) { scoreRef.current += 1; setScore(scoreRef.current) }
      setCorrectAnswer(data.correct_answer)
      setCurrentExplanation(data.explanation)
      setShowCorrect(true)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }

    setTimeout(() => {
      setShowCorrect(false); setSelected(null)
      setCurrentExplanation(''); setCorrectAnswer(null)
      if (current < quizData.length - 1) setCurrent(c => c + 1)
      else setShowScore(true)
    }, 2500)
  }

  const handleRestart = () => {
    setCategory(''); setQuizData([]); setCurrent(0); setScore(0)
    scoreRef.current = 0; setShowScore(false); setSelected(null)
    setShowCorrect(false); setCurrentExplanation(''); setCorrectAnswer(null)
    fetch('http://127.0.0.1:8000/api/quiz/reset/', { method: 'POST' }).catch(console.error)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>Study Link Quiz</h1>
      <p style={{ color: '#94a3b8', marginBottom: 36, fontSize: 15 }}>Choose a subject to begin</p>

      {!category && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 480 }}>
          {subjects.map(sub => (
            <button key={sub} onClick={() => setCategory(sub)} style={{ padding: '10px 20px', borderRadius: 99, border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {sub}
            </button>
          ))}
        </div>
      )}

      {quizData.length > 0 && !showScore && (
        <div style={{ width: '100%', maxWidth: 520, background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '36px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>
            <span>Question {current + 1} / {quizData.length}</span>
            <span style={{ color: '#6366f1', fontWeight: 600 }}>{category}</span>
          </div>
          <div style={{ height: 4, background: '#f1f5f9', borderRadius: 99, marginBottom: 28, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((current + 1) / quizData.length) * 100}%`, background: '#6366f1', borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>

          <Question
            question={quizData[current].question_text}
            options={quizData[current].options}
            selected={selected}
            onSelect={setSelected}
            showCorrect={showCorrect}
            correctAnswer={correctAnswer}
            explanation={currentExplanation}
          />

          <button onClick={handleNext} disabled={!selected || showCorrect || loading}
            style={{ marginTop: 24, marginLeft: 'auto', display: 'block', padding: '11px 26px', background: !selected || showCorrect || loading ? '#e2e8f0' : '#6366f1', color: !selected || showCorrect || loading ? '#94a3b8' : '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: !selected || showCorrect || loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Checking…' : current === quizData.length - 1 ? 'Finish →' : 'Next →'}
          </button>
        </div>
      )}

      {showScore && (
        <Score score={scoreRef.current} total={quizData.length} onRestart={handleRestart} />
      )}
    </div>
  )
}

export default Quiz