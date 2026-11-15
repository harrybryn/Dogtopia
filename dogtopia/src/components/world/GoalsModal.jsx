import React from 'react'
import { useGame } from '../../context/GameContext.jsx'
import coinsImg from '../../assets/ui/coins.png'
import diamondsImg from '../../assets/ui/diamonds.png'
import dogfoodImg from '../../assets/ui/dogfood.png'
import iconHeart from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_heart.svg'
import iconStar from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_star.svg'
import iconPotionBlue from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_potion_blue.svg'
import iconBuff from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_buff.svg'
import checkboxOn from '../../assets/TrioUIKit_FreeSample_v2.2/cozy/checkbox_on.svg'
import GenericModal from '../common/GenericModal.jsx'

function getTaskIcon(type) {
  switch (type) {
    case 'Feed':
      return dogfoodImg
    case 'Bath':
      return iconPotionBlue
    case 'Play':
      return iconHeart
    case 'Refill':
      return iconBuff
    case 'Groom':
      return iconStar
    default:
      return iconStar
  }
}

export default function GoalsModal({ onClose }) {
  const { state, dispatch } = useGame()
  const { tasks = [] } = state

  const handleClaim = (taskId) => {
    dispatch({
      type: 'COMPLETE_TASK',
      payload: { taskId },
    })
  }

  return (
    <GenericModal title="DAILY GOALS & TASKS" onClose={onClose} maxWidth="max-w-4xl">
      <div className="flex flex-col gap-2.5 p-1">
        {tasks.map((task) => {
          const isDone = task.done
          return (
            <div
              key={task.id}
              className="p-3 sm:p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3"
              style={{
                background: isDone
                  ? 'rgba(235, 226, 211, 0.7)'
                  : 'linear-gradient(180deg, #ffffff 0%, #fffbf2 60%, #faecd5 100%)',
                border: isDone ? '1.5px solid #c2b6a3' : '2px solid #d97706',
                boxShadow: isDone
                  ? 'none'
                  : '0 3px 10px rgba(120,53,15,0.14), inset 0 1px 2px rgba(255,255,255,0.95)',
                opacity: isDone ? 0.75 : 1,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{
                    background: isDone
                      ? '#e2d8c9'
                      : 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                    border: isDone ? '1.5px solid #a89f91' : '1.5px solid #d97706',
                  }}
                >
                  <img
                    src={getTaskIcon(task.type)}
                    alt={task.type}
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain drop-shadow"
                    style={isDone ? { filter: 'grayscale(0.8) opacity(0.7)' } : {}}
                  />
                </div>
                <div className="min-w-0">
                  <h4
                    className="font-black text-xs sm:text-sm md:text-base leading-tight truncate"
                    style={{
                      fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                      color: isDone ? '#57534e' : '#3b1404',
                      textShadow: isDone ? 'none' : '0 1px 0 rgba(255,255,255,0.85)',
                    }}
                  >
                    {task.desc}
                  </h4>
                  <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                    {task.rewardCoins && (
                      <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-800">
                        <img src={coinsImg} alt="Paw Coins" className="w-4 h-4 object-contain drop-shadow-sm" />
                        +{task.rewardCoins.toLocaleString()}
                      </span>
                    )}
                    {task.rewardCrystals && (
                      <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-purple-700">
                        <img src={diamondsImg} alt="Star Crystals" className="w-4 h-4 object-contain drop-shadow-sm" />
                        +{task.rewardCrystals}
                      </span>
                    )}
                    <span className="text-[11px] sm:text-xs font-bold text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-md border border-sky-300">
                      +{task.rewardXp} XP
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleClaim(task.id)}
                disabled={isDone}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 flex-shrink-0 cursor-pointer ${
                  isDone
                    ? 'bg-stone-300 text-stone-600 border border-stone-400 cursor-not-allowed'
                    : 'text-white hover:brightness-110 hover:scale-105'
                }`}
                style={{
                  background: isDone
                    ? undefined
                    : 'linear-gradient(180deg, #34d399 0%, #10b981 40%, #059669 100%)',
                  border: isDone ? undefined : '1.5px solid #d1fae5',
                  boxShadow: isDone
                    ? 'none'
                    : '0 4px 10px rgba(5, 150, 105, 0.35), inset 0 1px 2px rgba(255,255,255,0.8)',
                  textShadow: isDone ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
                  fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                }}
              >
                {isDone ? (
                  <span className="flex items-center gap-1.5">
                    <img src={checkboxOn} alt="" className="w-3.5 h-3.5 object-contain" />
                    <span>Claimed</span>
                  </span>
                ) : (
                  'Do Task'
                )}
              </button>
            </div>
          )
        })}
      </div>
    </GenericModal>
  )
}
