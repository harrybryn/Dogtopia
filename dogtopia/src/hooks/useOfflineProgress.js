import { useEffect } from 'react'

/** Calculates and applies offline gold/XP gain when the tab was hidden. */
export function useOfflineProgress(dispatch) {
  useEffect(() => {
    const lastSeen = parseInt(localStorage.getItem('lastSeen') ?? Date.now(), 10)
    const elapsed = Math.floor((Date.now() - lastSeen) / 1000) // seconds

    if (elapsed > 60) {
      // TODO: apply offline earnings based on elapsed time
      dispatch?.({ type: 'OFFLINE_PROGRESS', payload: { elapsed } })
    }

    const handleHide = () => localStorage.setItem('lastSeen', Date.now())
    document.addEventListener('visibilitychange', handleHide)
    return () => document.removeEventListener('visibilitychange', handleHide)
  }, [dispatch])
}

