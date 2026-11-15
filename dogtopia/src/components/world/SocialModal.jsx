import React, { useState } from 'react'
import { useGame } from '../../context/GameContext.jsx'
import GenericModal from '../common/GenericModal.jsx'
import dogfoodImg from '../../assets/ui/dogfood.png'
import iconMap from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_map.svg'
import checkboxOn from '../../assets/TrioUIKit_FreeSample_v2.2/cozy/checkbox_on.svg'
import bulldogPuppySit from '../../assets/itemsInShop/dogs/BulldogPuppySit.png'

export default function SocialModal({ onClose, onNavigate }) {
  const { state, dispatch } = useGame()
  const [toast, setToast] = useState(null)
  const [friendCode, setFriendCode] = useState('')

  const [friends, setFriends] = useState([
    { id: 1, name: 'CanineKing_Alex', level: 24, dog: 'Galaxy Dog', status: 'Online', gifted: false },
    { id: 2, name: 'PupWhisperer_Mia', level: 19, dog: 'Cerberus Pup', status: 'Visiting Park', gifted: false },
    { id: 3, name: 'DesertWolf_Zack', level: 15, dog: 'Pharaoh Hound', status: 'Offline', gifted: false },
    { id: 4, name: 'IslandPaws_Leo', level: 11, dog: 'Golden Retriever', status: 'Online', gifted: false },
  ])

  const handleSendGift = (friendId, friendName) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, gifted: true } : f))
    )
    dispatch({
      type: 'ADD_CURRENCY',
      payload: { xp: 50, coins: 100 },
    })
    setToast(`Sent Kibble & Treat gift to ${friendName}! (+100 Coins, +50 XP)`)
    setTimeout(() => setToast(null), 2500)
  }

  const handleAddFriend = (e) => {
    e.preventDefault()
    if (!friendCode.trim()) return
    const newFriend = {
      id: Date.now(),
      name: friendCode.trim(),
      level: 1,
      dog: 'Bulldog Puppy',
      status: 'Online',
      gifted: false,
    }
    setFriends((prev) => [newFriend, ...prev])
    setFriendCode('')
    setToast(`Friend request sent to ${newFriend.name}!`)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <GenericModal title="FRIENDS & SOCIAL" onClose={onClose} maxWidth="max-w-4xl">
      <div className="flex flex-col gap-2.5 p-1">
        {/* Toast Alert */}
        {toast && (
          <div className="bg-amber-100 border-2 border-amber-500 text-amber-950 px-3.5 py-1.5 rounded-xl text-center text-xs font-black shadow-sm">
            {toast}
          </div>
        )}

        {/* Add Friend Form */}
        <form onSubmit={handleAddFriend} className="flex gap-2 mb-0.5">
          <input
            type="text"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
            placeholder="Enter Trainer Name or Island Code..."
            className="flex-1 bg-white border-2 border-amber-500/80 rounded-2xl px-4 py-2 text-xs sm:text-sm text-amber-950 placeholder-amber-700/50 outline-none focus:border-amber-600 shadow-sm font-semibold"
          />
          <button
            type="submit"
            className="px-4 sm:px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-amber-950 font-black text-xs sm:text-sm uppercase cursor-pointer shadow-md active:scale-95 transition-transform border border-amber-300"
            style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
          >
            Add Friend
          </button>
        </form>

        {/* Friends List */}
        <div className="grid grid-cols-1 gap-2.5">
          {friends.map((f) => (
            <div
              key={f.id}
              className="p-3 sm:p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3 shadow-sm hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #fffbf2 60%, #faecd5 100%)',
                border: '2px solid #d97706',
                boxShadow: '0 3px 10px rgba(120,53,15,0.12), inset 0 1px 2px rgba(255,255,255,0.95)',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center p-1 shadow-inner flex-shrink-0">
                  <img src={bulldogPuppySit} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-black text-xs sm:text-sm md:text-base text-amber-950 leading-tight truncate"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      {f.name}
                    </h3>
                    <span
                      className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                        f.status === 'Online'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                          : 'bg-stone-200 text-stone-600 border border-stone-300'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs text-amber-800/90 font-bold block truncate mt-0.5">
                    Lv {f.level} · Favorite: {f.dog}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Send Gift Button */}
                <button
                  type="button"
                  onClick={() => handleSendGift(f.id, f.name)}
                  disabled={f.gifted}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    f.gifted
                      ? 'bg-stone-300 text-stone-600 border border-stone-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-amber-950 border border-amber-300 active:scale-95'
                  }`}
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  <img src={dogfoodImg} alt="" className="w-4 h-4 object-contain" />
                  {f.gifted ? (
                    <span className="flex items-center gap-1">
                      <img src={checkboxOn} alt="" className="w-3.5 h-3.5 object-contain" />
                      <span>Sent</span>
                    </span>
                  ) : (
                    <span>Send Treat</span>
                  )}
                </button>

                {/* Visit Island Button */}
                <button
                  type="button"
                  onClick={() => {
                    setToast(`Visiting ${f.name}'s island!`)
                    setTimeout(() => {
                      if (onNavigate) onNavigate('social')
                    }, 600)
                  }}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 hover:brightness-110 text-cyan-950 border border-cyan-200 font-black text-xs sm:text-sm uppercase cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  <img src={iconMap} alt="" className="w-4 h-4 object-contain" />
                  <span>Visit Island</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GenericModal>
  )
}
