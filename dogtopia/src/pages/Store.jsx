import React, { useState } from 'react'
import { useGame } from '../context/GameContext.jsx'
import coinsImg from '../assets/ui/coins.png'
import diamondsImg from '../assets/ui/diamonds.png'
import dogfoodImg from '../assets/ui/dogfood.png'
import iconMap from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_map.svg'

/**
 * Visual graphic displaying 1 to many diamonds, food bowls, or coins
 * depending on package size!
 */
export function TieredCurrencyGraphic({ type = 'diamonds', amount = 50, tier = 1, size = 'md' }) {
  const icon = type === 'diamonds' ? diamondsImg : type === 'food' ? dogfoodImg : coinsImg
  const isLg = size === 'lg'
  const boxDim = isLg ? 'w-20 h-20' : 'w-14 h-14'
  const iconBase = isLg ? 'w-12 h-12' : 'w-9 h-9'
  const iconSm = isLg ? 'w-9 h-9' : 'w-6 h-6'
  const iconXs = isLg ? 'w-8 h-8' : 'w-5 h-5'

  if (tier <= 1) {
    // 1 single item
    return (
      <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
        <img
          src={icon}
          alt=""
          className={`${iconBase} object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] hover:scale-110 transition-transform`}
        />
      </div>
    )
  }

  if (tier === 2) {
    // 2 overlapping items
    return (
      <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute left-1 bottom-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]`}
        />
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute right-1 top-1 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]`}
        />
      </div>
    )
  }

  if (tier === 3) {
    // 3 items in a glowing pyramid pile
    return (
      <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md pointer-events-none" />
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute left-0 bottom-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]`}
        />
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute right-0 bottom-0 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]`}
        />
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute top-0 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]`}
        />
      </div>
    )
  }

  if (tier === 4) {
    // 4-5 items in a rich overflowing cluster with radiant glow
    return (
      <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
        <div className="absolute inset-0 rounded-full bg-purple-400/25 blur-lg pointer-events-none" />
        <img src={icon} alt="" className={`${iconXs} object-contain absolute left-0 bottom-1 drop-shadow`} />
        <img src={icon} alt="" className={`${iconXs} object-contain absolute right-0 bottom-1 drop-shadow`} />
        <img src={icon} alt="" className={`${iconXs} object-contain absolute left-2 top-1 drop-shadow`} />
        <img src={icon} alt="" className={`${iconXs} object-contain absolute right-2 top-1 drop-shadow`} />
        <img src={icon} alt="" className={`${iconSm} object-contain absolute inset-0 m-auto drop-shadow-xl scale-110`} />
      </div>
    )
  }

  // Tier 5 & 6: Mountain / Vault of many sparkling items!
  return (
    <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/30 to-purple-500/30 blur-xl animate-pulse pointer-events-none" />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute -left-1 bottom-0 drop-shadow`} />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute left-3 bottom-0 drop-shadow`} />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute -right-1 bottom-0 drop-shadow`} />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute left-0 top-1 drop-shadow`} />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute right-0 top-1 drop-shadow`} />
      <img src={icon} alt="" className={`${iconSm} object-contain absolute top-0 inset-x-0 mx-auto drop-shadow-2xl scale-125`} />
    </div>
  )
}

export default function Store({ navigate }) {
  const { state, dispatch } = useGame()
  const [toast, setToast] = useState(null)

  const DIAMOND_PACKS = [
    { id: 'diamonds_50', name: 'Handful of Diamonds', diamonds: 50, pricePhp: 49, badge: 'STARTER', tier: 1 },
    { id: 'diamonds_150', name: 'Pouch of Diamonds', diamonds: 150, pricePhp: 129, badge: '+10% BONUS', tier: 2 },
    { id: 'diamonds_500', name: 'Sack of Diamonds', diamonds: 500, pricePhp: 399, badge: 'POPULAR', tier: 3 },
    { id: 'diamonds_1200', name: 'Chest of Diamonds', diamonds: 1200, pricePhp: 799, badge: 'BEST VALUE', tier: 4 },
  ]

  const ITEMS = [
    { id: 'kibble_pack', name: 'Gourmet Kibble Bag', cost: 100, costType: 'coins', amount: '+5,000 Food', type: 'food', tier: 3 },
    { id: 'golden_ball', name: 'Golden Paw Coin Cache', cost: 250, costType: 'coins', amount: '+20,000 Coins', type: 'coins', tier: 2 },
    { id: 'feast_pack', name: 'Grand Sanctuary Feast', cost: 500, costType: 'coins', amount: '+25,000 Food', type: 'food', tier: 5 },
  ]

  const handleBuyDiamonds = (pack) => {
    dispatch({
      type: 'ADD_CURRENCY',
      payload: {
        crystals: pack.diamonds,
      },
    })
    setToast(`Successfully purchased ${pack.diamonds} Diamonds for ₱${pack.pricePhp}!`)
    setTimeout(() => setToast(null), 3000)
  }

  const handleBuy = (item) => {
    if (item.costType === 'coins' && state.coins < item.cost) {
      setToast('Not enough Paw Coins!')
      setTimeout(() => setToast(null), 2500)
      return
    }
    dispatch({
      type: 'ADD_CURRENCY',
      payload: {
        coins: item.costType === 'coins' ? -item.cost : 0,
        kibble: item.id === 'kibble_pack' ? 5000 : item.id === 'feast_pack' ? 25000 : 0,
      },
    })
    setToast(`Purchased ${item.name}!`)
    setTimeout(() => setToast(null), 2500)
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
              <img src={diamondsImg} alt="" className="w-7 h-7 object-contain drop-shadow" /> Dogtopia Market & Supply
            </h1>
            <p className="text-xs text-amber-300/70">
              Stock up on diamonds in ₱ Peso, kibble treats, and supplies for your companions!
            </p>
          </div>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-950/90 border border-emerald-400 text-emerald-200 px-4 py-2 rounded-2xl text-center text-xs font-black shadow-lg animate-bounce">
          {toast}
        </div>
      )}

      {/* ── Diamonds & Crystals Section (PHP ₱) ── */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-amber-200 uppercase tracking-wide mb-3 flex items-center gap-2">
          <img src={diamondsImg} alt="" className="w-5 h-5 object-contain" /> Diamonds & Crystals (PHP ₱ Real Money)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {DIAMOND_PACKS.map((pack) => (
            <div
              key={pack.id}
              className="bg-gradient-to-b from-purple-950/50 to-black/80 border border-purple-500/50 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:border-purple-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-900/40 border border-purple-400/50 flex items-center justify-center shadow-inner overflow-hidden">
                  <TieredCurrencyGraphic type="diamonds" amount={pack.diamonds} tier={pack.tier} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-sm text-purple-100">{pack.name}</h3>
                    {pack.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-black bg-purple-700 text-white uppercase">
                        {pack.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-purple-300 font-bold flex items-center gap-1 mt-0.5">
                    <img src={diamondsImg} alt="" className="w-3.5 h-3.5 object-contain" />
                    +{pack.diamonds} Diamonds
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleBuyDiamonds(pack)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 text-white font-black text-xs uppercase shadow active:scale-95 transition-all cursor-pointer flex items-center gap-1 border border-emerald-300"
              >
                <span>₱{pack.pricePhp}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── General Supplies Section ── */}
      <div>
        <h2 className="text-base sm:text-lg font-black text-amber-200 uppercase tracking-wide mb-3 flex items-center gap-2">
          <img src={dogfoodImg} alt="" className="w-5 h-5 object-contain" /> Pet Supplies & Treats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-b from-amber-950/40 to-black/70 border border-amber-600/40 rounded-2xl p-4 flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-900/30 border border-amber-600/40 flex items-center justify-center overflow-hidden">
                  <TieredCurrencyGraphic type={item.type} tier={item.tier} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-amber-100">{item.name}</h3>
                  <span className="text-xs text-emerald-400 font-bold">{item.amount}</span>
                </div>
              </div>
              <button
                onClick={() => handleBuy(item)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-amber-950 font-black text-xs uppercase shadow active:scale-95 transition-all cursor-pointer"
              >
                <img src={coinsImg} alt="Coins" className="w-4 h-4 object-contain" />
                <span>{item.cost}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
