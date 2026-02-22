import React from 'react'

function Score({ score, total, onRestart }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'

  return (
    <div style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '48px 36px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>Quiz Complete!</h2>
      <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 28 }}>You scored {score} out of {total} — {pct}%</p>
      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 99, marginBottom: 32, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#6366f1', borderRadius: 99, transition: 'width 0.8s ease' }} />
      </div>
      <button onClick={onRestart} style={{ padding: '12px 28px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
        Try Another Quiz
      </button>
    </div>
  )
}

export default Score