import React from 'react'
import { useGame } from '../context/GameContext.jsx'
import coinsImg from '../assets/ui/coins.png'
import diamondsImg from '../assets/ui/diamonds.png'
import dogfoodImg from '../assets/ui/dogfood.png'
import iconMap from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_map.svg'
import iconStar from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_star.svg'

export default function Quests({ navigate }) {
  const { state, dispatch } = useGame()
  const { tasks = [] } = state

  const handleClaim = (taskId) => {
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId } })
  }

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
              <img src={iconStar} alt="" className="w-6 h-6 object-contain" /> Daily Island Quests
            </h1>
            <p className="text-xs text-amber-300/70">
              Complete care assignments to earn Paw Coins, Crystals and XP!
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
              task.done
                ? 'bg-amber-950/20 border-amber-900/30 opacity-60'
                : 'bg-black/50 border-amber-700/50 shadow-lg'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-600/50 flex items-center justify-center">
                <img
                  src={task.type === 'Feed' ? dogfoodImg : task.rewardCrystals ? diamondsImg : coinsImg}
                  alt=""
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-amber-100">{task.desc}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {task.rewardCoins && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
                      <img src={coinsImg} alt="Coins" className="w-4 h-4 object-contain" />
                      +{task.rewardCoins}
                    </span>
                  )}
                  {task.rewardCrystals && (
                    <span className="flex items-center gap-1 text-xs font-bold text-purple-300">
                      <img src={diamondsImg} alt="Crystals" className="w-4 h-4 object-contain" />
                      +{task.rewardCrystals}
                    </span>
                  )}
                  <span className="text-xs text-sky-300 font-bold">+{task.rewardXp} XP</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleClaim(task.id)}
              disabled={task.done}
              className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow ${
                task.done
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:brightness-110 border border-green-300 active:scale-95'
              }`}
            >
              {task.done ? 'Claimed' : 'Complete Quest'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

