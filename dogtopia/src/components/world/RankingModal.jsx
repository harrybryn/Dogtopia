import React from 'react'
import iconCrown from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_crown.svg'
import coinsImg from '../../assets/ui/coins.png'

export default function RankingModal({ onClose }) {
  const LEADERBOARD = [
    { rank: 1, name: 'CanineKing_Alex', title: 'Grand Champion', score: '2,480,900', dog: 'Galaxy Dog' },
    { rank: 2, name: 'PupWhisperer_Mia', title: 'Master Breeder', score: '1,980,120', dog: 'Cerberus Pup' },
    { rank: 3, name: 'DesertWolf_Zack', title: 'Oasis Lord', score: '1,420,500', dog: 'Pharaoh Hound' },
    { rank: 4, name: 'SnowyPaws_Luna', title: 'Tundra Explorer', score: '980,400', dog: 'Snow Fox Shiba' },
    { rank: 18, name: 'You (PupPal Master)', title: 'Park Keeper', score: '364,126', dog: 'Basenji', isYou: true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-400/60 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #2a1506 0%, #150901 100%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 2px 4px rgba(251, 191, 36, 0.25)',
          maxHeight: '85vh',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-amber-900/50"
          style={{ background: 'linear-gradient(180deg, #451a03 0%, #290e02 100%)' }}
        >
          <div className="flex items-center gap-3">
            <img src={iconCrown} alt="Ranking" className="w-8 h-8 drop-shadow" />
            <div>
              <h2 className="text-2xl font-black text-amber-200 tracking-wide uppercase">
                Dog Show Ranking
              </h2>
              <p className="text-xs text-amber-300/70 font-medium">
                Weekly Tournament · Top Breeders Leaderboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-950/80 border border-amber-500/40 text-amber-200 hover:text-white font-bold text-lg active:scale-90 transition-transform"
          >
            ✕
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-2.5">
          {LEADERBOARD.map((item) => (
            <div
              key={item.rank}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                item.isYou
                  ? 'bg-amber-500/20 border-amber-400 shadow-lg'
                  : 'bg-black/40 border-amber-900/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base shadow ${
                    item.rank === 1
                      ? 'bg-amber-400 text-amber-950'
                      : item.rank === 2
                      ? 'bg-slate-300 text-slate-900'
                      : item.rank === 3
                      ? 'bg-amber-700 text-amber-100'
                      : 'bg-black/60 text-amber-200'
                  }`}
                >
                  #{item.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-amber-100">{item.name}</span>
                    {item.isYou && (
                      <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 rounded-full">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-amber-300/70 block">
                    {item.dog} · {item.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-black text-amber-300 text-xs">
                <img src={coinsImg} alt="Score" className="w-4 h-4 object-contain" />
                <span>{item.score}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-black/40 border-t border-amber-950/80 text-xs text-amber-300/70 text-center">
          Weekly Dog Show resets in 2d 14h. Top 10 earn Epic Breed Certificates!
        </div>
      </div>
    </div>
  )
}

