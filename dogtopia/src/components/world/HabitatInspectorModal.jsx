import React from 'react'
import { useGame } from '../../context/GameContext.jsx'
import { HABITAT_CATALOG, HABITAT_IMAGES } from '../../data/habitatCatalog.js'
import GenericModal from '../common/GenericModal.jsx'
import coinsImg from '../../assets/ui/coins.png'
import dogfoodImg from '../../assets/ui/dogfood.png'

export default function HabitatInspectorModal({
  habitat,
  onClose,
  onMove,
}) {
  const { dispatch } = useGame()
  if (!habitat) return null

  const catalogEntry = HABITAT_CATALOG.find((h) => h.id === (habitat.habitatId || habitat.id)) || {}
  const isDogfoodFactory = habitat.habitatId === 'dogfood-factory' || habitat.name === 'Dogfood Factory'
  const isTrueHabitat = (habitat.type || 'habitat') === 'habitat' && !['golden-palm', 'bone-sign', 'water-station', 'breeding-den', 'dogfood-factory'].includes(habitat.habitatId)

  const coins = habitat.coinsAccumulated || 0
  const maxCoins = habitat.maxCoins || catalogEntry.maxCoins || 1000
  const food = habitat.dogfoodAccumulated || 0
  const maxFood = habitat.maxDogfood || catalogEntry.maxDogfood || 300

  const habImage = habitat.image || HABITAT_IMAGES[habitat.habitatId] || catalogEntry.image

  const handleCollectCoins = () => {
    if (coins > 0) {
      dispatch({
        type: 'COLLECT_HABITAT_COINS',
        payload: { id: habitat.id },
      })
    }
  }

  const handleCollectDogfood = () => {
    if (food > 0) {
      dispatch({
        type: 'COLLECT_DOGFOOD',
        payload: { id: habitat.id },
      })
    }
  }

  const handleRemove = () => {
    if (window.confirm(`Are you sure you want to store or sell ${habitat.name}?`)) {
      dispatch({
        type: 'REMOVE_HABITAT',
        payload: { id: habitat.id },
      })
      onClose()
    }
  }

  return (
    <GenericModal
      title={`${habitat.name || 'BUILDING'} INFO`}
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-3 p-1">
        {/* ── 1. Top Building Overview Card ── */}
        <div
          className="w-full p-3 sm:p-4 rounded-2xl flex items-center gap-3.5 shadow-sm"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fffbf2 60%, #faecd5 100%)',
            border: '2px solid #d97706',
            boxShadow: '0 3px 8px rgba(120,53,15,0.12), inset 0 1px 2px rgba(255,255,255,0.95)',
          }}
        >
          {/* Building Artwork */}
          {habImage && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100/80 border-2 border-amber-300 flex items-center justify-center p-1.5 flex-shrink-0 shadow-inner">
              <img
                src={habImage}
                alt={habitat.name}
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>
          )}

          {/* Info Details */}
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3
                className="font-black text-sm sm:text-base md:text-lg text-amber-950 uppercase tracking-wide leading-tight truncate"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
              >
                {habitat.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-black text-[9px] sm:text-[10px] uppercase shadow-sm">
                LEVEL {habitat.level || 1}
              </span>
            </div>

            <span className="text-[10px] sm:text-xs font-bold text-amber-800/90 leading-tight block mb-1">
              {catalogEntry.tagline || (isDogfoodFactory ? 'Kibble Production Facility' : isTrueHabitat ? 'Island Habitat Sanctuary' : 'Island Facility')}
            </span>

            <p className="text-[10px] sm:text-xs text-amber-900/80 font-medium leading-relaxed line-clamp-2">
              {catalogEntry.desc || 'A functional building on Dogtopia Island.'}
            </p>
          </div>
        </div>

        {/* ── 2. Suited Breeds (For Habitats) ── */}
        {isTrueHabitat && catalogEntry.bestFor && (
          <div
            className="w-full px-3.5 py-2 rounded-xl flex items-center justify-between gap-2 shadow-sm text-left"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #fffbf2 100%)',
              border: '1.5px solid #d97706',
            }}
          >
            <span
              className="text-[10px] sm:text-xs font-black uppercase text-amber-950 flex-shrink-0"
              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
            >
              SUITED BREEDS:
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-amber-800 text-right truncate">
              {catalogEntry.bestFor}
            </span>
          </div>
        )}

        {/* ── 3. Resource Storage & Generation Meter ── */}
        {isTrueHabitat && (
          <div
            className="w-full p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-sm"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #fffbf2 60%, #faecd5 100%)',
              border: '2px solid #d97706',
              boxShadow: '0 3px 8px rgba(120,53,15,0.12), inset 0 1px 2px rgba(255,255,255,0.95)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <img src={coinsImg} alt="Coins" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow" />
              <div className="flex flex-col text-left leading-tight">
                <span
                  className="font-black text-xs sm:text-sm text-amber-950 uppercase"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  PAW COINS
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-900">
                  {coins.toLocaleString()} / {maxCoins.toLocaleString()}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-700/80">
                  Income Rate: +{catalogEntry.coinRate || '60/min'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCollectCoins}
              disabled={coins <= 0}
              className={`py-2 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                coins > 0
                  ? 'bg-gradient-to-b from-amber-400 to-amber-600 hover:brightness-110 text-amber-950 border border-white cursor-pointer'
                  : 'bg-zinc-300 text-zinc-500 border border-zinc-400 cursor-not-allowed opacity-60'
              }`}
              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
            >
              COLLECT ({coins.toLocaleString()})
            </button>
          </div>
        )}

        {/* ── 5. Dogfood Factory Production Meter ── */}
        {isDogfoodFactory && (
          <div
            className="w-full p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-sm"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #fffbf2 60%, #faecd5 100%)',
              border: '2px solid #d97706',
              boxShadow: '0 3px 8px rgba(120,53,15,0.12), inset 0 1px 2px rgba(255,255,255,0.95)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <img src={dogfoodImg} alt="Kibble" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow" />
              <div className="flex flex-col text-left leading-tight">
                <span
                  className="font-black text-xs sm:text-sm text-amber-950 uppercase"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  KIBBLE STORAGE
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-900">
                  {food.toLocaleString()} / {maxFood.toLocaleString()}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-700/80">
                  Bakery Rate: +25 Kibble / min
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCollectDogfood}
              disabled={food <= 0}
              className={`py-2 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                food > 0
                  ? 'bg-gradient-to-b from-amber-400 to-amber-600 hover:brightness-110 text-amber-950 border border-white cursor-pointer'
                  : 'bg-zinc-300 text-zinc-500 border border-zinc-400 cursor-not-allowed opacity-60'
              }`}
              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
            >
              COLLECT ({food.toLocaleString()})
            </button>
          </div>
        )}

        {/* ── 6. Bottom Utility Actions (Move on Grid & Store) ── */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose()
              onMove && onMove(habitat)
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white"
            style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white drop-shadow">
              <path d="M12 2L15 6H13V9H16V7L20 10L16 13V11H13V15H15L12 19L9 15H11V11H8V13L4 10L8 7V9H11V6H9L12 2Z" />
            </svg>
            <span>MOVE ON GRID</span>
          </button>

          <button
            type="button"
            onClick={handleRemove}
            className="py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer border border-stone-300"
            style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
          >
            <span>STORE / REMOVE</span>
          </button>
        </div>
      </div>
    </GenericModal>
  )
}
