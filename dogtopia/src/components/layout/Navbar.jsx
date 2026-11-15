import React from 'react'
import { useGame } from '../../context/GameContext.jsx'
import coinsImg from '../../assets/ui/coins.png'
import diamondsImg from '../../assets/ui/diamonds.png'

const NAV_ITEMS = [
  { key: 'world', label: 'Island View' },
  { key: 'habitat', label: 'Habitat Care' },
  { key: 'breeding', label: 'Breeding Den' },
  { key: 'store', label: 'Store' },
  { key: 'collection', label: 'Collection' },
  { key: 'quests', label: 'Quests' },
  { key: 'social', label: 'Social' },
]

export default function Navbar({ currentPage, navigate }) {
  const { state } = useGame()

  return (
    <nav
      className="px-6 py-2.5 flex items-center justify-between shadow-2xl relative z-40 border-b border-amber-900/60"
      style={{
        background: 'linear-gradient(180deg, #3d1a0a 0%, #200b03 100%)',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(254, 240, 138, 0.25)',
      }}
    >
      {/* Logo & Quick Island Return */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('world')}
          className="flex items-center gap-2 group cursor-pointer active:scale-95 transition-transform"
        >
          <span
            className="text-xl font-black tracking-wider text-amber-200 uppercase group-hover:text-amber-100 transition-colors"
            style={{ textShadow: '0 2px 4px #000, 0 0 10px rgba(245, 158, 11, 0.5)' }}
          >
            Dogtopia
          </span>
        </button>

        {/* Navigation Tabs */}
        <div className="flex gap-2 ml-4">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.key
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 border border-amber-300 shadow-md scale-105'
                    : 'bg-black/40 text-amber-300/80 hover:text-amber-100 hover:bg-black/60 border border-amber-900/40'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Top-Right Quick Currency Counter */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl shadow-inner border border-amber-500/40"
          style={{ background: 'linear-gradient(180deg, #2b1106 0%, #170702 100%)' }}
        >
          <img src={coinsImg} alt="Paw Coins" className="w-4 h-4 object-contain drop-shadow" />
          <span className="font-black text-amber-300 text-xs tracking-wide">
            {state?.coins?.toLocaleString() || '0'}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl shadow-inner border border-purple-500/40"
          style={{ background: 'linear-gradient(180deg, #20092c 0%, #0d0312 100%)' }}
        >
          <img src={diamondsImg} alt="Star Crystals" className="w-4 h-4 object-contain drop-shadow" />
          <span className="font-black text-purple-300 text-xs tracking-wide">
            {state?.crystals || 0}
          </span>
        </div>

        <button
          onClick={() => navigate('world')}
          className="ml-2 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs uppercase tracking-wider border border-emerald-300 shadow active:scale-95 transition-all"
        >
          Return to Island
        </button>
      </div>
    </nav>
  )
}

