import React, { useState } from 'react'
import Question from './components/Question'
import Score from './components/Score'

const quizData = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'London', 'Paris', 'Madrid'],
    answer: 'Paris',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    answer: 'Mars',
  },
  {
    question: 'Who wrote "Hamlet"?',
    options: [
      'Charles Dickens',
      'William Shakespeare',
      'Mark Twain',
      'Jane Austen',
    ],
    answer: 'William Shakespeare',
  },
]

function Quiz() {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selected, setSelected] = useState(null)

  const handleOptionClick = (option) => {
    setSelected(option)
  }

  const handleNext = () => {
    if (selected === quizData[current].answer) {
      setScore(score + 1)
    }
    setSelected(null)
    if (current < quizData.length - 1) {
      setCurrent(current + 1)
    } else {
      setShowScore(true)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setScore(0)
    setShowScore(false)
    setSelected(null)
  }

  return (
    <div className='w-full max-w-md bg-white rounded-2xl shadow-lg flex flex-col items-center p-10 mx-auto'>
      <h1 className='text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2'>
        Quiz
      </h1>
      <p className='text-gray-500 text-center mb-6 text-base sm:text-lg'>
        Enter your answers to access your score
      </p>
      {showScore ? (
        <Score
          score={score}
          total={quizData.length}
          onRestart={handleRestart}
        />
      ) : (
        <div className='w-full flex flex-col items-center gap-4'>
          <Question
            question={quizData[current].question}
            options={quizData[current].options}
            selected={selected}
            onSelect={handleOptionClick}
          />
          <button
            className='w-full mt-6 px-6 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-all duration-200'
            onClick={handleNext}
            disabled={selected === null}
          >
            {current === quizData.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      )}
      <div className='mt-6 text-center text-sm text-gray-400'>
        Powered by Study Link
      </div>
    </div>
  )
}

export default Quiz
