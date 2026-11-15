import React, { useState, useEffect, useMemo } from 'react'
import { useGame } from '../context/GameContext.jsx'
import { getDogStageInfo } from '../utils/dogEvolution.js'
import gardenHabitatInsideImg from '../assets/habitats/GardenHabitatInside.png'
import snowHabitatInsideImg from '../assets/habitats/SnowHabitatInside.png'
import beachHabitatInsideImg from '../assets/habitats/BeachHabitatInside.png'
import statCardImg from '../assets/ui/StatCard.png'
import coinsImg from '../assets/ui/coins.png'
import diamondsImg from '../assets/ui/diamonds.png'
import dogfoodImg from '../assets/ui/dogfood.png'
import resourcesPlaceHolderImg from '../assets/ui/ResourcesPlaceHolder.webp'
import habitatCareImg from '../assets/ui/HabitatCare.png'
import iconStar from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_star.svg'
import iconCrown from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_crown.svg'
import iconHeart from '../assets/TrioUIKit_FreeSample_v2.2/icons/icon_heart.svg'
import arrowLeft from '../assets/TrioUIKit_FreeSample_v2.2/cozy/arrow_left.svg'

/**
 * Habitat.jsx
 * Authentic Dragon City style Companion Care & Details View.
 * - Left Side:
 *   - Dog name plaque with inline rename pencil icon.
 *   - Companion dog stepping on the lawn grass with realistic contact shadow.
 *   - 4-segment Dragon City feeding progress meter.
 *   - Dual action buttons: [FEED (kibble)] and [FEED x1 / QUICK FEED].
 * - Right Side (Stat Card Details View):
 *   - Docked vertical side-tabs: Info [i], Stats [Buff], Appearance [Coat], Rank [ArrowUp].
 *   - NO sword/battle tab (as explicitly requested).
 *   - Card body pulls all details: Elements, Source, Income, Master Points, Breed Lore & Description.
 *   - Interactive Care Actions: Bath (+300 Coins), Play (+250 Coins), Brush (+3 Diamonds).
 *   - Secondary utility buttons: [PET COMPANION] and [SWITCH DOG].
 * - Zero emojis; authentic SVG & game assets throughout.
 */
export default function Habitat({ navigate }) {
  const { state, dispatch } = useGame()

  // Find all dogs currently housed across habitats with guaranteed unique IDs (memoized)
  const allDogs = useMemo(() => {
    return (state.placedHabitats || []).flatMap((h) =>
      (h.dogs || []).map((d, dIdx) => {
        const raw = typeof d === 'string' ? { name: d, breedId: 'english-bulldog' } : (d || {})
        return {
          ...raw,
          id: raw.id || `dog_${h.id}_${dIdx}`,
          habitatId: h.id,
          habitatCatalogId: h.habitatId,
          habitatName: h.name,
          habitatDogIndex: dIdx,
        }
      })
    )
  }, [state.placedHabitats])

  // Default to stored selected dog index/habitat or stored dog ID on initial mount
  const [selectedDogId, setSelectedDogId] = useState(() => {
    try {
      const storedHabId = sessionStorage.getItem('dogtopia_selected_habitat_id')
      const storedIdx = sessionStorage.getItem('dogtopia_selected_dog_index')
      if (storedHabId && storedIdx !== null && storedIdx !== undefined) {
        const habDogs = (state.placedHabitats || [])
          .find((h) => h.id === storedHabId)?.dogs || []
        const byIdx = habDogs[Number(storedIdx)]
        if (byIdx && typeof byIdx === 'object' && byIdx.id) return byIdx.id
      }
      const stored = sessionStorage.getItem('dogtopia_selected_dog_id')
      if (stored) return stored
    } catch (_) { }
    return 'dog_starter_bulldog'
  })

  // Actively selected companion dog
  const activeDog = useMemo(() => {
    if (selectedDogId) {
      const match = allDogs.find((d) => d.id === selectedDogId)
      if (match) return match
    }
    try {
      const storedHabId = sessionStorage.getItem('dogtopia_selected_habitat_id')
      const storedIdx = sessionStorage.getItem('dogtopia_selected_dog_index')
      if (storedHabId && storedIdx !== null && storedIdx !== undefined) {
        const habDogs = allDogs.filter((d) => d.habitatId === storedHabId)
        const byIdx = habDogs[Number(storedIdx)]
        if (byIdx) return byIdx
      }
      if (storedHabId) {
        const hab = (state.placedHabitats || []).find((h) => h.id === storedHabId)
        if (hab) {
          const isSnow = (hab.habitatId || '').toLowerCase().includes('snow') || (hab.name || '').toLowerCase().includes('snow')
          if (isSnow) {
            return {
              id: `dog_${hab.id}_0`,
              breedId: 'arctic-husky',
              name: 'Balto',
              level: 1,
              feedProgress: 0,
              feedRequired: 4,
              stage: 'Puppy',
              element: 'Snow Element',
              habitatId: hab.id,
              habitatCatalogId: hab.habitatId || 'snowy-peak',
              habitatName: hab.name || 'Snowy Peak',
            }
          }
        }
      }
    } catch (_) { }
    return allDogs[0] || {
      id: 'dog_starter_bulldog',
      breedId: 'english-bulldog',
      name: 'Winston',
      level: 1,
      feedProgress: 0,
      feedRequired: 4,
      stage: 'Puppy',
      element: 'Garden Element',
      habitatName: 'Garden Park',
    }
  }, [allDogs, selectedDogId, state.placedHabitats])

  // Determine parent habitat hosting the active dog
  const parentHabitat = useMemo(() => {
    return (state.placedHabitats || []).find((h) => h.id === activeDog.habitatId)
  }, [state.placedHabitats, activeDog.habitatId])

  // Select the appropriate Inside Scene image based on habitat type, name, or breed
  const habitatInsideBg = useMemo(() => {
    const rawId = (parentHabitat?.habitatId || activeDog.habitatCatalogId || activeDog.habitatId || '').toLowerCase()
    const rawName = (parentHabitat?.name || activeDog.habitatName || '').toLowerCase()
    const breed = (activeDog.breedId || '').toLowerCase()

    if (rawId.includes('snow') || rawName.includes('snow') || breed.includes('husky') || breed.includes('samoyed')) {
      return snowHabitatInsideImg
    }
    if (rawId.includes('beach') || rawName.includes('beach') || breed.includes('labrador')) {
      return beachHabitatInsideImg
    }
    return gardenHabitatInsideImg
  }, [parentHabitat, activeDog])

  // Resident dogs within this same habitat for quick prev/next cycling
  const currentHabitatDogs = useMemo(() => {
    return allDogs.filter((d) => d.habitatId === activeDog.habitatId)
  }, [allDogs, activeDog.habitatId])

  // Compute current stage info & assets
  const stageInfo = getDogStageInfo(activeDog)

  // Name editing state (keeps in sync when switching between dogs)
  const [customName, setCustomName] = useState(activeDog.name || stageInfo.defaultName || 'Winston')
  useEffect(() => {
    setCustomName(activeDog.name || stageInfo.defaultName || 'Winston')
  }, [activeDog.id, activeDog.name, stageInfo.defaultName])

  const [isEditingName, setIsEditingName] = useState(false)

  // Sync selected dog id into session
  useEffect(() => {
    if (activeDog?.id) {
      try {
        sessionStorage.setItem('dogtopia_selected_dog_id', activeDog.id)
      } catch (_) { }
    }
  }, [activeDog?.id])

  // Dog Action Modals (Sell Confirm)
  const [showSellConfirm, setShowSellConfirm] = useState(false)

  // Sell refund calculation (based on companion level)
  const sellRefund = Math.max(350, (activeDog.level || 1) * 60 + 300)

  const handleSellDog = () => {
    dispatch({
      type: 'SELL_DOG',
      payload: {
        dogId: activeDog.id,
        refundCoins: sellRefund,
      },
    })
    setShowSellConfirm(false)
    const remainingDogs = allDogs.filter((d) => d.id !== activeDog.id)
    if (remainingDogs.length > 0) {
      setSelectedDogId(remainingDogs[0].id)
      setRewardToast({ text: `Sold for +${sellRefund} Coins!` })
    } else {
      navigate('world')
    }
  }

  // Interactive UI feedback states
  const [feedAnimation, setFeedAnimation] = useState(false)
  const [petHearts, setPetHearts] = useState(false)
  const [rewardToast, setRewardToast] = useState(null)
  const [levelUpBurst, setLevelUpBurst] = useState(null)
  const [evolutionModal, setEvolutionModal] = useState(null)

  // Number formatting helper matching Island HUD
  const fmt = (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' M'
    if (n >= 1_000) return (n / 1_000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + ' K'
    return String(n)
  }

  // Dog status gauges
  const [stats, setStats] = useState({
    hunger: 75,
    happiness: 90,
    energy: 85,
    cleanliness: 80,
  })

  // Handle feeding (Dragon City 4-feed logic)
  const handleFeed = (feedsCount = 1) => {
    const totalCost = stageInfo.kibbleCostPerFeed * feedsCount
    if ((state.kibble || 0) < totalCost) {
      setRewardToast({ text: `Need ${totalCost} Kibble! Visit Shop!`, icon: dogfoodImg })
      setTimeout(() => setRewardToast(null), 2000)
      return
    }

    const currentLevel = stageInfo.level
    const nextFeedProg = stageInfo.feedProgress + feedsCount
    const willLevelUp = nextFeedProg >= 4
    const nextLevel = willLevelUp ? currentLevel + 1 : currentLevel

    // Visual eating effect
    setFeedAnimation(true)
    setTimeout(() => setFeedAnimation(false), 900)

    for (let i = 0; i < feedsCount; i++) {
      dispatch({
        type: 'FEED_DOG',
        payload: {
          habitatId: activeDog.habitatId,
          dogId: activeDog.id,
        },
      })
    }

    setStats((prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 15 * feedsCount),
      happiness: Math.min(100, prev.happiness + 5 * feedsCount),
    }))

    if (willLevelUp) {
      setLevelUpBurst(nextLevel)
      setTimeout(() => setLevelUpBurst(null), 2400)

      if (nextLevel === 4) {
        setTimeout(() => {
          setEvolutionModal({
            dogName: customName || activeDog.name,
            oldStage: 'Puppy',
            newStage: 'Young Pup',
            level: 4,
            description: stageInfo.youngEvolutionDesc,
          })
        }, 1200)
      } else if (nextLevel === 12) {
        setTimeout(() => {
          setEvolutionModal({
            dogName: customName || activeDog.name,
            oldStage: 'Young Pup',
            newStage: 'Adult Dog',
            level: 12,
            description: stageInfo.adultEvolutionDesc,
          })
        }, 1200)
      } else {
        setRewardToast({
          text: `LEVEL UP! Reached Level ${nextLevel}! (+${stageInfo.xpBonusOnLevelUp} XP)`,
          icon: iconStar,
        })
        setTimeout(() => setRewardToast(null), 2200)
      }
    } else {
      setRewardToast({
        text: `Fed ${totalCost} Kibble (+${stageInfo.coinsRewardPerFeed * feedsCount} Coins, +${stageInfo.xpRewardPerFeed * feedsCount} XP)`,
        icon: dogfoodImg,
      })
      setTimeout(() => setRewardToast(null), 1600)
    }
  }

  // Pet action
  const handlePetDog = () => {
    setPetHearts(true)
    setStats((prev) => ({ ...prev, happiness: Math.min(100, prev.happiness + 10) }))
    dispatch({
      type: 'ADD_CURRENCY',
      payload: { coins: 50, xp: 20 },
    })
    setRewardToast({ text: 'Loved & Petted! (+50 Coins, +20 XP)', icon: iconHeart })
    setTimeout(() => {
      setPetHearts(false)
      setRewardToast(null)
    }, 1500)
  }

  // Care actions
  const handleCareTask = (type, reward, statDeltas) => {
    setStats((prev) => ({
      hunger: Math.min(100, Math.max(0, prev.hunger + (statDeltas.hunger || 0))),
      happiness: Math.min(100, Math.max(0, prev.happiness + (statDeltas.happiness || 0))),
      energy: Math.min(100, Math.max(0, prev.energy + (statDeltas.energy || 0))),
      cleanliness: Math.min(100, Math.max(0, prev.cleanliness + (statDeltas.cleanliness || 0))),
    }))

    dispatch({
      type: 'ADD_CURRENCY',
      payload: reward,
    })

    setRewardToast({ text: reward.text, icon: reward.icon || iconStar })
    setTimeout(() => setRewardToast(null), 1800)
  }

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col justify-between p-2 sm:p-4 select-none overflow-hidden">
      {/* ── Background Habitat Inside Scene (Dynamic for Snow, Beach, Garden, etc.) ── */}
      <img
        src={habitatInsideBg}
        alt={`${activeDog.habitatName || parentHabitat?.name || 'Habitat'} Interior`}
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
      />

      {/* Subtle depth vignette */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        style={{
          background: 'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(0,0,0,0.02) 50%, rgba(15,7,2,0.38) 100%)',
        }}
      />

      {/* ── Top Navigation & Resource Bar ── */}
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto z-30 pt-1">
        {/* Back to Island Button */}
        <div className="flex-1 flex items-center justify-start min-w-0">
          <button
            onClick={() => navigate('world')}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl font-black text-xs sm:text-sm text-amber-950 uppercase transition-all active:scale-90 hover:scale-105 cursor-pointer shadow-lg whitespace-nowrap"
            style={{
              background: 'linear-gradient(180deg, #fef08a 0%, #f59e0b 100%)',
              border: '2px solid #d97706',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4), inset 0 1px 2px rgba(255,255,255,0.8)',
              fontFamily: "'Lilita One', 'Fredoka', sans-serif",
              letterSpacing: '0.03em',
            }}
          >
            <img src={arrowLeft} alt="" className="w-4 h-4 object-contain" />
            <span className="hidden sm:inline">BACK TO ISLAND</span>
            <span className="sm:hidden">BACK</span>
          </button>
        </div>

        {/* Center Title Badge with HabitatCare.png Placeholder (Proportionately Sized & Balanced) */}
        <div
          className="relative flex items-center justify-center select-none flex-shrink-0 -my-2"
          style={{ filter: 'drop-shadow(0 6px 14px rgba(18, 6, 2, 0.8))' }}
        >
          <img
            src={habitatCareImg}
            alt="Habitat Care"
            className="w-44 sm:w-52 md:w-60 lg:w-68 max-w-[290px] h-auto object-contain pointer-events-none select-none"
          />
          {/* Text positioned strictly centered inside the wooden plank */}
          <div
            className="absolute flex items-center justify-center pointer-events-none px-1"
            style={{
              left: '34%',
              right: '14%',
              top: '0',
              bottom: '0',
            }}
          >
            <span
              className="font-black text-[12px] sm:text-[13px] md:text-sm lg:text-base tracking-wide leading-none text-center select-none text-white truncate"
              style={{
                fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                textShadow: '0 1.5px 0 #3b1404, 0 2px 0 #1f0a02, 0 3px 5px rgba(0,0,0,0.95)',
                color: '#ffffff',
                letterSpacing: '0.04em',
              }}
            >
              {activeDog.habitatName || parentHabitat?.name || 'Garden Park'} Care
            </span>
          </div>
        </div>

        {/* Wood & Gold Currency Pills (Handcrafted ResourcesPlaceHolder matching Island View) */}
        <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-end min-w-0">
          {/* Star Crystals (Diamonds) */}
          <WoodResourcePill
            type="crystals"
            icon={diamondsImg}
            value={(state.crystals || 0).toLocaleString()}
            label="Star Crystals"
            onPlus={() => navigate('store')}
          />

          {/* Paw Coins */}
          <WoodResourcePill
            type="coins"
            icon={coinsImg}
            value={fmt(state.coins || 0)}
            label="Paw Coins"
            onPlus={() => navigate('store')}
          />

          {/* Kibble (Dog Food) */}
          <WoodResourcePill
            type="kibble"
            icon={dogfoodImg}
            value={fmt(state.kibble || 0)}
            label="Kibble"
            onPlus={() => navigate('store')}
          />
        </div>
      </div>

      {/* ── Main Stage (Dragon City Split Layout) ── */}
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 px-2 sm:px-4 my-auto z-10 overflow-visible">
        {/* ════════════════════════════════════════════════════
            LEFT SIDE: Dog Stepping on Grass & Feed Station
        ════════════════════════════════════════════════════ */}
        <div className="relative flex-1 w-full flex flex-col items-center justify-center max-w-md lg:max-w-lg select-none">
          {/* Top Center: Name Plaque centered directly above the dog */}
          <div className="flex items-center justify-center mb-1.5 z-20">
            <div
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border border-amber-400/60 shadow-lg backdrop-blur-md"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(254,243,199,0.95) 100%)',
              }}
            >
              {/* Pencil Icon */}
              <button
                type="button"
                onClick={() => setIsEditingName(!isEditingName)}
                title="Edit Dog Name"
                className="w-5 h-5 rounded-md bg-amber-200/90 hover:bg-amber-300 flex items-center justify-center text-amber-950 transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>

              {isEditingName ? (
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  autoFocus
                  maxLength={18}
                  className="font-black text-xs sm:text-sm text-amber-950 uppercase bg-transparent outline-none border-b border-amber-700 w-28"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                />
              ) : (
                <span
                  onClick={() => setIsEditingName(true)}
                  className="font-black text-xs sm:text-sm text-amber-950 uppercase tracking-wide cursor-pointer hover:text-amber-800"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  {customName}
                </span>
              )}

              {/* Stage Pill */}
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
                LV {stageInfo.level}
              </span>
            </div>
          </div>

          {/* Floating UI Feedback Bursts */}
          {feedAnimation && (
            <div className="absolute top-[25%] z-50 animate-bounce flex items-center gap-1 pointer-events-none">
              <img src={dogfoodImg} alt="" className="w-14 h-14 object-contain filter drop-shadow-xl brightness-125" />
            </div>
          )}

          {petHearts && (
            <div className="absolute top-[20%] flex items-center gap-1 z-50 animate-pulse pointer-events-none">
              <img src={iconHeart} alt="" className="w-12 h-12 object-contain drop-shadow" />
            </div>
          )}

          {levelUpBurst && (
            <div className="absolute top-[15%] z-50 animate-pulse bg-gradient-to-r from-amber-500 to-yellow-300 text-amber-950 px-5 py-2 rounded-3xl border-2 border-white shadow-2xl flex items-center gap-2 pointer-events-none whitespace-nowrap">
              <img src={iconStar} alt="" className="w-6 h-6 object-contain" />
              <span
                className="font-black text-sm uppercase tracking-wider"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
              >
                LEVEL UP! LEVEL {levelUpBurst}!
              </span>
              <img src={iconStar} alt="" className="w-6 h-6 object-contain" />
            </div>
          )}

          {rewardToast && (
            <div className="absolute -top-10 z-50 animate-bounce bg-zinc-950/95 px-4 py-2 rounded-2xl border-2 border-amber-400 shadow-2xl flex items-center gap-2 pointer-events-none whitespace-nowrap">
              <img src={rewardToast.icon || iconStar} alt="" className="w-5 h-5 object-contain" />
              <span
                className="font-black text-amber-200 text-xs sm:text-sm tracking-wide"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
              >
                {rewardToast.text}
              </span>
            </div>
          )}

          {/* Center: The Companion Dog Standing/Stepping on Lawn Grass */}
          <div
            onClick={handlePetDog}
            title={`Click to Pet ${customName}!`}
            className="relative flex flex-col items-center justify-end cursor-pointer group z-20 my-2 transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            {/* Ground Contact Shadow */}
            <div
              className="absolute bottom-2 w-48 sm:w-64 h-8 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(15,7,2,0.7) 0%, rgba(15,7,2,0.2) 60%, transparent 75%)',
              }}
            />

            <img
              src={stageInfo.sitImg}
              alt={customName}
              className={`w-48 sm:w-60 md:w-72 lg:w-80 max-h-[42vh] object-contain filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.65)] transition-all duration-300 ${feedAnimation ? 'scale-110 brightness-125' : ''
                }`}
            />

            <span className="text-[10px] font-black uppercase text-amber-200/90 tracking-wider bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-400/40 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              Tap to Pet (+50 Coins)
            </span>
          </div>

          {/* Directly Below Dog: 4-Segment Feed Progress Meter (Dragon City) */}
          <div className="w-full max-w-xs mt-1.5 p-2 rounded-2xl bg-black/65 backdrop-blur-md border border-amber-900/60 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span
                className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5"
                style={{
                  fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                  textShadow: '0 1.5px 0 #2a1103, 0 2px 4px rgba(0,0,0,0.95)',
                }}
              >
                <span>FEED PROGRESS</span>
                <span className="text-amber-300 font-extrabold">({stageInfo.feedProgress}/4)</span>
              </span>

              <span
                className="text-[10px] sm:text-[11px] font-black text-amber-200 uppercase tracking-wide px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-600/50 shadow-inner"
                style={{
                  fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                  textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                }}
              >
                NEXT LEVEL {stageInfo.level + 1}
              </span>
            </div>

            {/* 4 Segmented Boxes Bar */}
            <div className="grid grid-cols-4 gap-1.5 h-5 sm:h-6 bg-black/90 p-1 rounded-xl border border-amber-950/80 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)]">
              {[0, 1, 2, 3].map((stepIdx) => {
                const isFilled = stepIdx < stageInfo.feedProgress
                return (
                  <div
                    key={stepIdx}
                    className={`rounded-lg transition-all duration-300 flex items-center justify-center ${isFilled
                      ? 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)] border border-yellow-200/90'
                      : 'bg-zinc-900/90 border border-zinc-800 shadow-inner'
                      }`}
                  >
                    {isFilled && (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-none stroke-amber-950"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.7))' }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Directly Below 4-Segment Meter: Dual Action FEED Buttons */}
          <div className="flex items-center gap-2 w-full max-w-xs mt-2.5">
            {/* Left Primary Feed Button */}
            <button
              type="button"
              onClick={() => handleFeed(1)}
              disabled={(state.kibble || 0) < stageInfo.kibbleCostPerFeed}
              className={`flex-1 py-2 sm:py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 border-2 transition-all shadow-xl active:scale-95 hover:scale-105 cursor-pointer ${(state.kibble || 0) >= stageInfo.kibbleCostPerFeed
                ? 'bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 border-amber-100 text-amber-950'
                : 'bg-zinc-800 border-zinc-600 text-zinc-400 cursor-not-allowed opacity-60'
                }`}
              style={{
                boxShadow:
                  (state.kibble || 0) >= stageInfo.kibbleCostPerFeed
                    ? '0 4px 14px rgba(245, 158, 11, 0.5), inset 0 2px 3px rgba(255,255,255,0.7)'
                    : 'none',
              }}
            >
              <img src={dogfoodImg} alt="Kibble" className="w-5 h-5 object-contain filter drop-shadow" />
              <div className="flex flex-col text-left leading-none">
                <span
                  className="font-black text-xs sm:text-sm uppercase tracking-wide"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  FEED
                </span>
                <span className="text-[8px] sm:text-[10px] font-black opacity-95">
                  {stageInfo.kibbleCostPerFeed} Kibble
                </span>
              </div>
            </button>

            {/* Right Quick Feed Button (FEED x1 or x4) */}
            <button
              type="button"
              onClick={() => handleFeed(4 - stageInfo.feedProgress)}
              disabled={(state.kibble || 0) < stageInfo.kibbleCostPerFeed * (4 - stageInfo.feedProgress)}
              className="py-2 sm:py-2.5 px-3.5 rounded-2xl bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 border-2 border-white text-amber-950 font-black text-xs uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0"
              style={{
                fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                boxShadow: '0 4px 14px rgba(234, 179, 8, 0.4), inset 0 2px 3px rgba(255,255,255,0.7)',
              }}
              title="Quick Level Up: Feed all remaining steps"
            >
              <span>FEED x{4 - stageInfo.feedProgress}</span>
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            RIGHT SIDE: StatCard Details Card with Docked Tabs
        ════════════════════════════════════════════════════ */}
        <div className="relative flex-1 w-full max-w-lg lg:max-w-xl flex items-center justify-center select-none">
          {/* Main Stat Card Body */}
          <div
            className="relative w-full rounded-3xl p-5 sm:p-6 border-4 border-amber-400/80 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[380px] sm:min-h-[420px]"
            style={{
              background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #fff9ec 55%, #fce9c8 100%)',
              boxShadow: '0 12px 35px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.95)',
            }}
          >
            <div className="flex-1 flex flex-col justify-between">
              {/* Top Row: ELEMENTS and SOURCE */}
              <div className="grid grid-cols-2 gap-3 pb-3 border-b-2 border-amber-800/20">
                {/* Elements */}
                <div>
                  <span
                    className="text-[10px] sm:text-xs font-black uppercase text-amber-900/80 block mb-1"
                    style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                  >
                    ELEMENTS
                  </span>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl shadow-sm text-white ${
                    (stageInfo.isHusky || habitatInsideBg === snowHabitatInsideImg)
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 border border-sky-300'
                      : 'bg-gradient-to-r from-emerald-600 to-green-700 border border-emerald-300'
                  }`}>
                    <img src={iconStar} alt="" className="w-3.5 h-3.5 object-contain" />
                    <span
                      className="font-black text-xs uppercase tracking-wide"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      {activeDog.element || (stageInfo.isHusky || habitatInsideBg === snowHabitatInsideImg ? 'Snow' : 'Garden')}
                    </span>
                  </div>
                </div>

                {/* Source */}
                <div>
                  <span
                    className="text-[10px] sm:text-xs font-black uppercase text-amber-900/80 block mb-1"
                    style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                  >
                    SOURCE
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-7 h-7 rounded-full bg-pink-500 border border-white flex items-center justify-center shadow-sm"
                      title="Companion Bond"
                    >
                      <img src={iconHeart} alt="" className="w-4 h-4 object-contain" />
                    </div>
                    <div
                      className="w-7 h-7 rounded-full bg-amber-500 border border-white flex items-center justify-center shadow-sm"
                      title="Sanctuary Store"
                    >
                      <img src={coinsImg} alt="" className="w-4 h-4 object-contain" />
                    </div>
                    <span className="text-[10px] font-black text-amber-900 uppercase">
                      Starter / Sanctuary
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Row: INCOME and MASTER POINTS */}
              <div className="grid grid-cols-2 gap-3 py-3 border-b-2 border-amber-800/20">
                {/* Income */}
                <div>
                  <span
                    className="text-[10px] sm:text-xs font-black uppercase text-amber-900/80 block mb-1"
                    style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                  >
                    INCOME
                  </span>
                  <div className="flex items-center gap-1.5">
                    <img src={coinsImg} alt="Coins" className="w-7 h-7 object-contain drop-shadow" />
                    <span
                      className="font-black text-base sm:text-lg text-amber-950"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      +{stageInfo.coinRatePerMin}/min
                    </span>
                  </div>
                </div>

                {/* Master Points */}
                <div>
                  <span
                    className="text-[10px] sm:text-xs font-black uppercase text-amber-900/80 block mb-1"
                    style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                  >
                    MASTER POINTS
                  </span>
                  <div className="flex items-center gap-1.5">
                    <img src={iconCrown} alt="Master Points" className="w-6 h-6 object-contain drop-shadow" />
                    <span
                      className="font-black text-base sm:text-lg text-amber-950"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      {activeDog.masterPoints || (stageInfo.level * 40 + 15)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom: DESCRIPTION / LORE */}
              <div className="pt-3">
                <span
                  className="text-[10px] sm:text-xs font-black uppercase text-amber-900/80 block mb-1"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  DESCRIPTION
                </span>
                <p className="text-xs sm:text-sm text-amber-950 font-semibold leading-relaxed bg-amber-50/70 p-3 rounded-2xl border border-amber-900/15">
                  {stageInfo.description}
                </p>
              </div>
            </div>

            {/* ── Bottom Utility Buttons: MOVE HABITAT and SELL DOG ── */}
            <div className="flex items-center gap-2 pt-3 border-t-2 border-amber-800/20 mt-3">
              {/* MOVE HABITAT BUTTON (Transfers dog to another compatible habitat) */}
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.setItem(
                      'dogtopia_transfer_dog',
                      JSON.stringify({
                        ...activeDog,
                        image: activeDog.image || stageInfo.sitImg,
                        isTransfer: true,
                        sourceHabitatId: activeDog.habitatId,
                      })
                    )
                  } catch (_) { }
                  navigate('world')
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                title={`Transfer ${customName} to another compatible habitat on the island`}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white drop-shadow">
                  <path d="M12 2L15 6H13V9H16V7L20 10L16 13V11H13V15H15L12 19L9 15H11V11H8V13L4 10L8 7V9H11V6H9L12 2Z" />
                </svg>
                <span>TRANSFER HABITAT</span>
              </button>

              {/* SELL DOG BUTTON */}
              <button
                type="button"
                onClick={() => setShowSellConfirm(true)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-amber-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-amber-200"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                title={`Sell ${customName} for +${sellRefund} coins refund`}
              >
                <img src={coinsImg} alt="" className="w-4 h-4 object-contain" />
                <span>SELL DOG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sell Dog Confirmation Modal ── */}
      {showSellConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4 select-none">
          <div
            className="relative w-full max-w-sm rounded-3xl p-6 border-4 border-amber-400 shadow-2xl flex flex-col items-center text-center"
            style={{
              background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #fff9ec 55%, #fce9c8 100%)',
              boxShadow: '0 12px 35px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.95)',
            }}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-white flex items-center justify-center shadow-lg mb-3">
              <img src={coinsImg} alt="Coins" className="w-8 h-8 object-contain drop-shadow" />
            </div>

            <h2
              className="text-xl font-black text-amber-950 uppercase mb-1"
              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
            >
              SELL COMPANION?
            </h2>

            <p className="text-xs sm:text-sm text-amber-900 font-semibold mb-5 leading-relaxed">
              Are you sure you want to sell <span className="font-black text-amber-950">{customName}</span>? You will receive <span className="font-black text-emerald-700">+{sellRefund} Coins</span> refund.
            </p>

            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setShowSellConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-300 hover:bg-stone-400 text-stone-800 font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border border-stone-400"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleSellDog}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-amber-950 font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer border border-white shadow-md flex items-center justify-center gap-1.5"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
              >
                <img src={coinsImg} alt="" className="w-3.5 h-3.5 object-contain" />
                <span>SELL (+{sellRefund})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          DRAGON CITY EVOLUTION CEREMONY CELEBRATION MODAL
      ════════════════════════════════════════════════════════ */}
      {evolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn p-4 select-none">
          {/* Animated Sunburst Golden Rays */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 animate-spin"
            style={{
              animationDuration: '24s',
              background:
                'repeating-conic-gradient(from 0deg, #f59e0b 0deg 15deg, transparent 15deg 30deg)',
            }}
          />

          <div
            className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center border-4 border-amber-300 shadow-[0_0_60px_rgba(245,158,11,0.6)] z-10"
            style={{
              background: 'radial-gradient(circle at 50% 30%, #5e2608 0%, #2b0f02 70%, #150600 100%)',
            }}
          >
            {/* Top Celebration Crown */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 border-2 border-white flex items-center justify-center shadow-xl mb-2 -mt-12 animate-bounce">
              <img src={iconCrown} alt="" className="w-9 h-9 object-contain drop-shadow" />
            </div>

            {/* Title Banner */}
            <h1
              className="text-2xl sm:text-3xl font-black text-amber-300 uppercase tracking-wider mb-1"
              style={{
                fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                textShadow: '0 3px 6px rgba(0,0,0,0.9), 0 0 20px #f59e0b',
              }}
            >
              {evolutionModal.level >= 12 ? 'FINAL EVOLUTION!' : 'EVOLUTION REACHED!'}
            </h1>

            <p className="text-amber-200 text-xs sm:text-sm font-semibold max-w-md mb-4 leading-relaxed">
              {evolutionModal.description}
            </p>

            {/* Center Stage: The Transformed Bulldog */}
            <div className="relative my-3 flex items-center justify-center">
              <div className="absolute w-48 h-48 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
              <img
                src={stageInfo.sitImg}
                alt={evolutionModal.newStage}
                className="w-36 sm:w-44 md:w-52 h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] animate-pulse"
              />
            </div>

            {/* Transformation Stage Change Badges */}
            <div className="flex items-center gap-3 my-3">
              <span className="px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-700 text-amber-300 font-bold text-xs uppercase line-through opacity-70">
                {evolutionModal.oldStage}
              </span>
              <span className="text-amber-400 font-black text-lg">➔</span>
              <span className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 border-2 border-white text-amber-950 font-black text-sm uppercase shadow-lg animate-bounce">
                {evolutionModal.newStage} (Lv {evolutionModal.level})
              </span>
            </div>

            {/* Stat Gains Pill */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-5 text-[11px] font-bold text-amber-200">
              <div className="bg-amber-950/60 p-2 rounded-xl border border-amber-800/60 flex items-center justify-center gap-1.5">
                <img src={coinsImg} alt="" className="w-4 h-4 object-contain" />
                <span>Coin Rate: +{stageInfo.coinRatePerMin} / min</span>
              </div>
              <div className="bg-amber-950/60 p-2 rounded-xl border border-amber-800/60 flex items-center justify-center gap-1.5">
                <img src={iconStar} alt="" className="w-4 h-4 object-contain" />
                <span>Trainer XP: +250 XP</span>
              </div>
            </div>

            {/* Awesome / Continue Button */}
            <button
              onClick={() => setEvolutionModal(null)}
              className="w-full max-w-xs py-3 rounded-2xl font-black text-base uppercase tracking-wider text-amber-950 shadow-2xl active:scale-95 hover:scale-105 transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #fef08a 0%, #f59e0b 50%, #d97706 100%)',
                border: '2.5px solid #ffffff',
                boxShadow: '0 8px 25px rgba(245,158,11,0.6), inset 0 2px 4px rgba(255,255,255,0.8)',
                fontFamily: "'Lilita One', 'Fredoka', sans-serif",
              }}
            >
              AWESOME!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * WoodResourcePill
 * Authentic Wood & Gold Currency Pill matching WorldHUD (Island View).
 * Features:
 *   - Uses the handcrafted ResourcesPlaceHolder.webp wooden plank
 *   - Juicy tactile emerald/gold "+" button to navigate to store
 *   - Embossed 3D numbers with Lilita One typography
 */
function WoodResourcePill({
  type,
  icon,
  value,
  label,
  onPlus,
}) {
  const isCrystals = type === 'crystals'
  const isKibble = type === 'kibble'

  const glowColor = isCrystals
    ? 'rgba(192, 132, 252, 0.75)'
    : isKibble
      ? 'rgba(251, 146, 60, 0.75)'
      : 'rgba(253, 224, 71, 0.75)'

  return (
    <div
      onClick={onPlus}
      title={`${label}: ${value} (Click to open store)`}
      className="relative flex items-center justify-center select-none cursor-pointer group active:scale-95 transition-transform"
      style={{
        filter: 'drop-shadow(0 4px 10px rgba(18, 6, 2, 0.75))',
      }}
    >
      {/* Handcrafted ResourcesPlaceHolder.webp wooden plank with gold border & leaves */}
      <img
        src={resourcesPlaceHolderImg}
        alt={label}
        className="h-9 sm:h-10 md:h-11 w-auto object-contain pointer-events-none select-none group-hover:brightness-105 transition-all"
      />

      {/* Content overlay accurately fitted inside the wooden plank */}
      <div
        className="absolute left-[9%] right-[9%] top-[17%] bottom-[15%] flex items-center justify-between pointer-events-none px-1"
      >
        {/* Left Resource Icon */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0">
          <img
            src={icon}
            alt={label}
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain select-none drop-shadow group-hover:scale-110 transition-transform"
            style={{ filter: 'drop-shadow(0 1.5px 3px rgba(0,0,0,0.85))' }}
          />
        </div>

        {/* Center Value */}
        <span
          className="font-black text-[11px] sm:text-xs md:text-sm tracking-wide flex-1 text-center truncate px-1 select-none leading-none pt-0.5"
          style={{
            fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
            color: '#ffffff',
            textShadow: `0 1.5px 0 #3b1404, 0 2px 4px #000, 0 0 10px ${glowColor}`,
            letterSpacing: '0.03em',
          }}
        >
          {value}
        </span>

        {/* Right Tactile 3D Green Plus Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPlus && onPlus()
          }}
          title={`Add ${label}`}
          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-black text-[10px] sm:text-xs text-white shadow-md active:scale-85 hover:scale-110 transition-all flex-shrink-0 cursor-pointer pointer-events-auto"
          style={{
            background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 60%, #15803d 100%)',
            border: '1.5px solid #dcfce7',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.7), inset 0 1px 2px rgba(255,255,255,0.7)',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}
