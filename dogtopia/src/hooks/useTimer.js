import { useState, useEffect, useRef } from 'react'

/** Countdown timer hook. Returns { timeLeft, isRunning, start, stop, reset } */
export function useTimer(initialSeconds = 0) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    } else {
      clearInterval(intervalRef.current)
      if (timeLeft === 0) setIsRunning(false)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const start = () => setIsRunning(true)
  const stop = () => setIsRunning(false)
  const reset = (s = initialSeconds) => { setIsRunning(false); setTimeLeft(s) }

  return { timeLeft, isRunning, start, stop, reset }
}

