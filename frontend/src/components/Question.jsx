import React from 'react'

function Question({ question, options, selected, onSelect, showCorrect, correctAnswer, explanation }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-slate-800">{question}</h2>
      
      <div className="flex flex-col gap-2">
        {options.map((opt, idx) => {
          let bg = 'bg-white'
          let text = 'text-slate-700 hover:bg-slate-100'

          if (showCorrect) {
            if (opt === correctAnswer) {
              bg = 'bg-green-200 text-green-800'
            } else if (opt === selected && selected !== correctAnswer) {
              bg = 'bg-red-200 text-red-800'
            } else {
              bg = 'bg-slate-100'
            }
          } else if (selected === opt) {
            bg = 'bg-blue-200 text-blue-800'
          }

          return (
            <button
              key={idx}
              onClick={() => onSelect(opt)}
              disabled={showCorrect}
              className={`px-4 py-2 rounded-md border border-slate-300 text-left ${bg} ${text} transition`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Show explanation if needed */}
      {showCorrect && (
        <p className="mt-2 text-sm text-slate-600">{explanation}</p>
      )}
    </div>
  )
}

export default Question