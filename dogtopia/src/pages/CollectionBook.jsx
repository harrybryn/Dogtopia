import React from 'react'
import bulldogPortrait from '../assets/dogs/BulldogPortrait.png'

export default function CollectionBook({ navigate }) {
  const BREEDS = [
    {
      id: 1,
      name: 'English Bulldog',
      rarity: 'Default Companion',
      stage: 'Adult',
      image: bulldogPortrait,
      habitat: 'Garden Park · Garden Element',
      discovered: true,
      desc: 'Affectionate, sturdy and loyal companion for every island trainer.',
    },
    { id: 2, name: 'Arctic Husky', rarity: 'Coming Soon', stage: 'Upcoming', emoji: '❄️', habitat: 'Snowy Peak', discovered: false },
    { id: 3, name: 'Golden Retriever', rarity: 'Coming Soon', stage: 'Upcoming', emoji: '🌳', habitat: 'Forest Meadow', discovered: false },
    { id: 4, name: 'Japanese Shiba', rarity: 'Coming Soon', stage: 'Upcoming', emoji: '🌸', habitat: 'Garden Park', discovered: false },
    { id: 5, name: 'German Shepherd', rarity: 'Coming Soon', stage: 'Upcoming', emoji: '🛡️', habitat: 'Desert Oasis', discovered: false },
    { id: 6, name: 'Galaxy Mythic Pup', rarity: 'Coming Soon', stage: 'Upcoming', emoji: '🌌', habitat: 'Legendary Realm', discovered: false },
  ]

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-2 sm:p-4 animate-fadeIn select-none">
      <div className="flex items-center justify-between bg-amber-950/50 p-4 rounded-3xl border border-amber-800/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('world')}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>🗺️</span>
            <span>Back to Island View</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-100 flex items-center gap-2">
              <span>📖</span> Dogtopia Collection Book
            </h1>
            <p className="text-xs text-amber-300/70">
              Discover and collect all canine species across the floating islands!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {BREEDS.map((b) => (
          <div
            key={b.id}
            className={`rounded-2xl p-4 flex flex-col items-center text-center border transition-all ${
              b.discovered
                ? 'bg-gradient-to-b from-amber-950/50 to-black/70 border-amber-500/60 shadow-lg'
                : 'bg-black/50 border-amber-900/30 opacity-50'
            }`}
          >
            <div className="w-24 h-24 rounded-full bg-amber-900/40 border border-amber-500/40 flex items-center justify-center text-4xl mb-3 overflow-hidden p-1 shadow-inner">
              {b.image ? (
                <img src={b.image} alt={b.name} className="w-full h-full object-cover rounded-full filter drop-shadow" />
              ) : b.discovered ? (
                b.emoji
              ) : (
                <span className="text-zinc-500">🔒</span>
              )}
            </div>
            <h3 className="font-black text-sm text-amber-100">{b.name}</h3>
            <span className={`text-[10px] font-bold uppercase mt-0.5 ${b.discovered ? 'text-amber-400' : 'text-zinc-500'}`}>
              {b.rarity}
            </span>
            <span className="text-[11px] text-amber-200/70 mt-1">{b.habitat}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

