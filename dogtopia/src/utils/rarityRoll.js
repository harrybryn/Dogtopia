// rarityRoll.js – weighted random rarity selector

/** Given an array of { id, weight } entries, returns one id by weighted roll. */
export function rollRarity(pool = []) {
  const total = pool.reduce((sum, e) => sum + (e.weight ?? 1), 0)
  let rand = Math.random() * total
  for (const entry of pool) {
    rand -= entry.weight ?? 1
    if (rand <= 0) return entry.id
  }
  return pool[pool.length - 1]?.id ?? null
}

