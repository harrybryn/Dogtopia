import React, { useState } from 'react'
import { useGame } from '../../context/GameContext.jsx'
import iconStar from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_star.svg'
import iconGem from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_gem.svg'
import iconGoldPile from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_gold_pile.svg'
import iconMeat from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_meat.svg'
import coinsImg from '../../assets/ui/coins.png'
import diamondsImg from '../../assets/ui/diamonds.png'
import dogfoodImg from '../../assets/ui/dogfood.png'
import dogfoodFactoryImg from '../../assets/itemsInShop/building/DogfoodFactory.png'
import iconGear from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_gear.svg'
import iconCrown from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_crown.svg'
import iconQuestion from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_question.svg'
import iconHeart from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_heart.svg'
import iconChest from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_chest.svg'
import iconSoundOn from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_sound_on.svg'

import BuildStoreModal from './BuildStoreModal.jsx'
import GoalsModal from './GoalsModal.jsx'
import RankingModal from './RankingModal.jsx'
import { ProgressModal } from './ProgressModal.jsx'
import SocialModal from './SocialModal.jsx'
import GenericModal from '../common/GenericModal.jsx'

import bulldogPuppySit from '../../assets/itemsInShop/dogs/BulldogPuppySit.png'
import { getDogStageInfo } from '../../utils/dogEvolution.js'

import progressBarImg from '../../assets/ui/progress-bar.webp'
import shopImg from '../../assets/ui/shop.png'
import resourcesPlaceHolderImg from '../../assets/ui/ResourcesPlaceHolder.webp'
import settingPlaceHolderImg from '../../assets/ui/SettingPlaceHolder.webp'
import goalsIconImg from '../../assets/ui/GoalsIcon.png'
import progressIconImg from '../../assets/ui/ProressIcon.png'
import socialIconImg from '../../assets/ui/SocialIcon.png'

/**
 * WorldHUD
 * Premium Wood & Gold game UI matching Dragon City.
 * Features:
 *   - Rich dark mahogany woodgrain texture
 *   - Double-beveled 3D metallic golden frames with specular highlights
 *   - Back to Home screen button
 *   - Enlarged Level & XP bar (progress-bar.webp) with liquid gold fill & star medallion
 *   - Masterpiece 3D shop.png BUILD button
 *   - Dragon City bottom action bar when habitat is selected (Resident dogs, Collect, Care, Info, Move)
 *   - Clean layout: no zoom +/- buttons, no grid button, no static bottom button
 */
export default function WorldHUD({
  navigate,
  onStartPlacing,
  onStartPlacingDog,
  selectedHabitat,
  onSelectHabitat,
  onMoveHabitat,
  onOpenInfo,
  zoomIn,
  zoomOut,
  resetCam,
}) {
  const { state, dispatch } = useGame()
  const liveHab = selectedHabitat
    ? state.placedHabitats?.find((h) => h.id === selectedHabitat.id) || selectedHabitat
    : null

  // Modal visibility states
  const [showBuildModal, setShowBuildModal] = useState(false)
  const [buildModalTab, setBuildModalTab] = useState('categories')
  const [showGoalsModal, setShowGoalsModal] = useState(false)
  const [showRankingModal, setShowRankingModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [showSocialModal, setShowSocialModal] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [sfxEnabled, setSfxEnabled] = useState(() => {
    try { return localStorage.getItem('dogtopia_sfx') !== 'false' } catch (_) { return true }
  })
  const [musicEnabled, setMusicEnabled] = useState(() => {
    try { return localStorage.getItem('dogtopia_bgm') !== 'false' } catch (_) { return true }
  })

  const toggleSfx = () => {
    setSfxEnabled((prev) => {
      const next = !prev
      try { localStorage.setItem('dogtopia_sfx', String(next)) } catch (_) {}
      return next
    })
  }

  const toggleMusic = () => {
    setMusicEnabled((prev) => {
      const next = !prev
      try { localStorage.setItem('dogtopia_bgm', String(next)) } catch (_) {}
      return next
    })
  }

  // Number formatting
  const fmt = (n) => {
    if (n >= 1_000_000) return (n / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' M'
    if (n >= 1_000) return (n / 1_000).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + ' K'
    return String(n)
  }

  const maxXp = state.maxXp || 1500000
  const xpPercent = Math.min(100, Math.max(4, Math.round(((state.xp || 0) / maxXp) * 100)))

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          TOP HUD BAR (Wood & Gold Dragon City Style)
      ════════════════════════════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 z-40 px-2 sm:px-4 pt-3 pointer-events-none flex items-start justify-between gap-1.5 sm:gap-3">

        {/* ── 1. Handcrafted Level Medallion & Wood XP Bar (progress-bar.webp) ── */}
        <div
          onClick={() => setShowProgressModal(true)}
          title="Player Level & Milestone Progress (Click to view milestones)"
          className="pointer-events-auto relative cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center select-none"
          style={{ filter: 'drop-shadow(0 10px 24px rgba(18, 6, 2, 0.9))' }}
        >
          <div className="relative flex items-center">
            {/* Large Handcrafted progress-bar.webp asset */}
            <img
              src={progressBarImg}
              alt="Level & XP Progress"
              className="h-20 sm:h-24 md:h-28 w-auto object-contain pointer-events-none"
            />

            {/* Medallion Center: Bold, Clean 3D Level Number accurately centered in the golden circle */}
            <div
              className="absolute left-[26.1%] top-[45.1%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10"
            >
              <span
                className="font-black text-2xl sm:text-3xl md:text-4xl tracking-tight select-none leading-none text-center"
                style={{
                  fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                  color: '#ffffff',
                  textShadow: '0 2px 0 #3b1404, 0 3px 0 #1f0a02, 0 4px 6px rgba(0,0,0,0.85)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                }}
              >
                {state.level}
              </span>
            </div>

            {/* Liquid Gold XP Fill & Value Text accurately fitted inside the dark brown wooden channel */}
            <div
              className="absolute left-[39.5%] right-[6.5%] top-[27%] bottom-[31%] overflow-hidden flex items-center pointer-events-none"
              style={{
                boxShadow: 'inset 0 1.5px 3px rgba(0, 0, 0, 0.65)',
              }}
            >
              {/* Natural Amber-Gold XP Fill - Blends naturally with the wood & gold texture, NO blinking */}
              <div
                className="absolute left-0 top-0 bottom-0 transition-all duration-500 rounded-r-md overflow-hidden flex items-center justify-end"
                style={{
                  width: `${xpPercent}%`,
                  background: 'linear-gradient(180deg, #ffd700 0%, #f59e0b 45%, #b45309 85%, #78350f 100%)',
                  boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.45), inset 0 -2px 3px rgba(35, 12, 2, 0.7), 0 1px 4px rgba(0,0,0,0.5)',
                  borderRight: '1.5px solid rgba(255, 235, 150, 0.7)',
                }}
              >
                {/* Subtle natural top sheen (static, never blinks) */}
                <div
                  className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none opacity-30"
                  style={{
                    background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0) 100%)',
                  }}
                />
              </div>

              {/* XP Value Text - Solid, clear, natural game typography with drop shadow (NO -webkit-text-stroke) */}
              <span
                className="relative z-10 text-xs sm:text-sm md:text-base font-black tracking-wider whitespace-nowrap pl-3 sm:pl-4 select-none leading-none"
                style={{
                  fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                  color: '#ffffff',
                  textShadow: '0 2px 0 #3b1404, 0 3px 5px rgba(0,0,0,0.9)',
                  letterSpacing: '0.05em',
                }}
              >
                {fmt(state.xp)} XP
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Wood & Gold Currency Pills (Center/Right) ── */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-end">
          {/* Star Crystals (Gems) */}
          <WoodResourcePill
            type="crystals"
            icon={diamondsImg}
            value={state.crystals.toLocaleString()}
            label="Star Crystals"
            onPlus={() => {
              setBuildModalTab('diamonds')
              setShowBuildModal(true)
            }}
          />

          {/* Paw Coins (Gold Pile) */}
          <WoodResourcePill
            type="coins"
            icon={coinsImg}
            value={fmt(state.coins)}
            label="Paw Coins"
            onPlus={() => {
              setBuildModalTab('categories')
              setShowBuildModal(true)
            }}
          />

          {/* Kibble (Meat Treats) */}
          <WoodResourcePill
            type="kibble"
            icon={dogfoodImg}
            value={fmt(state.kibble)}
            label="Kibble"
            onPlus={() => {
              setBuildModalTab('packs')
              setShowBuildModal(true)
            }}
          />

          {/* Handcrafted Settings Button (SettingPlaceHolder.webp) */}
          <button
            onClick={() => setShowSettingsMenu((v) => !v)}
            title="Settings & Game Menu"
            className="relative h-10 sm:h-11 md:h-12 w-10 sm:w-11 md:w-12 flex items-center justify-center active:scale-95 transition-transform cursor-pointer group flex-shrink-0"
            style={{
              filter: 'drop-shadow(0 4px 10px rgba(18, 6, 2, 0.75))',
            }}
          >
            <img
              src={settingPlaceHolderImg}
              alt="Settings"
              className="w-full h-full object-contain pointer-events-none select-none group-hover:brightness-105 group-hover:scale-105 transition-all duration-300"
            />
            <img
              src={iconGear}
              alt="Settings"
              className="absolute w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow group-hover:rotate-45 transition-transform duration-300 pointer-events-none"
              style={{ filter: 'drop-shadow(0 1.5px 3px rgba(0,0,0,0.85))' }}
            />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          LEFT COLUMN BADGES (GOALS, PROGRESS, SOCIAL)
      ════════════════════════════════════════════════════════ */}
      <div
        className="absolute top-24 sm:top-28 md:top-32 left-2 sm:left-3 md:left-4 z-30 pointer-events-auto flex flex-col gap-3 sm:gap-3.5 select-none items-center"
        style={{ filter: 'drop-shadow(0 8px 18px rgba(18, 6, 2, 0.75))' }}
      >
        {/* 1. GOALS Badge (GoalsIcon.png with text inside placeholder) */}
        <button
          type="button"
          onClick={() => setShowGoalsModal(true)}
          title="Open Daily Goals & Quests"
          className="relative group cursor-pointer active:scale-90 hover:scale-105 transition-transform flex items-center justify-center select-none bg-transparent border-0 p-0"
        >
          <div className="relative w-15 sm:w-16 md:w-20 aspect-[487/512]">
            <img
              src={goalsIconImg}
              alt="Goals"
              className="w-full h-full object-contain pointer-events-none drop-shadow-md"
            />
            {/* Text label placed directly inside placeholder */}
            <div className="absolute left-[52%] top-[25.6%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none w-[66%]">
              <span
                className="font-black text-[9px] sm:text-[10px] md:text-xs uppercase select-none tracking-wider leading-none text-center"
                style={{
                  fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                  color: '#3b1404',
                  textShadow: '0 1px 0 rgba(255, 255, 255, 0.9), 0 -0.5px 0 rgba(0, 0, 0, 0.2)',
                  letterSpacing: '0.05em',
                }}
              >
                GOALS
              </span>
            </div>
          </div>
        </button>

        {/* 2. PROGRESS Milestone Badge (ProressIcon.png with text inside placeholder) */}
        <button
          type="button"
          onClick={() => setShowProgressModal(true)}
          title="View Season Progress & Milestones"
          className="relative group cursor-pointer active:scale-90 hover:scale-105 transition-transform flex items-center justify-center select-none bg-transparent border-0 p-0"
        >
          <div className="relative w-15 sm:w-16 md:w-20 aspect-[487/512]">
            <img
              src={progressIconImg}
              alt="Progress"
              className="w-full h-full object-contain pointer-events-none drop-shadow-md"
            />
            {/* Text label placed directly inside placeholder */}
            <div className="absolute left-[51%] top-[52.6%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none w-[85%]">
              <span
                className="font-black text-[8px] sm:text-[9.5px] md:text-[11px] uppercase select-none tracking-wider leading-none text-center"
                style={{
                  fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                  color: '#3b1404',
                  textShadow: '0 1px 0 rgba(255, 255, 255, 0.9), 0 -0.5px 0 rgba(0, 0, 0, 0.2)',
                  letterSpacing: '0.04em',
                }}
              >
                PROGRESS
              </span>
            </div>
          </div>
        </button>

        {/* 3. SOCIAL Badge (SocialIcon.png with text inside placeholder) */}
        <button
          type="button"
          onClick={() => setShowSocialModal(true)}
          title="Friends & Social Island Visits"
          className="relative group cursor-pointer active:scale-90 hover:scale-105 transition-transform flex items-center justify-center select-none bg-transparent border-0 p-0"
        >
          <div className="relative w-15 sm:w-16 md:w-20 aspect-[1223/1286]">
            <img
              src={socialIconImg}
              alt="Social"
              className="w-full h-full object-contain pointer-events-none drop-shadow-md"
            />
            {/* Text label placed directly inside placeholder */}
            <div className="absolute left-[50%] top-[67.1%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none w-[70%]">
              <span
                className="font-black text-[9px] sm:text-[10px] md:text-xs uppercase select-none tracking-wider leading-none text-center"
                style={{
                  fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                  color: '#3b1404',
                  textShadow: '0 1px 0 rgba(255, 255, 255, 0.9), 0 -0.5px 0 rgba(0, 0, 0, 0.2)',
                  letterSpacing: '0.05em',
                }}
              >
                SOCIAL
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════
          BOTTOM-RIGHT CONTROLS (shop.png Build & Store Button)
      ════════════════════════════════════════════════════════ */}
      <div
        className="absolute bottom-4 sm:bottom-6 right-3 sm:right-5 z-30 pointer-events-auto flex flex-col items-end"
        style={{ filter: 'drop-shadow(0 10px 24px rgba(18, 6, 2, 0.85))' }}
      >
        <button
          onClick={() => {
            setBuildModalTab('categories')
            setShowBuildModal(true)
          }}
          title="Open Habitat & Building Store"
          className="relative group cursor-pointer active:scale-90 hover:scale-105 transition-transform flex items-center justify-center select-none bg-transparent border-0 p-0"
          style={{ background: 'transparent' }}
        >
          {/* Larger shop.png asset */}
          <img
            src={shopImg}
            alt="Build & Shop"
            className="w-28 sm:w-32 md:w-36 lg:w-40 h-auto object-contain pointer-events-none drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
          />

          {/* BUILD title carved directly inside the shop's ivory bone sign (no coded button) */}
          <div className="absolute left-1/2 top-[72.5%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <span
              className="font-black text-[10px] sm:text-[11px] md:text-xs uppercase select-none tracking-widest leading-none pt-0.5"
              style={{
                fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                color: '#3b1404',
                textShadow: '0 1px 0 rgba(255, 255, 255, 0.85), 0 -0.5px 0 rgba(0, 0, 0, 0.25)',
                letterSpacing: '0.12em',
              }}
            >
              BUILD
            </span>
          </div>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════
          DRAGON CITY HABITAT ACTION CONTROLS BAR (Appears when habitat is clicked)
      ════════════════════════════════════════════════════════ */}
      {liveHab && (
        <div
          className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-end select-none animate-fadeIn max-w-[96vw]"
          style={{ filter: 'drop-shadow(0 14px 30px rgba(18, 6, 2, 0.95))' }}
        >
          {/* Habitat Title Tab on top right (matching Dragon City Flame Habitat level 1) */}
          <div
            className="mr-3 sm:mr-6 px-3.5 py-1 rounded-t-xl border-t-2 border-x-2 border-amber-400 shadow-md flex items-center gap-1.5"
            style={{
              background: 'linear-gradient(180deg, #451a03 0%, #290e02 100%)',
              marginBottom: '-2px',
            }}
          >
            <span
              className="font-black text-[10px] sm:text-xs text-amber-200 tracking-wider uppercase leading-none"
              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
            >
              {liveHab.name} Level {liveHab.level || 1}
            </span>
          </div>

          {/* Main Action Bar Plaque */}
          <div
            className="relative flex items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-amber-400 shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #3d1706 0%, #200a02 100%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.85), inset 0 2px 3px rgba(255,255,255,0.4)',
            }}
          >
            {/* Close Button on corner */}
            <button
              type="button"
              onClick={() => onSelectHabitat && onSelectHabitat(null)}
              title="Deselect Habitat"
              className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-lg active:scale-90 transition-transform cursor-pointer z-20"
            >
              ✕
            </button>

            {/* Check if selected building is a Dogfood Factory */}
            {(liveHab.habitatId === 'dogfood-factory' || liveHab.name === 'Dogfood Factory') ? (
              <>
                {/* 1. Left Section: Dogfood Bakery Info */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 pr-2.5 sm:pr-3.5 border-r border-amber-800/60 flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-amber-400/80 overflow-hidden bg-amber-950/80 shadow-md flex items-center justify-center p-1">
                    <img
                      src={dogfoodFactoryImg}
                      alt="Dogfood Factory"
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span
                      className="font-black text-xs sm:text-sm text-amber-200 tracking-wide uppercase leading-tight"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      Kibble Bakery
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-amber-400/90 leading-tight">
                      Rate: +25 / min
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-100/70 leading-tight">
                      Stored: {liveHab.dogfoodAccumulated || 0} / {liveHab.maxDogfood || 300}
                    </span>
                  </div>
                </div>

                {/* 2. Right Section: Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {/* COLLECT Button */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[9px] sm:text-[10px] border border-amber-200 shadow-md whitespace-nowrap leading-none flex items-center gap-0.5 z-10"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      <span>{(liveHab.dogfoodAccumulated || 0).toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if ((liveHab.dogfoodAccumulated || 0) > 0) {
                          dispatch({
                            type: 'COLLECT_DOGFOOD',
                            payload: { id: liveHab.id },
                          })
                        }
                      }}
                      disabled={!liveHab.dogfoodAccumulated || liveHab.dogfoodAccumulated <= 0}
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 ${
                        (liveHab.dogfoodAccumulated || 0) > 0
                          ? 'bg-gradient-to-b from-amber-400 to-amber-600 hover:brightness-110 cursor-pointer border border-amber-200'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
                      }`}
                      title="Collect fresh Kibble"
                    >
                      <img src={dogfoodImg} alt="Kibble" className="w-6 h-6 object-contain drop-shadow" />
                    </button>
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase text-amber-200 tracking-wider mt-0.5 drop-shadow leading-tight"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      COLLECT
                    </span>
                  </div>

                  {/* INFO Button */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => onOpenInfo && onOpenInfo()}
                      className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center bg-gradient-to-b from-sky-500 to-blue-700 hover:brightness-110 border border-sky-300 shadow-md active:scale-95 transition-transform cursor-pointer"
                      title="View Factory Details"
                    >
                      <img src={iconQuestion} alt="" className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow brightness-200" />
                    </button>
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase text-sky-200 tracking-wider mt-0.5 drop-shadow leading-tight"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      INFO
                    </span>
                  </div>

                  {/* MOVE Button */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => onMoveHabitat && onMoveHabitat(liveHab)}
                      className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center bg-gradient-to-b from-amber-600 to-amber-800 hover:brightness-110 border border-amber-300 shadow-md active:scale-95 transition-transform cursor-pointer"
                      title="Move Building"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-200 drop-shadow">
                        <path d="M12 2L15 6H13V9H16V7L20 10L16 13V11H13V15H15L12 19L9 15H11V11H8V13L4 10L8 7V9H11V6H9L12 2Z" />
                      </svg>
                    </button>
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase text-amber-200 tracking-wider mt-0.5 drop-shadow leading-tight"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      MOVE
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 1. Left Section: Resident Dogs */}
                <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-3 border-r border-amber-800/60 flex-shrink-0">
                  {(liveHab.dogs && liveHab.dogs.length > 0) ? (
                    liveHab.dogs.map((dog, idx) => {
                      const stageInfo = getDogStageInfo(dog)
                      const dogName = typeof dog === 'string' ? dog : (dog.name || `Bulldog #${idx + 1}`)
                      const dogImg = stageInfo.portraitImg || bulldogPuppySit
                      const dogLvl = stageInfo.level
                      const dogId = (typeof dog === 'object' && dog?.id) ? dog.id : `dog_${liveHab.id}_${idx}`

                      return (
                        <button
                          key={dogId}
                          type="button"
                          onClick={() => {
                            try {
                              sessionStorage.setItem('dogtopia_selected_dog_id', dogId)
                              sessionStorage.setItem('dogtopia_selected_habitat_id', liveHab.id)
                              sessionStorage.setItem('dogtopia_selected_dog_index', String(idx))
                            } catch (_) {}
                            navigate('habitat')
                          }}
                          title={`Care for ${dogName} (${stageInfo.stageFullTitle})`}
                          className="group relative flex flex-col items-center cursor-pointer active:scale-95 hover:scale-105 transition-transform"
                        >
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-amber-300 overflow-hidden bg-amber-950 shadow-md flex items-center justify-center relative">
                            <img
                              src={dogImg}
                              alt={dogName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                          </div>

                          {/* Level Badge in top-right corner */}
                          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white text-zinc-950 font-black text-[9px] sm:text-[10px] flex items-center justify-center border border-amber-500 shadow-sm leading-none">
                            {dogLvl}
                          </div>

                          {/* Name below avatar */}
                          <span
                            className="text-[9px] sm:text-[10px] font-black text-amber-200 uppercase tracking-tight text-center max-w-[58px] truncate leading-tight mt-0.5 drop-shadow"
                            style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                          >
                            {dogName}
                          </span>
                        </button>
                      )
                    })
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowBuildModal(true)}
                      className="flex flex-col items-center justify-center cursor-pointer group active:scale-95 px-1"
                      title="Adopt a puppy for this habitat"
                    >
                      <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-dashed border-amber-400/70 bg-amber-950/40 flex items-center justify-center text-amber-300 text-lg font-black group-hover:border-amber-300 group-hover:scale-105 transition-all">
                        +
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-bold text-amber-400/80 uppercase mt-0.5">
                        Add Dog
                      </span>
                    </button>
                  )}
                </div>

                {/* 2. Right Section: Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {/* COLLECT Button */}
                  <div className="relative flex flex-col items-center">
                    {/* Coin Badge above Collect Button */}
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-[9px] sm:text-[10px] border border-amber-200 shadow-md whitespace-nowrap leading-none flex items-center gap-0.5 z-10"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      <span>{(liveHab.coinsAccumulated || 0).toLocaleString()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if ((liveHab.coinsAccumulated || 0) > 0) {
                          dispatch({
                            type: 'COLLECT_HABITAT_COINS',
                            payload: { id: liveHab.id },
                          })
                        }
                      }}
                      disabled={!liveHab.coinsAccumulated || liveHab.coinsAccumulated <= 0}
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95 ${
                        (liveHab.coinsAccumulated || 0) > 0
                          ? 'bg-gradient-to-b from-amber-400 to-amber-600 hover:brightness-110 cursor-pointer border border-amber-200'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
                      }`}
                      title="Collect accumulated Paw Coins"
                    >
                      <img src={coinsImg} alt="" className="w-6 h-6 object-contain drop-shadow" />
                    </button>
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase text-amber-200 tracking-wider mt-0.5 drop-shadow leading-tight"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      COLLECT
                    </span>
                  </div>

                  {/* INFO Button */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => onOpenInfo && onOpenInfo()}
                      className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center bg-gradient-to-b from-sky-500 to-blue-700 hover:brightness-110 border border-sky-300 shadow-md active:scale-95 transition-transform cursor-pointer"
                      title="View Habitat Details"
                    >
                      <img src={iconQuestion} alt="" className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow brightness-200" />
                    </button>
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase text-sky-200 tracking-wider mt-0.5 drop-shadow leading-tight"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      INFO
                    </span>
                  </div>

                  {/* MOVE Button */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => onMoveHabitat && onMoveHabitat(liveHab)}
                      className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center bg-gradient-to-b from-amber-600 to-amber-800 hover:brightness-110 border border-amber-300 shadow-md active:scale-95 transition-transform cursor-pointer"
                      title="Move Habitat"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-200 drop-shadow">
                        <path d="M12 2L15 6H13V9H16V7L20 10L16 13V11H13V15H15L12 19L9 15H11V11H8V13L4 10L8 7V9H11V6H9L12 2Z" />
                      </svg>
                    </button>
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase text-amber-200 tracking-wider mt-0.5 drop-shadow leading-tight"
                      style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                    >
                      MOVE
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          SETTINGS MODAL (GenericModal.png Asset)
      ════════════════════════════════════════════════════════ */}
      {showSettingsMenu && (
        <GenericModal title="SETTINGS" onClose={() => setShowSettingsMenu(false)} maxWidth="max-w-lg">
          <div className="flex flex-col gap-4 p-2">
            {/* Audio & Sound Preferences Toggles */}
            <div className="w-full flex items-center justify-center gap-3">
              {/* SFX Toggle */}
              <button
                type="button"
                onClick={toggleSfx}
                className="flex-1 py-3 px-4 rounded-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-between gap-2 shadow-sm"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #fffbf2 60%, #faecd5 100%)',
                  border: '2px solid #d97706',
                  boxShadow: '0 3px 8px rgba(120,53,15,0.12), inset 0 1px 2px rgba(255,255,255,0.95)',
                }}
              >
                <span
                  className="text-xs sm:text-sm font-black uppercase tracking-wide truncate text-amber-950 flex items-center gap-1.5"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  <img src={iconSoundOn} alt="" className={`w-4 h-4 object-contain ${sfxEnabled ? 'opacity-100' : 'opacity-40 grayscale'}`} />
                  Sound SFX
                </span>
                <span
                  className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-xl shadow-sm ${
                    sfxEnabled
                       ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                      : 'bg-stone-300 text-stone-600'
                  }`}
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  {sfxEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Music BGM Toggle */}
              <button
                type="button"
                onClick={toggleMusic}
                className="flex-1 py-3 px-4 rounded-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-between gap-2 shadow-sm"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #fffbf2 60%, #faecd5 100%)',
                  border: '2px solid #d97706',
                  boxShadow: '0 3px 8px rgba(120,53,15,0.12), inset 0 1px 2px rgba(255,255,255,0.95)',
                }}
              >
                <span
                  className="text-xs sm:text-sm font-black uppercase tracking-wide truncate text-amber-950 flex items-center gap-1.5"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  <img src={iconSoundOn} alt="" className={`w-4 h-4 object-contain ${musicEnabled ? 'opacity-100' : 'opacity-40 grayscale'}`} />
                  Music BGM
                </span>
                <span
                  className={`text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-xl shadow-sm ${
                    musicEnabled
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                      : 'bg-stone-300 text-stone-600'
                  }`}
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  {musicEnabled ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* Game Version Footnote */}
            <div className="text-center pt-2">
              <span
                className="text-[10px] sm:text-[11px] font-bold text-amber-900/70 uppercase tracking-widest"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
              >
                Dogtopia Sanctuary · Version 1.0
              </span>
            </div>
          </div>
        </GenericModal>
      )}

      {/* ════════════════════════════════════════════════════════
          MODALS
      ════════════════════════════════════════════════════════ */}
      {showBuildModal && (
        <BuildStoreModal
          initialTab={buildModalTab}
          onClose={() => setShowBuildModal(false)}
          onStartPlacing={onStartPlacing}
          onStartPlacingDog={onStartPlacingDog}
        />
      )}

      {showGoalsModal && (
        <GoalsModal onClose={() => setShowGoalsModal(false)} />
      )}

      {showRankingModal && (
        <RankingModal onClose={() => setShowRankingModal(false)} />
      )}

      {showProgressModal && (
        <ProgressModal onClose={() => setShowProgressModal(false)} />
      )}

      {showSocialModal && (
        <SocialModal
          onClose={() => setShowSocialModal(false)}
          onNavigate={(page) => {
            setShowSocialModal(false)
            if (navigate) navigate(page)
          }}
        />
      )}

      {/* Animated Keyframes for HUD elements */}
      <style>{`
        @keyframes xp-bar-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   Wood & Gold Resource Capsule Pill
   Replicates the exact craftsmanship of the uploaded loading bar asset:
   - Polished dark mahogany woodgrain channel
   - Double-beveled 3D golden border
   - Left circular gold medallion with custom 3D coin/gem/treat icon
   - Embossed 3D numbers with warm golden text glow
   - Juicy tactile emerald/gold "+" button
───────────────────────────────────────────────────────────── */
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
        className="h-10 sm:h-11 md:h-12 w-auto object-contain pointer-events-none select-none group-hover:brightness-105 transition-all"
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
            onPlus()
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
