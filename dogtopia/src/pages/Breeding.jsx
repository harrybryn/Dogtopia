import React, { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import coinsImg from '../assets/ui/coins.png'
import diamondsImg from '../assets/ui/diamonds.png'
import iconHeart from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_heart.svg'
import iconMap from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_map.svg'
import bulldogPuppySit from '../assets/itemsInShop/dogs/BulldogPuppySit.png'

export default function Breeding({ navigate }) {
  const { state, dispatch } = useGame()
  const [parent1, setParent1] = useState('Basenji')
  const [parent2, setParent2] = useState('Pharaoh Hound')
  const [breedingState, setBreedingState] = useState('idle') // 'idle' | 'breeding' | 'hatched'
  const [hatchedPup, setHatchedPup] = useState(null)

  const PARENT_OPTIONS = [
    { name: 'Basenji', trait: 'Agile & Alert', element: 'Desert Element' },
    { name: 'Pharaoh Hound', trait: 'Royal Sight', element: 'Desert Element' },
    { name: 'Shiba Inu', trait: 'Spirited Loyal', element: 'Garden Element' },
    { name: 'Husky', trait: 'Arctic Endurance', element: 'Snow Element' },
  ]

  const handleStartBreeding = () => {
    if (state.coins < 500) {
      alert('You need 500 Paw Coins to breed!')
      return
    }

    dispatch({
      type: 'ADD_CURRENCY',
      payload: { coins: -500, xp: 100 },
    })

    setBreedingState('breeding')

    setTimeout(() => {
      setBreedingState('hatched')
      setHatchedPup({
        name: 'Sun Chaser Pup',
        desc: `Rare hybrid offspring of ${parent1} & ${parent2}! Inherited Golden Coat & Speed.`,
        rarity: 'Rare Hybrid',
      })
    }, 2800)
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-2 sm:p-4 animate-fadeIn select-none">
      {/* Header with Back to Island */}
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
              <img src={bulldogPuppySit} alt="" className="w-7 h-7 object-contain" /> Ancient Breeding Den
            </h1>
            <p className="text-xs text-amber-300/70">
              Pair two champion dogs to unlock mythical hybrid breeds and puppy traits!
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/60 border border-amber-500/30">
            <img src={coinsImg} alt="Paw Coins" className="w-4 h-4 object-contain" />
            <span className="font-black text-amber-300 text-xs">{state.coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Breeding Altar */}
      <div
        className="rounded-3xl p-6 sm:p-8 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #2a1106 0%, #160702 100%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 2px 6px rgba(251, 191, 36, 0.3)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Parent 1 */}
          <div className="bg-black/50 border border-amber-700/50 rounded-2xl p-5 flex flex-col items-center text-center">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Parent Dog 1</span>
            <div className="w-24 h-24 rounded-full bg-amber-900/40 border-2 border-amber-400/60 flex items-center justify-center p-2 mb-3 shadow-inner">
              <img src={bulldogPuppySit} alt="" className="w-16 h-16 object-contain" />
            </div>
            <select
              value={parent1}
              onChange={(e) => setParent1(e.target.value)}
              className="bg-amber-950 border border-amber-600/60 text-amber-100 font-bold text-xs rounded-xl px-3 py-2 w-full outline-none"
            >
              {PARENT_OPTIONS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.element})
                </option>
              ))}
            </select>
          </div>

          {/* Heart / Altar Symbol */}
          <div className="flex flex-col items-center justify-center text-center py-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center p-3 shadow-xl animate-pulse">
              <img src={iconHeart} alt="" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xs font-black text-amber-300 mt-2 uppercase tracking-wider">
              Genetic Fusion
            </span>
            <span className="text-[11px] text-amber-400/70">Cost: 500 Paw Coins</span>
          </div>

          {/* Parent 2 */}
          <div className="bg-black/50 border border-amber-700/50 rounded-2xl p-5 flex flex-col items-center text-center">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Parent Dog 2</span>
            <div className="w-24 h-24 rounded-full bg-amber-900/40 border-2 border-amber-400/60 flex items-center justify-center p-2 mb-3 shadow-inner">
              <img src={bulldogPuppySit} alt="" className="w-16 h-16 object-contain" />
            </div>
            <select
              value={parent2}
              onChange={(e) => setParent2(e.target.value)}
              className="bg-amber-950 border border-amber-600/60 text-amber-100 font-bold text-xs rounded-xl px-3 py-2 w-full outline-none"
            >
              {PARENT_OPTIONS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.element})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Breeding Action / Result */}
        <div className="mt-8 pt-6 border-t border-amber-900/60 flex flex-col items-center">
          {breedingState === 'idle' && (
            <button
              onClick={handleStartBreeding}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-amber-950 font-black text-sm uppercase tracking-wider border-2 border-amber-200 shadow-xl active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <img src={coinsImg} alt="" className="w-5 h-5 object-contain" />
              <span>Begin Breeding (500 Coins)</span>
            </button>
          )}

          {breedingState === 'breeding' && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
              <span className="text-base font-black text-amber-200 animate-pulse">
                Incubating Mystical Egg in the Den...
              </span>
            </div>
          )}

          {breedingState === 'hatched' && hatchedPup && (
            <div className="flex flex-col items-center text-center gap-3 bg-amber-950/60 border-2 border-amber-400/80 p-6 rounded-3xl max-w-md animate-bounce">
              <img src={bulldogPuppySit} alt="" className="w-20 h-20 object-contain" />
              <h3 className="text-xl font-black text-amber-100">{hatchedPup.name}</h3>
              <span className="text-xs bg-amber-500 text-amber-950 font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {hatchedPup.rarity}
              </span>
              <p className="text-xs text-amber-200/80">{hatchedPup.desc}</p>
              <button
                onClick={() => setBreedingState('idle')}
                className="mt-2 px-6 py-2 rounded-xl bg-amber-500 text-amber-950 font-black text-xs uppercase"
              >
                Breed Another Pair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

