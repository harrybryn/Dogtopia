import React from 'react'

export default function Home({ navigate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center select-none animate-fadeIn">
      <span className="text-6xl drop-shadow-2xl">🏝️</span>
      <h1 className="text-4xl font-black text-amber-200 tracking-wide uppercase" style={{ textShadow: '0 2px 6px #000' }}>
        Dogtopia Island
      </h1>
      <p className="text-amber-300/80 text-sm max-w-sm">
        Welcome to your floating dog sanctuary. Build habitats, care for your canine companions, and discover rare mythical breeds!
      </p>
      <button
        onClick={() => navigate('world')}
        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-black text-sm uppercase px-8 py-3.5 rounded-2xl shadow-2xl border-2 border-amber-200 active:scale-95 transition-all cursor-pointer"
      >
        🗺️ Enter Island World
      </button>
    </div>
  )
}

