import { useState, useEffect } from 'react'
import logoPng from '../../assets/ui/logo.webp'
import splashBg from '../../assets/ui/splash-bg.webp'
import LoadingProgressBar from './LoadingProgressBar.jsx'

/**
 * LoadingScreen
 * Props:
 *   onFinish  – called when the fake-load reaches 100 % and the fade-out ends
 *   duration  – total loading duration in ms (default 3000)
 */
export default function LoadingScreen({ onFinish, duration = 3000 }) {
  const [progress, setProgress] = useState(0)   // 0 – 100
  const [fadeOut, setFadeOut] = useState(false)
  const [tipIndex, setTipIndex] = useState(0)

  const tips = [
    'Breed two dogs to discover a rare hybrid!',
    'Complete daily quests to earn bonus gems.',
    'Level up your dogs to unlock new habitats.',
    'Visit friends to collect bonus gold.',
    'Some breeds only appear during special events.',
  ]

  /* ── Progress ticker ── */
  useEffect(() => {
    const steps = 60
    const interval = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current += 100 / steps + (Math.random() * 2 - 1) // slight jitter
      current = Math.min(100, current)
      setProgress(Math.floor(current))

      if (current >= 100) {
        clearInterval(timer)
        // Short pause then fade out
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(onFinish, 700) // wait for CSS transition
        }, 400)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [duration, onFinish])

  /* ── Rotate tips every 2 s ── */
  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      style={{ backgroundColor: '#120601' }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden
                  transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* ── Background ── */}
      <img
        src={splashBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />

      {/* ── Sky gradient overlay – softens the bottom half ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-sky-900/60" />

      {/* ── Animated golden light rays ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute origin-bottom opacity-20"
            style={{
              width: 3,
              height: '55vh',
              background: 'linear-gradient(to top, transparent, #fde68a)',
              transform: `rotate(${i * 45}deg)`,
              animation: `spin-slow 12s linear infinite`,
              animationDelay: `${i * -1.5}s`,
            }}
          />
        ))}
      </div>

      {/* ── Floating paw prints ── */}
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl select-none pointer-events-none opacity-60"
          style={{
            left: `${10 + i * 15}%`,
            animation: `float-paw ${3 + i * 0.4}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.5}s`,
            bottom: `${15 + (i % 3) * 12}%`,
          }}
        >
          PAW
        </span>
      ))}

      {/* ── Logo – drops in from above, prominent & big ── */}
      <div
        className="relative z-10 mb-16 sm:mb-20 flex justify-center"
        style={{ animation: 'logo-drop 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        <div
          className="relative w-80 sm:w-[440px] md:w-[520px] lg:w-[580px] max-w-[92vw]"
          style={{
            filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5))',
          }}
        >
          <img
            src={logoPng}
            alt="Dogtopia"
            className="w-full h-auto pointer-events-none select-none"
            draggable={false}
          />
        </div>
      </div>

      {/* ── Progress bar container (Code-generated custom wooden bar) ── */}
      <div
        className="relative z-10 w-80 sm:w-[440px] md:w-[500px] max-w-[90vw] mt-1"
        style={{ animation: 'fade-up 0.6s 0.4s both' }}
      >
        <LoadingProgressBar progress={progress} />

        {/* Percentage label */}
        <p
          className="text-center mt-2.5 font-black tracking-widest text-sm sm:text-base select-none"
          style={{
            color: '#fde68a',
            textShadow: '0 2px 4px #78350f, 0 0 14px rgba(245, 158, 11, 0.7)',
            letterSpacing: '0.15em',
          }}
        >
          {progress}%
        </p>
      </div>

      {/* ── Tip text ── */}
      <p
        key={tipIndex}
        className="relative z-10 mt-4 text-xs sm:text-sm text-amber-100/90 text-center px-8 max-w-xs sm:max-w-md"
        style={{
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          animation: 'fade-up 0.4s ease both',
        }}
      >
        {tips[tipIndex]}
      </p>

      {/* ── Keyframes injected via a <style> tag ── */}
      <style>{`
        @keyframes logo-drop {
          from { opacity: 0; transform: translateY(-60px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes float-paw {
          from { transform: translateY(0)   rotate(-10deg); }
          to   { transform: translateY(-18px) rotate(10deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(var(--tw-rotate, 0deg)); }
          to   { transform: rotate(calc(var(--tw-rotate, 0deg) + 360deg)); }
        }
      `}</style>
    </div>
  )
}
