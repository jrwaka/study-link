import React from 'react'

function Question({ question, options, selected, onSelect }) {
  return (
    <div className='w-full'>
      <div className='mb-4 text-base sm:text-lg font-medium text-gray-700'>
        {question}
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {options.map((option, idx) => (
          <button
            key={idx}
            className={`px-6 py-3 rounded-lg border text-base font-medium transition-all duration-200 ${selected === option ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-300'} hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm`}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Question
