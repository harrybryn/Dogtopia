import { useState } from 'react'

/** Manages breeding state: selected parents, timer, and result. */
export function useBreeding() {
  const [parents, setParents] = useState([null, null])
  const [result, setResult] = useState(null)
  const [isBreeding, setIsBreeding] = useState(false)

  const startBreeding = (dogA, dogB) => {
    setParents([dogA, dogB])
    setIsBreeding(true)
    // Breeding logic will call breedingLogic util
  }

  const finishBreeding = (offspring) => {
    setResult(offspring)
    setIsBreeding(false)
  }

  const reset = () => { setParents([null, null]); setResult(null); setIsBreeding(false) }

  return { parents, result, isBreeding, startBreeding, finishBreeding, reset }
}

