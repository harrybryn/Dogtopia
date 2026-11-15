// evolution.js – dog evolution stage helpers

/** Returns true when a dog meets the requirements to evolve. */
export function canEvolve(dog) {
  if (!dog) return false
  return dog.xp >= dog.evolutionXpRequired && dog.stage < dog.maxStage
}

/** Returns the next evolution stage object for a dog. */
export function getNextStage(dog, breedData) {
  if (!dog || !breedData) return null
  return breedData.stages?.[dog.stage] ?? null
}

