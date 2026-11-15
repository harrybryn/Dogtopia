import React from 'react'

/**
 * LoadingProgressBar
 * A pure code (SVG + CSS) reproduction of the game loading bar:
 * - Golden capsule frame with dark carved woodgrain track
 * - Left circular medallion with metallic gold rim and embossed paw print
 * - Glowing radiant gold energy fill that advances with `progress`
 * - Shimmer sweep and specular reflections
 *
 * @param {number} progress - 0 to 100
 */
export default function LoadingProgressBar({ progress = 0 }) {
  const clampedProgress = Math.max(0, Math.min(100, progress))
  // The usable fillable width inside the wooden channel (from x=42 to x=510, total ~468px)
  const maxFillWidth = 468
  const fillWidth = (clampedProgress / 100) * maxFillWidth

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox="0 0 540 68"
        className="w-full h-auto overflow-visible"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.55))' }}
      >
        <defs>
          {/* Metallic Gold Gradients */}
          <linearGradient id="lpb-gold-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <radialGradient id="lpb-gold-bevel" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fde047" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="85%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>

          <linearGradient id="lpb-gold-track" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="15%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          {/* Woodgrain Gradients */}
          <linearGradient id="lpb-wood-track" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#190701" />
            <stop offset="8%" stopColor="#2d1306" />
            <stop offset="30%" stopColor="#421a08" />
            <stop offset="50%" stopColor="#4a1e0a" />
            <stop offset="70%" stopColor="#3d1807" />
            <stop offset="92%" stopColor="#260e04" />
            <stop offset="100%" stopColor="#140501" />
          </linearGradient>

          <radialGradient id="lpb-wood-medallion" cx="38%" cy="35%" r="62%">
            <stop offset="0%" stopColor="#4d220b" />
            <stop offset="55%" stopColor="#2d1205" />
            <stop offset="100%" stopColor="#140501" />
          </radialGradient>

          {/* Paw Emboss Gradient */}
          <linearGradient id="lpb-paw-gold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Glowing Progress Fill Gradient */}
          <linearGradient id="lpb-progress-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="12%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Shimmer linear gradient */}
          <linearGradient id="lpb-shimmer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="lpb-paw-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#120501" floodOpacity="0.85" />
          </filter>

          <filter id="lpb-fill-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f59e0b" floodOpacity="0.85" />
          </filter>

          {/* Clip path for the interior wooden track */}
          <clipPath id="lpb-inner-track-clip">
            <path d="M 44,15 L 507,15 A 19,19 0 0 1 507,53 L 44,53 Z" />
          </clipPath>
        </defs>

        {/* ── TRACK BACKPLATE ── */}
        {/* Outer gold capsule border */}
        <path
          d="M 34,11 L 507,11 A 23,23 0 0 1 507,57 L 34,57 Z"
          fill="url(#lpb-gold-track)"
          stroke="#301202"
          strokeWidth="2.5"
        />

        {/* Inner wooden track bed */}
        <path
          d="M 36,14.5 L 507,14.5 A 19.5,19.5 0 0 1 507,53.5 L 36,53.5 Z"
          fill="url(#lpb-wood-track)"
        />

        {/* Wood grain details & inner shadow */}
        <g clipPath="url(#lpb-inner-track-clip)">
          <line x1="40" y1="20" x2="525" y2="20" stroke="#5a270d" strokeWidth="1.2" opacity="0.4" />
          <line x1="40" y1="26" x2="525" y2="26" stroke="#1d0902" strokeWidth="1.5" opacity="0.5" />
          <line x1="40" y1="34" x2="525" y2="34" stroke="#52240c" strokeWidth="1.2" opacity="0.35" />
          <line x1="40" y1="40" x2="525" y2="40" stroke="#180701" strokeWidth="1.8" opacity="0.6" />
          <line x1="40" y1="46" x2="525" y2="46" stroke="#481e09" strokeWidth="1.2" opacity="0.4" />
          {/* Carved top recessed depth shadow */}
          <rect x="36" y="14" width="500" height="9" fill="black" opacity="0.75" />
          <rect x="36" y="14" width="500" height="4" fill="black" opacity="0.5" />
          {/* Bottom subtle shadow */}
          <rect x="36" y="49" width="500" height="5" fill="black" opacity="0.45" />
        </g>

        {/* ── PROGRESS FILL ── */}
        <g clipPath="url(#lpb-inner-track-clip)">
          {clampedProgress > 0 && (
            <g
              style={{
                transition: 'all 0.25s ease-out',
              }}
            >
              {/* Main luminous fill body */}
              <rect
                x="42"
                y="16.5"
                width={fillWidth}
                height="35"
                rx="17.5"
                fill="url(#lpb-progress-fill)"
                filter="url(#lpb-fill-glow)"
              />
              {/* Top glossy highlight reflection */}
              <rect
                x="44"
                y="18"
                width={Math.max(0, fillWidth - 4)}
                height="15"
                rx="7.5"
                fill="white"
                opacity="0.4"
              />
              {/* Bottom tone shade */}
              <rect
                x="44"
                y="45"
                width={Math.max(0, fillWidth - 4)}
                height="5"
                rx="2.5"
                fill="#78350f"
                opacity="0.4"
              />
              {/* Animated light shimmer sweep */}
              <rect
                x="42"
                y="16.5"
                width={fillWidth}
                height="35"
                fill="url(#lpb-shimmer-grad)"
                className="animate-shimmer"
                style={{
                  animation: 'lpb-shimmer 2.2s infinite linear',
                }}
              />
            </g>
          )}
        </g>

        {/* ── TRACK FRAME OVERLAY (GOLD HIGHLIGHT LINES) ── */}
        <line
          x1="34"
          y1="12.5"
          x2="507"
          y2="12.5"
          stroke="#fffbeb"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <line
          x1="34"
          y1="56"
          x2="507"
          y2="56"
          stroke="#381503"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* ── LEFT MEDALLION (EMBLEM) ── */}
        <g id="lpb-medallion">
          {/* Outer shadow */}
          <circle cx="34" cy="34" r="31.5" fill="#100401" opacity="0.55" />

          {/* Outer gold rim bevel */}
          <circle cx="34" cy="34" r="30" fill="url(#lpb-gold-rim)" stroke="#381503" strokeWidth="1.8" />

          {/* Deep dark recessed groove */}
          <circle cx="34" cy="34" r="24.5" fill="none" stroke="#240c02" strokeWidth="2" />

          {/* Inner gold raised ring */}
          <circle cx="34" cy="34" r="22.5" fill="none" stroke="url(#lpb-gold-rim)" strokeWidth="2.5" />

          {/* Dark wood inlay face */}
          <circle cx="34" cy="34" r="20" fill="url(#lpb-wood-medallion)" stroke="#1a0802" strokeWidth="1" />

          {/* Inner face shadow ring */}
          <circle cx="34" cy="34" r="19" fill="none" stroke="#000000" strokeWidth="2" opacity="0.5" />

          {/* Golden Paw Print Icon */}
          <g filter="url(#lpb-paw-shadow)">
            {/* Main Center Pad */}
            <path
              d="M 34,31.8 C 37.2,30.5 40.2,32 41,35 C 41.8,37.8 40,41.4 37.4,43.2 C 35.3,44.6 32.7,44.6 30.6,43.2 C 28,41.4 26.2,37.8 27,35 C 27.8,32 30.8,30.5 34,31.8 Z"
              fill="url(#lpb-paw-gold)"
              stroke="#92400e"
              strokeWidth="0.7"
            />
            {/* Main pad highlight */}
            <ellipse cx="34" cy="33.8" rx="3.5" ry="1.8" fill="#ffffff" opacity="0.4" />

            {/* Toe 1 (far left) */}
            <ellipse
              cx="23"
              cy="30.5"
              rx="2.5"
              ry="3.8"
              transform="rotate(-30 23 30.5)"
              fill="url(#lpb-paw-gold)"
              stroke="#92400e"
              strokeWidth="0.6"
            />
            <ellipse
              cx="23"
              cy="29.2"
              rx="1.2"
              ry="1.8"
              transform="rotate(-30 23 30.5)"
              fill="#ffffff"
              opacity="0.4"
            />

            {/* Toe 2 (mid left) */}
            <ellipse
              cx="29.5"
              cy="25"
              rx="2.8"
              ry="4.2"
              transform="rotate(-12 29.5 25)"
              fill="url(#lpb-paw-gold)"
              stroke="#92400e"
              strokeWidth="0.6"
            />
            <ellipse
              cx="29.5"
              cy="23.5"
              rx="1.3"
              ry="2"
              transform="rotate(-12 29.5 25)"
              fill="#ffffff"
              opacity="0.4"
            />

            {/* Toe 3 (mid right) */}
            <ellipse
              cx="38.5"
              cy="25"
              rx="2.8"
              ry="4.2"
              transform="rotate(12 38.5 25)"
              fill="url(#lpb-paw-gold)"
              stroke="#92400e"
              strokeWidth="0.6"
            />
            <ellipse
              cx="38.5"
              cy="23.5"
              rx="1.3"
              ry="2"
              transform="rotate(12 38.5 25)"
              fill="#ffffff"
              opacity="0.4"
            />

            {/* Toe 4 (far right) */}
            <ellipse
              cx="45"
              cy="30.5"
              rx="2.5"
              ry="3.8"
              transform="rotate(30 45 30.5)"
              fill="url(#lpb-paw-gold)"
              stroke="#92400e"
              strokeWidth="0.6"
            />
            <ellipse
              cx="45"
              cy="29.2"
              rx="1.2"
              ry="1.8"
              transform="rotate(30 45 30.5)"
              fill="#ffffff"
              opacity="0.4"
            />
          </g>

          {/* Specular glint on outer rim */}
          <ellipse
            cx="21"
            cy="17"
            rx="4.5"
            ry="2.2"
            transform="rotate(-42 21 17)"
            fill="#ffffff"
            opacity="0.55"
          />
        </g>
      </svg>

      <style>{`
        @keyframes lpb-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}

