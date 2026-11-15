import React from 'react'

export default function Login({ navigate }) {
  return (
    <div className="max-w-md mx-auto flex flex-col gap-6 p-4 animate-fadeIn select-none mt-10">
      <div className="bg-gradient-to-b from-amber-950/60 to-black/80 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        <span className="text-5xl mb-2">👤</span>
        <h2 className="text-2xl font-black text-amber-100 uppercase">Keeper Profile</h2>
        <p className="text-xs text-amber-300/70 mt-1 mb-6">
          PupPal Island Keeper · Level 18
        </p>

        <div className="w-full bg-black/40 border border-amber-900/50 rounded-2xl p-4 text-left mb-6 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-amber-400">Keeper Name:</span>
            <span className="font-bold text-amber-100">PupPal Master</span>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-400">Account ID:</span>
            <span className="font-bold text-amber-100">PUP-8849-DC</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-400">Cloud Sync:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              Active
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-emerald-400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('world')}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          Return to Island View
        </button>
      </div>
    </div>
  )
}

