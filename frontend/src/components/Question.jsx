import React from 'react'

function Question({ question, options, selected, onSelect, showCorrect, correctAnswer, explanation }) {
  return (
    <div>
      <p style={{ fontSize: 17, fontWeight: 600, color: '#1e293b', lineHeight: 1.5, marginBottom: 20 }}>{question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt, idx) => {
          let bg = '#f8fafc', border = '#e2e8f0', color = '#475569'
          if (showCorrect) {
            if (opt === correctAnswer)             { bg = '#f0fdf4'; border = '#86efac'; color = '#166534' }
            else if (opt === selected)             { bg = '#fef2f2'; border = '#fca5a5'; color = '#991b1b' }
            else                                   { color = '#cbd5e1' }
          } else if (selected === opt) {
            bg = '#eef2ff'; border = '#a5b4fc'; color = '#3730a3'
          }
          return (
            <button key={idx} onClick={() => onSelect(opt)} disabled={showCorrect}
              style={{ textAlign: 'left', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${border}`, background: bg, color, fontSize: 15, cursor: showCorrect ? 'default' : 'pointer', transition: 'all 0.15s' }}>
              {opt}
            </button>
          )
        })}
      </div>
      {showCorrect && explanation && (
        <p style={{ marginTop: 16, fontSize: 14, color: '#64748b', background: '#f8fafc', borderRadius: 10, padding: '12px 14px', borderLeft: '3px solid #6366f1' }}>
          💡 {explanation}
        </p>
      )}
    </div>
  )
}

export default Question