import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useGame } from '../../context/GameContext.jsx'
import { HABITAT_CATALOG, HABITAT_IMAGES, isDogCompatibleWithHabitat } from '../../data/habitatCatalog.js'
import coinsImg from '../../assets/ui/coins.png'
import diamondsImg from '../../assets/ui/diamonds.png'
import iconAxe from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_axe.svg'
import iconHeart from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_heart.svg'
import LoadingProgressBar from '../common/LoadingProgressBar.jsx'
import underConstructionImg from '../../assets/ui/UnderConstruction.png'
import collectPlaceHolder from '../../assets/ui/CollectPlaceHolder.png'
import dogfoodImg from '../../assets/ui/dogfood.png'
import { getDogStageInfo } from '../../utils/dogEvolution.js'

import bulldogPortrait from '../../assets/dogs/BulldogPortrait.png'
import bulldogSitImg from '../../assets/dogs/BulldogSit.png'
import bulldogWalkPng from '../../assets/dogs/BulldogPuppyWalkingCycle.png'

/* ─────────────────────────────────────────────
   Grid & Isometric Math
   Virtual world coordinate space: 2000 x 1125
   Maximized across the ENTIRE map:
   26 columns x 24 rows = 624 tiles covering
   the vast expanse of the floating island!
───────────────────────────────────────────── */
export const GRID_COLS = 26
export const GRID_ROWS = 24
export const TILE_W = 76
export const TILE_H = 38
export const ORIGIN_X = 1000
export const ORIGIN_Y = 110

/** Convert grid cell (c, r) to isometric pixel center */
export function gridToIso(c, r) {
  const x = ORIGIN_X + (c - r) * (TILE_W / 2)
  const y = ORIGIN_Y + (c + r) * (TILE_H / 2)
  return { x, y }
}

/** Convert isometric screen coordinates back to nearest grid cell (c, r) */
export function isoToGrid(x, y) {
  const dx = x - ORIGIN_X
  const dy = y - ORIGIN_Y
  const c = Math.round((dy / (TILE_H / 2) + dx / (TILE_W / 2)) / 2)
  const r = Math.round((dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2)
  return { c, r }
}

/** Check if tile is within valid buildable island land (maximizing entire territory) */
export function isTileBuildable(c, r) {
  if (c < 0 || c >= GRID_COLS || r < 0 || r >= GRID_ROWS) return false
  // Trim only the extreme sky/ocean apex tips to respect the natural island contour
  if (c + r <= 2) return false
  if (c + r >= 46) return false
  if (r - c >= 21) return false
  if (c - r >= 23) return false
  return true
}

/**
 * Returns the exact 4 boundary corners and center for a w x h footprint
 * on the isometric grid. Guarantees 100% flat placement on the ground.
 */
export function getHabitatCorners(col, row, w = 3, h = 3) {
  // Top apex of tile (col, row)
  const pTop = {
    x: ORIGIN_X + (col - row) * (TILE_W / 2),
    y: ORIGIN_Y + (col + row) * (TILE_H / 2) - TILE_H / 2,
  }
  // Right apex of tile (col + w - 1, row)
  const pRight = {
    x: ORIGIN_X + (col + w - row) * (TILE_W / 2),
    y: ORIGIN_Y + (col + w + row - 1) * (TILE_H / 2),
  }
  // Bottom apex of tile (col + w - 1, row + h - 1)
  const pBottom = {
    x: ORIGIN_X + (col - row + w - h) * (TILE_W / 2),
    y: ORIGIN_Y + (col + w + row + h - 2) * (TILE_H / 2) + TILE_H / 2,
  }
  // Left apex of tile (col, row + h - 1)
  const pLeft = {
    x: ORIGIN_X + (col - row - h) * (TILE_W / 2),
    y: ORIGIN_Y + (col + row + h - 1) * (TILE_H / 2),
  }
  const center = {
    x: (pTop.x + pBottom.x) / 2,
    y: (pTop.y + pBottom.y) / 2,
  }
  return { pTop, pRight, pBottom, pLeft, center }
}

export default function WorldGrid({
  placingItem,
  placingDog,
  selectedHabitatId,
  onConfirmPlace,
  onCancelPlace,
  onSelectHabitat,
  onStartMove,
  onPlaceDogSuccess,
}) {
  const { state, dispatch } = useGame()
  const { placedHabitats = [], gridVisible = false } = state

  // Isometrically sort habitats from back to front:
  // Smaller (col + row) = further back (rendered first in SVG)
  // Larger (col + row) = closer to camera (rendered on top)
  const sortedHabitats = useMemo(() => {
    return [...placedHabitats].sort((a, b) => {
      const aW = a.size?.w || 3
      const aH = a.size?.h || 3
      const bW = b.size?.w || 3
      const bH = b.size?.h || 3
      const depthA = (Number(a.col) || 0) + (Number(a.row) || 0) + (aW + aH) * 0.5
      const depthB = (Number(b.col) || 0) + (Number(b.row) || 0) + (bW + bH) * 0.5
      return depthA - depthB
    })
  }, [placedHabitats])

  // Ghost building position in placement mode (snapped to col, row)
  const [ghostPos, setGhostPos] = useState({ col: 11, row: 9 })
  const [isDraggingGhost, setIsDraggingGhost] = useState(false)
  const [collectBurst, setCollectBurst] = useState(null) // { id, amount, x, y }
  const [now, setNow] = useState(Date.now())

  // Real-time 1s tick for 30s construction timer
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Sync ghost position if placing a new item or moving
  React.useEffect(() => {
    if (placingItem) {
      setGhostPos({
        col: placingItem.col ?? 11,
        row: placingItem.row ?? 9,
      })
      if (placingItem.autoDrag) {
        setIsDraggingGhost(true)
      }
    } else {
      setIsDraggingGhost(false)
    }
  }, [placingItem])

  // Always guarantee ghostSize has valid numeric .w and .h
  const ghostSize = useMemo(() => {
    if (placingItem?.size && typeof placingItem.size === 'object' && placingItem.size.w && placingItem.size.h) {
      return placingItem.size
    }
    const cat = HABITAT_CATALOG.find((h) => h.id === placingItem?.id)
    if (cat?.size) return cat.size
    return { w: 3, h: 3 }
  }, [placingItem])

  // Check if current ghost placement footprint is valid
  const isFootprintValid = useMemo(() => {
    if (!placingItem) return false
    const { col, row } = ghostPos
    const { w, h } = ghostSize

    for (let c = col; c < col + w; c++) {
      for (let r = row; r < row + h; r++) {
        if (!isTileBuildable(c, r)) return false
        // Collision check with already placed habitats (except moving item)
        const collision = placedHabitats.find((hab) => {
          if (placingItem.movingId && hab.id === placingItem.movingId) return false
          const hw = hab.size?.w || 3
          const hh = hab.size?.h || 3
          return c >= hab.col && c < hab.col + hw && r >= hab.row && r < hab.row + hh
        })
        if (collision) return false
      }
    }
    return true
  }, [placingItem, ghostPos, ghostSize, placedHabitats])

  // Snap ghost to isometric grid coordinates from pointer client pos
  const snapGhostToClient = (clientX, clientY, svgEl) => {
    if (!svgEl) return
    const rect = svgEl.getBoundingClientRect()
    if (!rect || rect.width <= 0 || rect.height <= 0) return
    const scaleX = 2000 / rect.width
    const scaleY = 1125 / rect.height
    const svgX = (clientX - rect.left) * scaleX
    const svgY = (clientY - rect.top) * scaleY

    const { c, r } = isoToGrid(svgX, svgY)
    if (isNaN(c) || isNaN(r)) return
    const gw = Number(ghostSize?.w) || 3
    const gh = Number(ghostSize?.h) || 3
    const maxCol = Math.max(0, GRID_COLS - gw)
    const maxRow = Math.max(0, GRID_ROWS - gh)
    const targetC = Math.round(c - Math.floor(gw / 2))
    const targetR = Math.round(r - Math.floor(gh / 2))
    // Safeguard: ignore out of bounds pointer triggers from modals
    if (targetC < -2 || targetR < -2 || targetC > maxCol + 2 || targetR > maxRow + 2) return
    const clampedC = Math.max(0, Math.min(maxCol, targetC))
    const clampedR = Math.max(0, Math.min(maxRow, targetR))
    setGhostPos({ col: clampedC, row: clampedR })
  }

  // Handle clicking or tapping on a tile to move the ghost building
  const handleTileClick = (c, r) => {
    if (!placingItem) return
    const gw = Number(ghostSize?.w) || 3
    const gh = Number(ghostSize?.h) || 3
    const maxCol = Math.max(0, GRID_COLS - gw)
    const maxRow = Math.max(0, GRID_ROWS - gh)
    const targetC = Math.round(c - Math.floor(gw / 2))
    const targetR = Math.round(r - Math.floor(gh / 2))
    const clampedC = Math.max(0, Math.min(maxCol, isNaN(targetC) ? 11 : targetC))
    const clampedR = Math.max(0, Math.min(maxRow, isNaN(targetR) ? 9 : targetR))
    setGhostPos({ col: clampedC, row: clampedR })
  }

  // Handle pointer drag on ghost building
  const handleGhostPointerDown = (e) => {
    e.stopPropagation()
    setIsDraggingGhost(true)
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch (_) {}
  }

  const handleGhostPointerMove = (e) => {
    if (!isDraggingGhost || !placingItem) return
    snapGhostToClient(e.clientX, e.clientY, e.currentTarget.closest('svg'))
  }

  const handleGhostPointerUp = (e) => {
    setIsDraggingGhost(false)
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch (_) {}
  }

  // SVG-level listeners so dragging anywhere across the whole map is buttery smooth
  const handleSvgPointerMove = (e) => {
    if (!isDraggingGhost || !placingItem) return
    snapGhostToClient(e.clientX, e.clientY, e.currentTarget)
  }

  const handleSvgPointerUp = () => {
    if (isDraggingGhost) {
      setIsDraggingGhost(false)
    }
  }

  // Coin collection action with visual pop
  const handleCollectCoins = (e, hab) => {
    e.stopPropagation()
    if (!hab.coinsAccumulated || hab.coinsAccumulated <= 0) return

    const corners = getHabitatCorners(hab.col, hab.row, hab.size?.w || 3, hab.size?.h || 3)
    setCollectBurst({ id: hab.id, amount: hab.coinsAccumulated, type: 'coins', x: corners.center.x, y: corners.pTop.y - 30 })

    dispatch({
      type: 'COLLECT_HABITAT_COINS',
      payload: { id: hab.id },
    })

    setTimeout(() => setCollectBurst(null), 1200)
  }

  // Dogfood collection action with visual pop
  const handleCollectDogfood = (e, hab) => {
    if (e && e.stopPropagation) e.stopPropagation()
    const amount = hab.dogfoodAccumulated || 0
    if (amount <= 0) return

    const corners = getHabitatCorners(hab.col, hab.row, hab.size?.w || 3, hab.size?.h || 3)
    setCollectBurst({ id: hab.id, amount, type: 'dogfood', x: corners.center.x, y: corners.pTop.y - 30 })

    dispatch({
      type: 'COLLECT_DOGFOOD',
      payload: { id: hab.id },
    })

    setTimeout(() => setCollectBurst(null), 1200)
  }

  // Center of ghost building for floating buttons
  const ghostCorners = useMemo(() => {
    return getHabitatCorners(ghostPos.col, ghostPos.row, ghostSize.w, ghostSize.h)
  }, [ghostPos, ghostSize])

  // Grid lines ("the linear") shown ONLY during moving / placement, or if manually toggled
  const showGridLines = Boolean(placingItem || gridVisible)

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <svg
        viewBox="0 0 2000 1125"
        className="w-full h-full absolute inset-0 overflow-visible"
        style={{ pointerEvents: 'auto' }}
        onPointerMove={handleSvgPointerMove}
        onPointerUp={handleSvgPointerUp}
      >
        <defs>
          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#22c55e" floodOpacity="0.8" />
          </filter>
          <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ef4444" floodOpacity="0.8" />
          </filter>
          <filter id="glow-white" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ffffff" floodOpacity="0.95" />
          </filter>
          <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#facc15" floodOpacity="0.9" />
          </filter>
          <filter id="shadow-3d" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="#000000" floodOpacity="0.5" />
          </filter>
          {/* Ethereal pure white glowing outline hugging the habitat building artwork itself */}
          <filter id="habitat-white-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffffff" floodOpacity="1" />
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffffff" floodOpacity="1" />
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.5" />
          </filter>
          {/* Pulsing neon green adoption glow for compatible habitats */}
          <filter id="habitat-adopt-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#22c55e" floodOpacity="1" />
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#86efac" floodOpacity="1" />
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.5" />
          </filter>
          <style>{`
            @keyframes habitat-adopt-blink {
              0% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 6px #22c55e); }
              100% { transform: translateY(-7px) scale(1.03); filter: drop-shadow(0 0 20px #4ade80); }
            }
            @keyframes bulldog-waddle {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              25% { transform: translateY(-0.8px) rotate(-1.2deg); }
              50% { transform: translateY(0px) rotate(0deg); }
              75% { transform: translateY(-0.8px) rotate(1.2deg); }
            }
            @keyframes bulldog-breathe {
              0%, 100% { transform: scale(1, 1); }
              50% { transform: scale(1.03, 0.975); }
            }
          `}</style>
        </defs>

        {/* ── 1. Land Position Grid Lines (Shown ONLY when placing / moving habitat) ── */}
        {showGridLines && (
          <g className="grid-layer transition-opacity duration-300">
            {Array.from({ length: GRID_COLS }).map((_, c) =>
              Array.from({ length: GRID_ROWS }).map((_, r) => {
                const buildable = isTileBuildable(c, r)
                if (!buildable && !placingItem) return null

                const { x, y } = gridToIso(c, r)
                const points = `
                  ${x},${y - TILE_H / 2}
                  ${x + TILE_W / 2},${y}
                  ${x},${y + TILE_H / 2}
                  ${x - TILE_W / 2},${y}
                `
                return (
                  <polygon
                    key={`tile-${c}-${r}`}
                    points={points}
                    fill={buildable ? 'rgba(254, 243, 199, 0.035)' : 'rgba(0, 0, 0, 0.15)'}
                    stroke={
                      buildable
                        ? placingItem
                          ? 'rgba(255, 255, 255, 0.4)'
                          : 'rgba(251, 191, 36, 0.25)'
                        : 'rgba(120, 53, 15, 0.1)'
                    }
                    strokeWidth={placingItem && buildable ? '1.2' : '0.8'}
                    strokeDasharray={buildable ? '2,3' : 'none'}
                    className="cursor-pointer hover:fill-amber-300/25 transition-colors"
                    onClick={() => handleTileClick(c, r)}
                  />
                )
              })
            )}
          </g>
        )}

        {/* ── 2. Placed Habitats (Isometrically Depth-Sorted: Back to Front) ── */}
        <g className="placed-habitats-layer">
          {sortedHabitats.map((hab) => {
            // If this item is currently being moved, hide the static one
            if (placingItem?.movingId === hab.id) return null
            return (
              <PlacedHabitatItem
                key={hab.id}
                habitat={hab}
                isSelected={hab.id === selectedHabitatId}
                isPlacingMode={Boolean(placingItem)}
                placingDog={placingDog}
                now={now}
                onSelect={() => onSelectHabitat(hab)}
                onCollect={(e) => {
                  if (hab.habitatId === 'dogfood-factory' || hab.name === 'Dogfood Factory') {
                    handleCollectDogfood(e, hab)
                  } else {
                    handleCollectCoins(e, hab)
                  }
                }}
                onMove={() => onStartMove && onStartMove(hab)}
                onAdoptDog={() => {
                  if (placingDog.isTransfer) {
                    dispatch({
                      type: 'MOVE_DOG',
                      payload: {
                        dogId: placingDog.id,
                        targetHabitatId: hab.id,
                      },
                    })
                  } else {
                    dispatch({
                      type: 'BUY_DOG_FOR_HABITAT',
                      payload: { habitatId: hab.id, dog: placingDog },
                    })
                  }
                  onPlaceDogSuccess && onPlaceDogSuccess()
                }}
              />
            )
          })}
        </g>

        {/* ── 2b. Floating Habitat Overlays Layer (Collect Bubbles ALWAYS float cleanly on TOP of all buildings) ── */}
        <g className="floating-habitat-overlays-layer" style={{ pointerEvents: 'auto' }}>
          {sortedHabitats.map((hab) => {
            if (placingItem?.movingId === hab.id) return null

            // Dogfood Factory Collect Bubble
            const isDogfoodFactory = hab.habitatId === 'dogfood-factory' || hab.name === 'Dogfood Factory'
            if (isDogfoodFactory) {
              const foodAmount = hab.dogfoodAccumulated || 0
              if (foodAmount <= 0) return null
              const size = hab.size || { w: 3, h: 3 }
              const { pTop, center } = getHabitatCorners(hab.col, hab.row, size.w, size.h)
              return (
                <foreignObject
                  key={`bubble_dogfood_${hab.id}`}
                  x={center.x - 30}
                  y={pTop.y - 62}
                  width="60"
                  height="66"
                  className="overflow-visible"
                  data-hud="true"
                  data-no-drag="true"
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => handleCollectDogfood(e, hab)}
                >
                  <div
                    className="group relative flex items-center justify-center cursor-pointer transform hover:scale-115 active:scale-90 transition-all select-none"
                    style={{ animation: 'bounce 1.6s infinite ease-in-out' }}
                    title={`Collect ${foodAmount.toLocaleString()} Kibble!`}
                  >
                    <img
                      src={collectPlaceHolder}
                      alt="Collect Kibble"
                      className="w-14 h-14 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)] hover:brightness-110 active:scale-95 transition-all"
                    />
                    <div className="absolute top-[14%] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                      <img
                        src={dogfoodImg}
                        alt=""
                        className="w-7 h-7 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] group-hover:scale-115 transition-transform"
                      />
                    </div>
                  </div>
                </foreignObject>
              )
            }

            // Normal Habitat Coin Collect Bubble
            if (hab.type !== 'habitat' || !hab.readyToCollect || !Array.isArray(hab.dogs) || hab.dogs.length === 0) return null
            const size = hab.size || { w: 3, h: 3 }
            const { pTop, center } = getHabitatCorners(hab.col, hab.row, size.w, size.h)
            return (
              <foreignObject
                key={`bubble_${hab.id}`}
                x={center.x - 30}
                y={pTop.y - 62}
                width="60"
                height="66"
                className="overflow-visible"
                data-hud="true"
                data-no-drag="true"
                style={{ pointerEvents: 'auto' }}
                onClick={(e) => handleCollectCoins(e, hab)}
              >
                <div
                  className="group relative flex items-center justify-center cursor-pointer transform hover:scale-115 active:scale-90 transition-all select-none"
                  style={{ animation: 'bounce 1.6s infinite ease-in-out' }}
                  title={`Collect ${(hab.coinsAccumulated || 0).toLocaleString()} Paw Coins!`}
                >
                  <img
                    src={collectPlaceHolder}
                    alt="Collect Coins"
                    className="w-14 h-14 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)] hover:brightness-110 active:scale-95 transition-all"
                  />
                  <div className="absolute top-[12%] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
                    <ShinyGoldCoinsIcon className="w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] group-hover:scale-115 transition-transform" />
                  </div>
                </div>
              </foreignObject>
            )
          })}
        </g>

        {/* ── 3. Active Placement / Move Ghost ── */}
        {placingItem && (
          <>
            {/* Draggable Footprint & Ghost Image */}
            <g
              className="placement-ghost-group"
              onPointerDown={handleGhostPointerDown}
              onPointerMove={handleGhostPointerMove}
              onPointerUp={handleGhostPointerUp}
              style={{ cursor: isDraggingGhost ? 'grabbing' : 'grab' }}
            >
              {/* Footprint Grid Tiles (Green for valid, Red for invalid) */}
              {Array.from({ length: ghostSize.w }).map((_, dw) =>
                Array.from({ length: ghostSize.h }).map((_, dh) => {
                  const tc = ghostPos.col + dw
                  const tr = ghostPos.row + dh
                  const { x, y } = gridToIso(tc, tr)
                  const points = `
                    ${x},${y - TILE_H / 2}
                    ${x + TILE_W / 2},${y}
                    ${x},${y + TILE_H / 2}
                    ${x - TILE_W / 2},${y}
                  `
                  return (
                    <g key={`ghost-tile-${dw}-${dh}`}>
                      <polygon
                        points={points}
                        fill={isFootprintValid ? 'rgba(34, 197, 94, 0.52)' : 'rgba(239, 68, 68, 0.62)'}
                        stroke={isFootprintValid ? '#22c55e' : '#ef4444'}
                        strokeWidth="2.5"
                        filter={isFootprintValid ? 'url(#glow-green)' : 'url(#glow-red)'}
                      />
                      <text
                        x={x}
                        y={y + 5}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="14"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                      >
                        {isFootprintValid ? '✓' : '✕'}
                      </text>
                    </g>
                  )
                })
              )}

              {/* Flat Ghost Building Graphic Preview (Directly Draggable!) */}
              <g
                style={{ pointerEvents: 'auto', opacity: 0.95 }}
                onPointerDown={handleGhostPointerDown}
              >
                <HabitatGraphic
                  habitat={placingItem}
                  corners={ghostCorners}
                  size={ghostSize}
                  isGhost={true}
                  hideImage={true}
                />
              </g>
            </g>

            {/* ── Floating Action Buttons (Confirm ✓, Cancel ✕) ── */}
            {/* Positioned OUTSIDE ghost drag group with data-hud & data-no-drag */}
            <foreignObject
              x={ghostCorners.center.x - 70}
              y={ghostCorners.pTop.y - 85}
              width="140"
              height="70"
              className="overflow-visible"
              data-hud="true"
              data-no-drag="true"
              style={{ pointerEvents: 'auto', zIndex: 9999 }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-center gap-3 w-full h-full"
                data-hud="true"
                data-no-drag="true"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {/* Cancel / Undo Button (Red ✕) */}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onCancelPlace()
                  }}
                  title="Cancel Movement / Placement"
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-white shadow-2xl active:scale-90 hover:scale-105 transition-transform cursor-pointer"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #ef4444 0%, #b91c1c 70%, #7f1d1d 100%)',
                    border: '3px solid #ffffff',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.7)',
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Confirm Button (Green ✓) */}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (isFootprintValid) {
                      onConfirmPlace({
                        ...placingItem,
                        col: ghostPos.col,
                        row: ghostPos.row,
                      })
                    }
                  }}
                  disabled={!isFootprintValid}
                  title={isFootprintValid ? 'Confirm Placement Here' : 'Cannot place here (invalid footprint)'}
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-2xl active:scale-90 transition-all cursor-pointer ${
                    isFootprintValid ? 'opacity-100 hover:scale-105' : 'opacity-40 cursor-not-allowed grayscale'
                  }`}
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #4ade80 0%, #16a34a 70%, #14532d 100%)',
                    border: '3.5px solid #ffffff',
                    boxShadow: isFootprintValid
                      ? '0 6px 20px rgba(22, 163, 74, 0.8), inset 0 2px 6px rgba(255,255,255,0.7)'
                      : 'none',
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </div>
            </foreignObject>
          </>
        )}

        {/* ── 4. Floating Collection Pop ── */}
        {collectBurst && (
          <g
            transform={`translate(${collectBurst.x}, ${collectBurst.y})`}
            className="animate-bounce"
            style={{ pointerEvents: 'none' }}
          >
            <rect
              x="-66"
              y="-18"
              width="132"
              height="36"
              rx="18"
              fill="rgba(20, 10, 0, 0.9)"
              stroke={collectBurst.type === 'dogfood' ? '#f59e0b' : '#fbbf24'}
              strokeWidth="2.5"
            />
            <text
              x="0"
              y="6"
              textAnchor="middle"
              fill={collectBurst.type === 'dogfood' ? '#fef08a' : '#fde68a'}
              fontWeight="900"
              fontSize="14"
              style={{ textShadow: '0 2px 4px #000' }}
            >
              +{collectBurst.amount} {collectBurst.type === 'dogfood' ? 'Kibble' : ''}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Placed Habitat Item on Island
   - Uses the generated habitat PNG image
   - Sits 100% FLAT on the grid diamond
   - Real Animated Bulldog happily sitting on the island!
   - Shows glowing WHITE HOVER HIGHLIGHT on hover
   - Directly draggable to move anywhere across the island
   - Provides quick "🧭 Move" and "🏡 Info" buttons
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   Shiny 3D Gold Coins Stack for Collect Bubble
───────────────────────────────────────────── */
function ShinyGoldCoinsIcon({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="coinGrad1" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FDE047" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <radialGradient id="coinGrad2" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
        <filter id="coinShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#3B1404" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Back Base Coin Left */}
      <g filter="url(#coinShadow)">
        <ellipse cx="16" cy="33" rx="10" ry="6" fill="#78350F" />
        <ellipse cx="16" cy="31" rx="10" ry="5.5" fill="url(#coinGrad2)" stroke="#451A03" strokeWidth="1" />
        <ellipse cx="16" cy="31" rx="7.5" ry="3.8" fill="none" stroke="#FEF3C7" strokeWidth="0.8" opacity="0.8" />
        <circle cx="16" cy="31" r="2" fill="#B45309" opacity="0.6" />
      </g>

      {/* Back Base Coin Right */}
      <g filter="url(#coinShadow)">
        <ellipse cx="32" cy="33" rx="10" ry="6" fill="#78350F" />
        <ellipse cx="32" cy="31" rx="10" ry="5.5" fill="url(#coinGrad2)" stroke="#451A03" strokeWidth="1" />
        <ellipse cx="32" cy="31" rx="7.5" ry="3.8" fill="none" stroke="#FEF3C7" strokeWidth="0.8" opacity="0.8" />
        <circle cx="32" cy="31" r="2" fill="#B45309" opacity="0.6" />
      </g>

      {/* Front Stacked Center Gold Coin */}
      <g filter="url(#coinShadow)">
        <ellipse cx="24" cy="22" rx="11.5" ry="7" fill="#78350F" />
        <ellipse cx="24" cy="20" rx="11.5" ry="6.5" fill="url(#coinGrad1)" stroke="#451A03" strokeWidth="1.2" />
        <ellipse cx="24" cy="20" rx="8.5" ry="4.2" fill="none" stroke="#FFFBEB" strokeWidth="1.2" opacity="0.95" />
        {/* Embossed Paw Print on Coin */}
        <ellipse cx="24" cy="21" rx="2.4" ry="1.6" fill="#78350F" opacity="0.75" />
        <circle cx="21.6" cy="18.5" r="0.9" fill="#78350F" opacity="0.75" />
        <circle cx="23.2" cy="17.8" r="0.9" fill="#78350F" opacity="0.75" />
        <circle cx="24.8" cy="17.8" r="0.9" fill="#78350F" opacity="0.75" />
        <circle cx="26.4" cy="18.5" r="0.9" fill="#78350F" opacity="0.75" />
      </g>

      {/* Sparkling Star Gleam */}
      <path
        d="M 37 8 L 38.5 12 L 42.5 13.5 L 38.5 15 L 37 19 L 35.5 15 L 31.5 13.5 L 35.5 12 Z"
        fill="#FFFFFF"
        filter="drop-shadow(0 0 2px #FEF08A)"
      />
      <circle cx="10" cy="20" r="1.5" fill="#FFFFFF" opacity="0.95" />
    </svg>
  )
}

function PlacedHabitatItem({
  habitat,
  isSelected,
  isPlacingMode = false,
  placingDog,
  now,
  onSelect,
  onCollect,
  onMove,
  onAdoptDog,
}) {
  const { dispatch } = useGame()
  const [isHovered, setIsHovered] = useState(false)
  const size = habitat.size || { w: 3, h: 3 }
  const corners = getHabitatCorners(habitat.col, habitat.row, size.w, size.h)
  const { pTop, pRight, pBottom, pLeft, center } = corners
  const catalogEntry = HABITAT_CATALOG.find((h) => h.id === habitat.habitatId) || {}

  // Construction state (30 seconds construction timer)
  const isUnderConstruction = Boolean(
    habitat.underConstruction && (habitat.constructionEndsAt || 0) > 0
  )
  const remainingSeconds = isUnderConstruction
    ? Math.max(0, Math.ceil(((habitat.constructionEndsAt || 0) - now) / 1000))
    : 0
  const isConstructionFinished = isUnderConstruction && remainingSeconds === 0

  // Adoption eligibility & blinking pulse when adopting dogs or moving/transferring dogs
  const isCompatible = placingDog ? isDogCompatibleWithHabitat(placingDog, habitat) : false
  const isCurrentHabitat = Boolean(placingDog?.isTransfer && habitat.id === placingDog.sourceHabitatId)
  const hasSpace = (habitat.dogs?.length || 0) < 4
  const isAvailable = !isUnderConstruction && hasSpace && !isCurrentHabitat
  const isBlinking = Boolean(placingDog && isCompatible && isAvailable)

  // Direct Drag-To-Move tracking
  const dragStartRef = useRef(null)
  const hasDraggedRef = useRef(false)

  const handlePointerDown = (e) => {
    // Ignore clicks on HUD buttons or coin collect
    if (e.target.closest('button') || e.target.closest('[data-hud]')) return

    e.stopPropagation()
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    hasDraggedRef.current = false
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch (_) {}
  }

  const handlePointerMove = (e) => {
    if (!dragStartRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    const dist = Math.hypot(dx, dy)

    if (dist > 6 && !hasDraggedRef.current) {
      // Threshold exceeded -> Immediately engage interactive DRAG MOVE mode!
      hasDraggedRef.current = true
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId)
      } catch (_) {}
      dragStartRef.current = null
      onMove && onMove({ startDragging: true, clientX: e.clientX, clientY: e.clientY })
    }
  }

  const handlePointerUp = (e) => {
    if (!dragStartRef.current) return
    const wasDragged = hasDraggedRef.current
    dragStartRef.current = null
    hasDraggedRef.current = false
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch (_) {}

    // Only handle if it was a stationary click/tap
    if (!wasDragged) {
      if (placingDog) {
        if (isCurrentHabitat) {
          alert(`${placingDog.name} is already living in this habitat! Tap another blinking habitat to move it.`)
          return
        }
        if (isUnderConstruction) {
          alert(`${habitat.name} is currently under construction! Please wait for it to finish.`)
          return
        }
        if (!isCompatible) {
          alert(`Incompatible! ${placingDog.name} can only live in ${placingDog.habitatName || 'compatible habitats'}.`)
          return
        }
        if (!hasSpace) {
          alert(`${habitat.name} is full! (Max 4 dogs allowed per habitat).`)
          return
        }
        onAdoptDog && onAdoptDog()
        return
      }

      if (isConstructionFinished) {
        dispatch({ type: 'COMPLETE_CONSTRUCTION', payload: { id: habitat.id } })
        return
      }

      onSelect()
    }
  }

  return (
    <g
      className="placed-item-group select-none"
      style={{ cursor: isBlinking ? 'pointer' : isHovered ? 'grab' : 'pointer' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false)
        if (!hasDraggedRef.current) {
          dragStartRef.current = null
        }
      }}
    >
      {/* 1. Flat Base & 3D Generated Habitat Artwork + Real Dogs */}
      <HabitatGraphic
        habitat={{ ...catalogEntry, ...habitat }}
        corners={corners}
        size={size}
        isHovered={isHovered}
        isBlinking={isBlinking}
        isSelected={isSelected}
        isDimmed={isPlacingMode}
      />

      {/* 2. Pulsing Adoption Indicator when placing dog */}
      {isBlinking && (
        <foreignObject
          x={center.x - 75}
          y={pTop.y - 70}
          width="150"
          height="60"
          className="overflow-visible"
          data-hud="true"
          data-no-drag="true"
          style={{ pointerEvents: 'auto', zIndex: 9999 }}
          onClick={(e) => {
            e.stopPropagation()
            onAdoptDog && onAdoptDog()
          }}
        >
          <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform animate-bounce">
            <div
              className="px-3 py-1 rounded-full font-black text-[11px] text-white uppercase tracking-wider shadow-2xl flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(180deg, #10b981 0%, #047857 100%)',
                border: '2px solid #a7f3d0',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.7), inset 0 1px 2px rgba(255,255,255,0.7)',
              }}
            >
              <img src={iconHeart} alt="" className="w-3.5 h-3.5 object-contain" />
              <span>PLACE HERE</span>
            </div>
            <span className="text-[10px] font-black text-emerald-200 drop-shadow mt-0.5">
              {(habitat.dogs?.length || 0)} / 4 Dogs
            </span>
            <div className="w-2.5 h-2.5 rotate-45 -mt-1 bg-emerald-600 border-r-2 border-b-2 border-emerald-300" />
          </div>
        </foreignObject>
      )}

      {/* 3. Construction Timer Widget (Authentic Splashscreen LoadingProgressBar) */}
      {!placingDog && isUnderConstruction && remainingSeconds > 0 && (
        <foreignObject
          x={center.x - 90}
          y={pTop.y - 75}
          width="180"
          height="65"
          className="overflow-visible"
          data-hud="true"
          data-no-drag="true"
          style={{ pointerEvents: 'auto', zIndex: 9999 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            className="flex flex-col items-center w-full select-none"
            style={{ filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.75))' }}
          >
            {/* Top Row: Timer Pill & Speed Up Button */}
            <div className="flex items-center justify-between w-full px-1 mb-1">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-400/80 shadow-md">
                <img src={iconAxe} alt="" className="w-3.5 h-3.5 object-contain drop-shadow" />
                <span
                  className="font-black text-[11px] text-amber-200 tracking-wide leading-none"
                  style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                >
                  {remainingSeconds}s
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch({ type: 'COMPLETE_CONSTRUCTION', payload: { id: habitat.id } })
                }}
                className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 active:scale-95 text-amber-950 border border-amber-200 font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1 cursor-pointer transition-transform"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                title="Speed up construction"
              >
                <img src={diamondsImg} alt="" className="w-2.5 h-2.5 object-contain" />
                <span>SPEED UP</span>
              </button>
            </div>

            {/* Bottom Row: Splashscreen Authentic LoadingProgressBar */}
            <div className="w-full">
              <LoadingProgressBar
                progress={Math.min(100, Math.max(0, Math.round(((30 - remainingSeconds) / 30) * 100)))}
              />
            </div>
          </div>
        </foreignObject>
      )}

      {/* 4. Construction Finished Button */}
      {!placingDog && isConstructionFinished && (
        <foreignObject
          x={center.x - 70}
          y={pTop.y - 65}
          width="140"
          height="45"
          className="overflow-visible"
          data-hud="true"
          data-no-drag="true"
          style={{ pointerEvents: 'auto', zIndex: 9999 }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              dispatch({ type: 'COMPLETE_CONSTRUCTION', payload: { id: habitat.id } })
            }}
            className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-2xl border-2 border-emerald-200 flex items-center justify-center gap-1.5 animate-bounce active:scale-95 transition-transform cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>COMPLETE!</span>
          </button>
        </foreignObject>
      )}
    </g>
  )
}

/* ─────────────────────────────────────────────
   HabitatGraphic: Uses Image-Generated Habitats
   - Ground diamond lies 100% FLAT on the grid
   - Generated transparent PNG island anchors directly onto the footprint
   - Shows glorious WHITE HOVER GLOW directly on the habitat building artwork itself
───────────────────────────────────────────── */
function HabitatGraphic({
  habitat,
  corners,
  size = { w: 3, h: 3 },
  isGhost = false,
  isHovered = false,
  isBlinking = false,
  isSelected = false,
  hideImage = false,
  isDimmed = false,
}) {
  const { pTop, pRight, pBottom, pLeft, center } = corners
  const basePoints = `${pTop.x},${pTop.y} ${pRight.x},${pRight.y} ${pBottom.x},${pBottom.y} ${pLeft.x},${pLeft.y}`

  const isUnderConstruction = !isGhost && Boolean(habitat.underConstruction)

  // Check if this habitat has an image-generated graphic or uses UnderConstruction asset
  const habitatId = habitat.habitatId || habitat.id
  const habitatImg = isUnderConstruction
    ? underConstructionImg
    : (habitat.image || HABITAT_IMAGES[habitatId])

  // Dimensions of the isometric footprint diamond
  const footprintW = pRight.x - pLeft.x // e.g. 3 * 76 = 228
  const footprintH = pBottom.y - pTop.y // e.g. 3 * 38 = 114

  // Scale the generated PNG island so it touches down on the flat base
  const imgW = footprintW * 1.08
  const imgH = imgW * 0.666 // Aspect ratio ~3:2 matching 612x408 PNGs
  const imgX = center.x - imgW / 2
  const imgY = pBottom.y - imgH * 0.90 // Anchors bottom of floating island directly to grid base

  return (
    <g className="transition-transform duration-200">
      {/* ── 1. FLAT GROUND DIAMOND BASE (Sits 100% flat on the grid tiles) ── */}
      <polygon
        points={basePoints}
        fill={
          isBlinking
            ? 'rgba(34, 197, 94, 0.45)'
            : isGhost
            ? 'rgba(251, 191, 36, 0.25)'
            : isDimmed
            ? 'rgba(30, 15, 5, 0.45)'
            : isSelected
            ? 'rgba(250, 204, 21, 0.32)'
            : isHovered
            ? 'rgba(255, 255, 255, 0.22)'
            : 'rgba(0, 0, 0, 0.22)'
        }
        stroke={
          isBlinking
            ? '#22c55e'
            : isGhost
            ? 'rgba(255, 255, 255, 0.5)'
            : isDimmed
            ? '#d97706'
            : isSelected
            ? '#facc15'
            : isHovered
            ? '#ffffff'
            : 'rgba(120, 53, 15, 0.4)'
        }
        strokeWidth={isBlinking ? '3.5' : isSelected ? '4' : isDimmed ? '2' : isHovered ? '2.5' : '2'}
        strokeDasharray={isDimmed ? '4,3' : undefined}
        filter={isBlinking ? 'url(#glow-green)' : isSelected ? 'url(#glow-gold)' : isHovered ? 'url(#glow-white)' : undefined}
      />

      {/* ── 2. IMAGE-GENERATED ISOMETRIC HABITAT ARTWORK WITH HOVER HIGHLIGHT ── */}
      {/* When moving an object or when hideImage is true, image disappears so the grid can be seen perfectly */}
      {habitatImg && !hideImage && (
        <image
          href={habitatImg}
          x={imgX}
          y={imgY}
          width={imgW}
          height={imgH}
          preserveAspectRatio="xMidYMid meet"
          filter={
            isGhost
              ? undefined
              : isBlinking
              ? 'url(#habitat-adopt-glow)'
              : isHovered
              ? 'url(#habitat-white-glow)'
              : 'url(#shadow-3d)'
          }
          style={{
            pointerEvents: 'auto',
            cursor: 'pointer',
            opacity: isDimmed ? 0.22 : 1,
            transition: 'opacity 0.2s ease, filter 0.18s ease-out, transform 0.18s ease-out',
            transform: isBlinking
              ? 'translateY(-6px)'
              : isHovered && !isGhost
              ? 'translateY(-6px)'
              : 'translateY(0)',
            animation: isBlinking ? 'habitat-adopt-blink 0.8s infinite alternate' : undefined,
          }}
        />
      )}

      {/* Fallback for facilities/decor without custom PNG */}
      {!habitatImg && !hideImage && (
        <g
          transform={`translate(${center.x}, ${center.y})`}
          style={{
            cursor: 'pointer',
            transition: 'transform 0.18s ease-out',
            transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
          }}
        >
          <ellipse
            cx="0"
            cy="0"
            rx="20"
            ry="10"
            fill="#38bdf8"
            stroke={isHovered ? '#ffffff' : '#334155'}
            strokeWidth={isHovered ? '3.5' : '2.5'}
            filter={isHovered ? 'url(#glow-white)' : undefined}
          />
          <text x="0" y="4" fontSize="10" fontWeight="900" fill="#ffffff" textAnchor="middle">
            HAB
          </text>
        </g>
      )}

      {/* ── 3. REAL ANIMATED DOGS WANDERING & SITTING ON ISLAND PATIO (Max 4 Dogs) ── */}
      {!isGhost && !isUnderConstruction && !isDimmed && habitat.dogs && habitat.dogs.length > 0 && (
        <g
          style={{
            pointerEvents: 'none',
            transition: 'transform 0.18s ease-out',
            transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
          }}
        >
          {habitat.dogs.slice(0, 4).map((dog, idx) => (
            <HabitatWanderingDog
              key={typeof dog === 'object' ? (dog.id || idx) : idx}
              center={center}
              dog={dog}
              dogIndex={idx}
              isHovered={isHovered}
            />
          ))}
        </g>
      )}
    </g>
  )
}

/* ─────────────────────────────────────────────
   Autonomous Wandering Bulldog
   - Live 60fps frame-by-frame isometric patio stroll
   - Natural ground-level walking without bouncing/jumping
   - Faces movement direction (left/right) with feet flat on the ground (no plane tilt!)
   - Arrives at destination, plays sit animation and rests peacefully
   - Repeats cycle indefinitely
───────────────────────────────────────────── */
const PATROL_WAYPOINTS = [
  { x: 0, y: 14 },     // Center patio
  { x: -32, y: 10 },   // Left patio
  { x: 32, y: 10 },    // Right patio
  { x: -18, y: 24 },   // Front-left
  { x: 18, y: 24 },    // Front-right
  { x: -14, y: 2 },    // Mid-left
  { x: 14, y: 2 },     // Mid-right
  { x: 0, y: 28 },     // Front-center apex
]

/* ─────────────────────────────────────────────
   Calibrated Dog Sprite Sizing (Sitting vs Walking)
   Calculated so the dog maintains the exact same visual height, body volume,
   and grounded paw level whether walking on all fours or sitting down!
───────────────────────────────────────────── */
const DOG_SPRITE_SIZES = {
  Puppy: {
    shadowRx: 12,
    shadowRy: 4,
    sit: { width: 42, height: 44, x: -21, y: -37 },
    walk: { width: 35, height: 31, x: -17, y: -30 },
  },
  Young: {
    shadowRx: 14,
    shadowRy: 4.5,
    sit: { width: 37, height: 39, x: -18, y: -37 },
    walk: { width: 48, height: 38, x: -24, y: -37 },
  },
  Adult: {
    shadowRx: 15,
    shadowRy: 5,
    sit: { width: 42, height: 44, x: -21, y: -41 },
    walk: { width: 47, height: 49, x: -23, y: -43 },
  },
}

function HabitatWanderingDog({ center, dog, dogIndex = 0, isHovered }) {
  const stageInfo = getDogStageInfo(dog)
  const spriteCfg = DOG_SPRITE_SIZES[stageInfo.stage] || DOG_SPRITE_SIZES.Adult
  const startPt = PATROL_WAYPOINTS[(dogIndex * 2) % PATROL_WAYPOINTS.length]
  const [pos, setPos] = useState({ x: startPt.x, y: startPt.y })
  const [mode, setMode] = useState('sitting') // 'walking' | 'sitting'
  const [flipH, setFlipH] = useState(false)

  const centerRef = useRef(center)
  centerRef.current = center

  const animRef = useRef({
    x: startPt.x,
    y: startPt.y,
    targetX: startPt.x,
    targetY: startPt.y,
    mode: 'sitting',
    flipH: false,
    sitStart: Date.now() + dogIndex * 1200,
    sitDuration: 4000 + dogIndex * 1000, // 4-7 seconds sitting rest
    lastTime: null,
    reqId: null,
  })

  useEffect(() => {
    let isRunning = true
    const speed = 22 // Calm, gentle stroll across the lawn (no rushing)

    const tick = (time) => {
      if (!isRunning) return
      const a = animRef.current

      if (!a.lastTime) a.lastTime = time
      const dt = Math.min((time - a.lastTime) / 1000, 0.1)
      a.lastTime = time

      const now = Date.now()

      if (a.mode === 'sitting') {
        const elapsed = now - a.sitStart

        // After complete resting period (5000ms), get up and walk to next waypoint!
        if (elapsed >= a.sitDuration) {
          const current = { x: a.x, y: a.y }
          const candidates = PATROL_WAYPOINTS.filter((pt) => {
            const d = Math.hypot(pt.x - current.x, pt.y - current.y)
            return d >= 26
          })
          const target =
            candidates.length > 0
              ? candidates[Math.floor(Math.random() * candidates.length)]
              : PATROL_WAYPOINTS[Math.floor(Math.random() * PATROL_WAYPOINTS.length)]

          a.targetX = target.x
          a.targetY = target.y
          a.mode = 'walking'

          const dx = a.targetX - a.x
          // Facing: Artwork naturally faces right. When dx < 0, mirror horizontally so head faces left.
          const nextFlip = dx < 0
          a.flipH = nextFlip

          setMode('walking')
          setFlipH(nextFlip)
        }
      } else if (a.mode === 'walking') {
        const dx = a.targetX - a.x
        const dy = a.targetY - a.y
        const dist = Math.hypot(dx, dy)

        if (dist <= 1.5) {
          // Arrived at destination! Settle down into SITTING pose on butt to rest for 5s
          a.x = a.targetX
          a.y = a.targetY
          a.mode = 'sitting'
          a.sitStart = Date.now()
          a.sitDuration = 5000

          setPos({ x: a.x, y: a.y })
          setMode('sitting')
        } else {
          // Smooth, steady stroll steps across the lawn
          const step = speed * dt
          const moveDist = Math.min(dist, step)
          a.x += (dx / dist) * moveDist
          a.y += (dy / dist) * moveDist

          const nextFlip = dx < 0
          a.flipH = nextFlip

          setPos({ x: a.x, y: a.y })
          setFlipH(nextFlip)
        }
      }

      a.reqId = requestAnimationFrame(tick)
    }

    animRef.current.reqId = requestAnimationFrame(tick)

    return () => {
      isRunning = false
      if (animRef.current.reqId) {
        cancelAnimationFrame(animRef.current.reqId)
      }
    }
  }, [])

  return (
    <g
      transform={`translate(${center.x + pos.x}, ${center.y + pos.y})`}
      style={{ pointerEvents: 'none' }}
    >
      {/* Ground contact shadow - stays firmly on grass */}
      <ellipse
        cx="0"
        cy="2"
        rx={spriteCfg.shadowRx}
        ry={spriteCfg.shadowRy}
        fill="rgba(0, 0, 0, 0.32)"
      />

      {/* Facing container: mirrors horizontally based on travel direction, stays flat on ground (no plane tilt) */}
      <g
        transform={`scale(${flipH ? -1 : 1}, 1)`}
      >
        {mode === 'walking' ? (
          /* Walking Pose: Calibrated to match Sitting size exactly (zero size jump) */
          <g style={{ animation: 'bulldog-waddle 0.42s infinite ease-in-out' }}>
            <image
              href={stageInfo.walkImg}
              x={spriteCfg.walk.x}
              y={spriteCfg.walk.y}
              width={spriteCfg.walk.width}
              height={spriteCfg.walk.height}
              preserveAspectRatio="xMidYMid meet"
              style={{
                filter: isHovered
                  ? 'drop-shadow(0 0 7px rgba(255,255,255,0.95)) drop-shadow(0 4px 6px rgba(0,0,0,0.65))'
                  : 'drop-shadow(0 4px 6px rgba(0,0,0,0.65))',
              }}
            />
          </g>
        ) : (
          /* Sitting Pose: Calibrated to match Walking size exactly */
          <g style={{ animation: 'bulldog-breathe 2.4s infinite ease-in-out', transformOrigin: '0px 0px' }}>
            <image
              href={stageInfo.sitImg}
              x={spriteCfg.sit.x}
              y={spriteCfg.sit.y}
              width={spriteCfg.sit.width}
              height={spriteCfg.sit.height}
              preserveAspectRatio="xMidYMid meet"
              style={{
                filter: isHovered
                  ? 'drop-shadow(0 0 7px rgba(255,255,255,0.95)) drop-shadow(0 4px 6px rgba(0,0,0,0.65))'
                  : 'drop-shadow(0 4px 6px rgba(0,0,0,0.65))',
              }}
            />
          </g>
        )}
      </g>

      {/* Floating Dog Name Tag on Hover */}
      {isHovered && (
        <text
          x="0"
          y="-48"
          textAnchor="middle"
          fill="#fef08a"
          fontSize="10"
          fontWeight="900"
          style={{ textShadow: '0 2px 4px #000', pointerEvents: 'none' }}
        >
          {typeof dog === 'object' ? dog.name : (dog || 'Pup')}
        </text>
      )}
    </g>
  )
}
