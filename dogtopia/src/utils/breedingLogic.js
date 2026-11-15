// breedingLogic.js – core breeding outcome resolver

import { rollRarity } from './rarityRoll.js'

/** Given two parent breeds, return the resulting offspring breed id. */
export function resolveOffspring(parentA, parentB, breedingCombos) {
  const key = [parentA, parentB].sort().join('+')
  const combo = breedingCombos[key]
  if (!combo) return null
  return rollRarity(combo.possible)
}

