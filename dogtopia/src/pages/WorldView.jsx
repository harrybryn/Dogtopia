import React, { useEffect, useRef, useState, useCallback } from 'react'
import landSurface from '../assets/ui/LandSurface.webp'
import WorldHUD from '../components/world/WorldHUD.jsx'
import WorldGrid, { ORIGIN_X, ORIGIN_Y } from '../components/world/WorldGrid.jsx'
import HabitatInspectorModal from '../components/world/HabitatInspectorModal.jsx'
import { useGame } from '../context/GameContext.jsx'

/* ─────────────────────────────────────────────
   Camera constants
   Scale 1.0 = image exactly covers the viewport.
   The pan (x, y) is always clamped so edges
   never enter the viewport → no white gaps.
───────────────────────────────────────────── */
const MIN_SCALE = 1.0
const MAX_SCALE = 2.8
const DEFAULT_SCALE = 1.0

function clamp(val, min, max) {
  if (typeof val !== 'number' || isNaN(val)) return 0
  return Math.min(max, Math.max(min, val))
}

/** Returns pan bounds for a given container size + zoom level.
 *  At scale=1 the image exactly covers the viewport → maxPan is 0 in both axes.
 *  At scale>1 we can pan by half the extra pixels in each direction. */
function getPanLimits(W, H, scale) {
  // Overhang on each side
  const extraX = (W * scale - W) / 2
  const extraY = (H * scale - H) / 2
  return {
    maxX: Math.max(0, extraX),
    maxY: Math.max(0, extraY),
  }
}

/**
 * WorldView
 * Full-screen land surface with:
 *   - Mouse & touch drag → pan the world, strictly clamped so the image NEVER leaves the screen
 *   - Scroll wheel & pinch → smooth zoom between 1.0x and 2.8x
 *   - Dragon City isometric position grid for placing and building habitats
 *   - Fixed top & side Dragon City overlay with original names & TrioUIKit assets
 */
export default function WorldView({ navigate }) {
  const { state, dispatch } = useGame()
  const [entered, setEntered] = useState(false)
  const [cam, setCam] = useState({ x: 0, y: 0, scale: DEFAULT_SCALE })

  // Placement mode & Inspector states
  const [placingItem, setPlacingItem] = useState(null)
  const [placingDog, setPlacingDog] = useState(null)
  const [selectedHabitat, setSelectedHabitat] = useState(null)
  const [showInspectorModal, setShowInspectorModal] = useState(false)

  const containerRef = useRef(null)
  const dragRef = useRef(null)    // { pointerId, startX, startY, camX, camY }
  const pinchRef = useRef(null)

  // Fade-in effect on mount
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50)
    return () => clearTimeout(t)
  }, [])

  /* ════════════════════════════════════════════════════════
     Strict Camera Constrain
     Reads the LIVE container size every call so the clamp
     is always accurate — no stale-closure drift.
  ════════════════════════════════════════════════════════ */
  const constrainCam = useCallback((x, y, scale) => {
    const safeScale = typeof scale !== 'number' || isNaN(scale) ? DEFAULT_SCALE : clamp(scale, MIN_SCALE, MAX_SCALE)
    const el = containerRef.current
    const W = el?.offsetWidth || window.innerWidth || 1920
    const H = el?.offsetHeight || window.innerHeight || 1080

    const { maxX, maxY } = getPanLimits(W, H, safeScale)

    return {
      scale: safeScale,
      x: clamp(typeof x !== 'number' || isNaN(x) ? 0 : x, -maxX, maxX),
      y: clamp(typeof y !== 'number' || isNaN(y) ? 0 : y, -maxY, maxY),
    }
  }, [])

  // Window resize listener to keep camera constrained
  useEffect(() => {
    const handleResize = () => {
      setCam((prev) => constrainCam(prev.x, prev.y, prev.scale))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [constrainCam])

  /* ════════════════════════════════════════════════════════
     POINTER events (Desktop Drag & Touch Pan)
     Uses pointer capture for rock-solid tracking even outside window
  ════════════════════════════════════════════════════════ */
  const onPointerDown = (e) => {
    // When placing a habitat or choosing habitat for a dog, don't drag camera
    if (placingItem || placingDog) {
      return
    }

    // Ignore HUD clicks, buttons, modals, or placement drag group
    if (
      e.target.closest('[data-hud]') ||
      e.target.closest('[data-no-drag]') ||
      e.target.closest('button') ||
      e.target.closest('.placement-ghost-group') ||
      e.target.closest('.placed-item-group')
    ) {
      return
    }

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      camX: cam.x,
      camY: cam.y,
    }

    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch (_) {}
  }

  const onPointerMove = (e) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY

    setCam((prev) =>
      constrainCam(dragRef.current.camX + dx, dragRef.current.camY + dy, prev.scale)
    )
  }

  const onPointerUp = (e) => {
    if (dragRef.current) {
      const dx = Math.abs(e.clientX - dragRef.current.startX)
      const dy = Math.abs(e.clientY - dragRef.current.startY)
      try {
        if (e.currentTarget.hasPointerCapture?.(dragRef.current.pointerId)) {
          e.currentTarget.releasePointerCapture(dragRef.current.pointerId)
        }
      } catch (_) {}
      dragRef.current = null

      // Deselect habitat when clicking empty ground without dragging
      if (dx < 6 && dy < 6) {
        if (!e.target.closest('[data-hud]') && !e.target.closest('.placed-item-group')) {
          setSelectedHabitat(null)
          setShowInspectorModal(false)
        }
      }
    }
  }

  /* ════════════════════════════════════════════════════════
     SCROLL WHEEL Zoom (Desktop)
  ════════════════════════════════════════════════════════ */
  const onWheel = useCallback((e) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.12 : 0.88
    setCam((prev) => {
      const nextScale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE)
      return constrainCam(prev.x, prev.y, nextScale)
    })
  }, [constrainCam])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  /* ════════════════════════════════════════════════════════
     TOUCH PINCH Zoom (Mobile)
  ════════════════════════════════════════════════════════ */
  const pinchDist = (t0, t1) =>
    Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      dragRef.current = null
      pinchRef.current = {
        dist: pinchDist(e.touches[0], e.touches[1]),
        scale: cam.scale,
      }
    }
  }

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinchRef.current) {
      e.preventDefault()
      const newDist = pinchDist(e.touches[0], e.touches[1])
      const factor = newDist / pinchRef.current.dist
      const nextScale = clamp(pinchRef.current.scale * factor, MIN_SCALE, MAX_SCALE)
      setCam((prev) => constrainCam(prev.x, prev.y, nextScale))
    }
  }

  const onTouchEnd = (e) => {
    if (e.touches.length < 2) pinchRef.current = null
  }

  /* ════════════════════════════════════════════════════════
     Zoom HUD Helpers
  ════════════════════════════════════════════════════════ */
  const zoomIn = () =>
    setCam((prev) => constrainCam(prev.x, prev.y, clamp(prev.scale * 1.25, MIN_SCALE, MAX_SCALE)))

  const zoomOut = () =>
    setCam((prev) => constrainCam(prev.x, prev.y, clamp(prev.scale / 1.25, MIN_SCALE, MAX_SCALE)))

  const resetCam = () => setCam(constrainCam(0, 0, DEFAULT_SCALE))

  /* ════════════════════════════════════════════════════════
     Dragon City Habitat Placement Actions
  ════════════════════════════════════════════════════════ */
  const handleStartPlacing = (catalogItem) => {
    setPlacingDog(null)
    setPlacingItem({
      ...catalogItem,
      col: 11,
      row: 9,
    })
  }

  const handleStartPlacingDog = (dog) => {
    setPlacingItem(null)
    setSelectedHabitat(null)
    setPlacingDog(dog)
  }

  const handleConfirmPlace = (placedData) => {
    if (placedData.movingId) {
      // Repositioning an existing habitat
      dispatch({
        type: 'MOVE_HABITAT',
        payload: {
          id: placedData.movingId,
          col: placedData.col,
          row: placedData.row,
        },
      })
    } else {
      // Building a brand new habitat from store
      dispatch({
        type: 'PLACE_HABITAT',
        payload: { habitat: placedData },
      })
    }
    setPlacingItem(null)
  }

  const handleCancelPlace = () => {
    dragRef.current = null
    setPlacingItem(null)
  }

  const handleSelectHabitat = (habitat) => {
    if (!placingItem) {
      dragRef.current = null
      setSelectedHabitat(habitat)
    }
  }

  const handleMoveHabitat = (habitat, dragOptions) => {
    dragRef.current = null
    setSelectedHabitat(null)
    setShowInspectorModal(false)
    setPlacingItem({
      ...habitat,
      movingId: habitat.id,
      col: habitat.col,
      row: habitat.row,
      autoDrag: Boolean(dragOptions?.startDragging),
      initialClientX: dragOptions?.clientX,
      initialClientY: dragOptions?.clientY,
    })
  }

  // Handle immediate dog transfer or move if instructed from Habitat Care view
  useEffect(() => {
    try {
      const transferDogStr = sessionStorage.getItem('dogtopia_transfer_dog')
      if (transferDogStr) {
        sessionStorage.removeItem('dogtopia_transfer_dog')
        const dogData = JSON.parse(transferDogStr)
        if (dogData && dogData.id) {
          setPlacingItem(null)
          setSelectedHabitat(null)
          setPlacingDog(dogData)
          return
        }
      }

      const moveHabId = sessionStorage.getItem('dogtopia_move_habitat')
      if (moveHabId) {
        sessionStorage.removeItem('dogtopia_move_habitat')
        const target = state.placedHabitats?.find((h) => h.id === moveHabId)
        if (target) {
          handleMoveHabitat(target)
        }
      }
    } catch (_) {}
  }, [state.placedHabitats])

  return (
    <div
      className="fixed inset-0 z-10 overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse 90% 80% at 50% 50%, #2e1206 0%, #160702 100%)',
      }}
    >
      {/* ── Draggable / Zoomable World Layer ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ cursor: dragRef.current ? 'grabbing' : 'grab', touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onLostPointerCapture={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/*
          Inner World Canvas
          ─────────────────────────────────────────────────────────────
          Key fix for white-flash glitch:
          • The div fills the FULL container (position absolute inset-0).
          • Transform is: translate(cam.x, cam.y) scale(cam.scale).
          • transformOrigin = "center center" so scale grows outward from centre.
          • At scale=1 the div already covers 100% × 100% → no edges ever show.
          • At scale>1 the constrain function limits pan to half the extra pixels.
          • NO virtual canvas / NO baseScale multiplication needed.
          ─────────────────────────────────────────────────────────────
        */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'center center',
            transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
            willChange: 'transform',
            // Suppress transition while actively dragging to prevent lag-rubber-band
            transition: dragRef.current ? 'none' : 'transform 0.08s ease-out',
          }}
        >
          {/* Background Land Surface Image — covers the whole inner div */}
          <img
            src={landSurface}
            alt="PupPal Land Surface"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            draggable={false}
          />

          {/* Vignette & Atmospheric Depth Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 85% 65% at 50% 50%, transparent 45%, rgba(0,0,0,0.25) 100%),
                linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 15%, transparent 80%, rgba(0,0,0,0.35) 100%)
              `,
            }}
          />

          {/* ── Dragon City Position Grid & Habitats Layer ── */}
          <WorldGrid
            placingItem={placingItem}
            placingDog={placingDog}
            selectedHabitatId={selectedHabitat?.id}
            onConfirmPlace={handleConfirmPlace}
            onCancelPlace={handleCancelPlace}
            onSelectHabitat={handleSelectHabitat}
            onStartMove={handleMoveHabitat}
            onPlaceDogSuccess={() => setPlacingDog(null)}
          />
        </div>
      </div>

      {/* ── Active Dog Adoption or Transfer Placement Banner ── */}
      {placingDog && (
        <div
          data-hud
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-amber-300"
          style={{
            background: 'linear-gradient(180deg, #3d1706 0%, #1a0802 100%)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.85), inset 0 1px 2px rgba(255,255,255,0.4)',
          }}
        >
          <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center flex-shrink-0">
            <img
              src={placingDog.image || placingDog.imageIcon}
              alt={placingDog.name}
              className="w-7 h-7 object-contain drop-shadow"
            />
          </div>
          <div className="flex flex-col">
            <span
              className="font-black text-xs sm:text-sm text-amber-200 uppercase tracking-wide"
              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
            >
              {placingDog.isTransfer ? `Transfer ${placingDog.name} to Habitat` : `Choose Home for ${placingDog.name}`}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-300/90 font-bold">
              {placingDog.isTransfer
                ? 'Tap any blinking compatible habitat to transfer this dog!'
                : 'Tap any blinking compatible habitat (Max 4 dogs per habitat)'}
            </span>
          </div>
          <button
            onClick={() => setPlacingDog(null)}
            className="ml-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:brightness-110 text-white font-black text-[10px] sm:text-xs uppercase cursor-pointer border border-red-300 shadow active:scale-95 transition-transform"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ── Dragon City UI Overlay (Always Fixed) ── */}
      <div data-hud>
        <WorldHUD
          navigate={navigate}
          onStartPlacing={handleStartPlacing}
          onStartPlacingDog={handleStartPlacingDog}
          selectedHabitat={selectedHabitat}
          onSelectHabitat={handleSelectHabitat}
          onMoveHabitat={handleMoveHabitat}
          onOpenInfo={() => setShowInspectorModal(true)}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetCam={resetCam}
        />
      </div>

      {/* ── Habitat Inspector Modal (Opens ONLY when INFO button is tapped on Habitat Action Bar) ── */}
      {showInspectorModal && selectedHabitat && (
        <div data-hud>
          <HabitatInspectorModal
            habitat={selectedHabitat}
            onClose={() => setShowInspectorModal(false)}
            onMove={handleMoveHabitat}
          />
        </div>
      )}
    </div>
  )
}
