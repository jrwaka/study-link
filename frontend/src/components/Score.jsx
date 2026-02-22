import React from 'react';

function Score({ score, total, onRestart }) {
  return (
    <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10 mt-10 text-center flex flex-col items-center gap-6">
      <h2 className="text-3xl font-bold text-slate-900">
        Your Score
      </h2>
      <p className="text-xl text-slate-700">
        {score} / {total} correct
      </p>
      <button
        onClick={onRestart}
        className="px-6 py-3 mt-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Restart Quiz
      </button>
    </div>
  );
}

export default Score;