import React from 'react'
import iconMap from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_map.svg'
import iconCrown from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_crown.svg'

export default function Social({ navigate }) {
  const FRIENDS = [
    { name: 'CanineKing_Alex', level: 24, dog: 'Galaxy Dog', status: 'Online' },
    { name: 'PupWhisperer_Mia', level: 19, dog: 'Cerberus Pup', status: 'Visiting Park' },
    { name: 'DesertWolf_Zack', level: 15, dog: 'Pharaoh Hound', status: 'Offline' },
  ]

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-2 sm:p-4 animate-fadeIn select-none">
      <div className="flex items-center justify-between bg-amber-950/50 p-4 rounded-3xl border border-amber-800/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('world')}
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <img src={iconMap} alt="" className="w-4 h-4 object-contain" />
            <span>Back to Island View</span>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-100 flex items-center gap-2">
              <img src={iconCrown} alt="" className="w-6 h-6 object-contain" /> Friends & Fellow Breeders
            </h1>
            <p className="text-xs text-amber-300/70">
              Visit neighboring floating islands and send gift treats!
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {FRIENDS.map((f, i) => (
          <div
            key={i}
            className="bg-black/50 border border-amber-700/50 p-4 rounded-2xl flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-900/40 border border-amber-500/40 flex items-center justify-center text-2xl">
                🐕
              </div>
              <div>
                <h3 className="font-bold text-sm text-amber-100">{f.name}</h3>
                <span className="text-xs text-amber-400">Lv {f.level} · Favorite: {f.dog}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Visiting ${f.name}'s island!`)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-black text-xs uppercase shadow active:scale-95 cursor-pointer"
            >
              Visit Island
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

