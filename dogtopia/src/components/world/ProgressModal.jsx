import React from 'react'
import GenericModal from '../common/GenericModal.jsx'
import checkboxOn from '../../assets/TrioUIKit_FreeSample_v2.2/cozy/checkbox_on.svg'
import iconCrown from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_crown.svg'
import iconHeart from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_heart.svg'

export function ProgressModal({ onClose }) {
  const stages = [
    { num: 1, name: 'Oasis Awakening', desc: 'Build Desert Oasis & place first pup', done: true },
    { num: 2, name: 'Water & Warmth', desc: 'Place Stone Water Station & Golden Palm', done: true },
    { num: 3, name: 'Canine Caregiver', desc: 'Perform 10 Feed & Bath tasks', progress: '7/10', done: false },
    { num: 4, name: 'Pack Expansion', desc: 'Build Snowy Peak or Forest Meadow', progress: '0/1', done: false },
    { num: 5, name: 'Legendary Discovery', desc: 'Breed a hybrid puppy in the Den', progress: '0/1', done: false },
  ]

  return (
    <GenericModal title="ISLAND PROGRESS" onClose={onClose} maxWidth="max-w-4xl">
      <div className="flex flex-col gap-2.5 p-1">
        {stages.map((st) => (
          <div
            key={st.num}
            className="p-3 sm:p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3"
            style={{
              background: st.done
                ? 'rgba(235, 226, 211, 0.7)'
                : 'linear-gradient(180deg, #ffffff 0%, #fffbf2 60%, #faecd5 100%)',
              border: st.done ? '1.5px solid #c2b6a3' : '2px solid #d97706',
              boxShadow: st.done
                ? 'none'
                : '0 3px 10px rgba(120,53,15,0.14), inset 0 1px 2px rgba(255,255,255,0.95)',
              opacity: st.done ? 0.8 : 1,
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-base sm:text-lg shadow-sm flex-shrink-0"
                style={{
                  background: st.done
                    ? 'linear-gradient(180deg, #34d399 0%, #059669 100%)'
                    : 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                  border: st.done ? '1.5px solid #a7f3d0' : '1.5px solid #d97706',
                  color: st.done ? '#ffffff' : '#78350f',
                  fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                }}
              >
                {st.done ? (
                  <img src={checkboxOn} alt="" className="w-5 h-5 object-contain" />
                ) : (
                  st.num
                )}
              </div>
              <div className="min-w-0">
                <h4
                  className="font-black text-xs sm:text-sm md:text-base leading-tight truncate"
                  style={{
                    fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                    color: st.done ? '#57534e' : '#3b1404',
                    textShadow: st.done ? 'none' : '0 1px 0 rgba(255,255,255,0.85)',
                  }}
                >
                  {st.name}
                </h4>
                <p className="text-[11px] sm:text-xs text-amber-900/80 font-semibold truncate mt-0.5">
                  {st.desc}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              {st.done ? (
                <span
                  className="px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm text-emerald-800 bg-emerald-100/90 border border-emerald-400 uppercase tracking-wide shadow-sm flex items-center gap-1"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  <img src={checkboxOn} alt="" className="w-3.5 h-3.5 object-contain" />
                  <span>Done</span>
                </span>
              ) : (
                <span
                  className="px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm text-amber-900 bg-gradient-to-r from-amber-200 to-amber-300 border border-amber-500 uppercase tracking-wide shadow-sm"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  {st.progress}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </GenericModal>
  )
}

export function AncientPortalModal({ onClose, onGoBreeding }) {
  return (
    <GenericModal title="ANCIENT PORTAL" onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-3 flex flex-col items-center text-center gap-3.5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/30 border-3 border-purple-400 flex items-center justify-center shadow-xl animate-pulse">
          <img src={iconCrown} alt="" className="w-10 h-10 object-contain drop-shadow" />
        </div>

        <div>
          <h3
            className="text-base sm:text-lg md:text-xl font-black text-amber-950 leading-tight"
            style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
          >
            The Astral Canine Realm Beckons
          </h3>
          <p className="text-xs sm:text-sm text-amber-900/80 mt-1 max-w-md leading-relaxed font-semibold">
            Legend says ancient dog spirits dwell beyond the swirling rift. Breed two adult dogs in the Breeding Den to discover secret hybrids like the Snow Fox Shiba or the mythical Galaxy Dog!
          </p>
        </div>

        <div
          className="w-full rounded-2xl p-3.5 text-left shadow-sm"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #fffbf2 60%, #faecd5 100%)',
            border: '2px solid #d97706',
          }}
        >
          <span className="text-xs sm:text-sm font-black text-amber-950 block mb-1.5" style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}>
            Secret Hybrid Hints:
          </span>
          <ul className="text-xs text-amber-900/90 space-y-1 list-disc list-inside font-semibold">
            <li>Husky + Shiba = <strong className="text-purple-900">Snow Fox Shiba</strong> (Special Rarity)</li>
            <li>Basenji + Greyhound = <strong className="text-purple-900">Sun Chaser Basenji</strong></li>
            <li>Cerberus Pup + Galaxy Dog = <strong className="text-purple-900">Eternal Astral Hound</strong></li>
          </ul>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose()
            onGoBreeding && onGoBreeding()
          }}
          className="w-full max-w-sm py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all border border-purple-300 cursor-pointer flex items-center justify-center gap-2"
          style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
        >
          <img src={iconHeart} alt="" className="w-4 h-4 object-contain" />
          <span>Enter Breeding Den</span>
        </button>
      </div>
    </GenericModal>
  )
}
