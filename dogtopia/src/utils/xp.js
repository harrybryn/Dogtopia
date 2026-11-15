// xp.js – XP and level calculation utilities

/** Returns XP required to reach a given level. */
export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

/** Returns the level for an accumulated XP total. */
export function levelFromXp(xp) {
  let level = 1
  while (xp >= xpForLevel(level + 1)) level++
  return level
}

