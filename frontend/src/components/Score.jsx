import React from 'react'

function Score({ score, total, onRestart }) {
  return (
    <div className='text-center flex flex-col items-center'>
      <h2 className='text-2xl font-bold mb-4 text-gray-900'>
        Your Score: {score} / {total}
      </h2>
      <button
        className='mt-4 px-6 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200'
        onClick={onRestart}
      >
        Restart Quiz
      </button>
    </div>
  )
}

export default Score
