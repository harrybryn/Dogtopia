import bulldogPuppySit from '../assets/dogs/BulldogPuppySit.png'
import bulldogPuppyWalk from '../assets/dogs/BulldogPuppyWalkingCycle.png'
import bulldogYoungSit from '../assets/dogs/BulldogYoungSit.png'
import bulldogYoungWalk from '../assets/dogs/BulldogYoungWalkingCycle.png'
import bulldogYoungPortrait from '../assets/dogs/BulldogYoungPortrait.png'
import bulldogAdultSit from '../assets/dogs/BulldogAdultSit.png'
import bulldogAdultWalk from '../assets/dogs/BulldogAdultWalkingCycle.png'
import bulldogAdultPortrait from '../assets/dogs/BulldogPortrait.png'

import huskyPuppySit from '../assets/itemsInShop/dogs/HuskyPuppySit.png'
import huskyPuppyWalk from '../assets/itemsInShop/dogs/HuskyPuppyWalkingCycle.png'
import huskyYoungSit from '../assets/itemsInShop/dogs/HuskyYoungSit.png'
import huskyYoungWalk from '../assets/itemsInShop/dogs/HuskyYoungWalkingCycle.png'
import huskyAdultSit from '../assets/itemsInShop/dogs/HuskyAdultSit.png'
import huskyAdultWalk from '../assets/itemsInShop/dogs/HuskyAdultWalkingCycle.png'

/**
 * Dragon City style Dog Stage & Evolution System:
 * - Level 1 - 3: Puppy Stage (PuppySit, PuppyWalkingCycle)
 * - Level 4 - 11: Young Stage (YoungSit, YoungWalkingCycle, YoungPortrait)
 * - Level 12+: Adult Stage (AdultSit, AdultWalkingCycle, AdultPortrait)
 * Supports multiple breeds: English Bulldog, Arctic Husky, etc.
 */
export function getDogStageInfo(dog) {
  const level = Number(dog?.level) || 1
  const breedId = (dog?.breedId || dog?.id || dog?.name || '').toLowerCase()
  const isHusky = breedId.includes('husky')

  let stage = 'Puppy'
  let stageLabel = 'Puppy'
  let stageFullTitle = isHusky ? 'Husky Puppy' : 'Bulldog Puppy'
  let sitImg = isHusky ? huskyPuppySit : bulldogPuppySit
  let walkImg = isHusky ? huskyPuppyWalk : bulldogPuppyWalk
  let portraitImg = isHusky ? huskyPuppySit : bulldogPuppySit

  if (level >= 12) {
    stage = 'Adult'
    stageLabel = 'Adult'
    stageFullTitle = isHusky ? 'Adult Arctic Husky' : 'Adult Dog Stage'
    sitImg = isHusky ? huskyAdultSit : bulldogAdultSit
    walkImg = isHusky ? huskyAdultWalk : bulldogAdultWalk
    portraitImg = isHusky ? huskyAdultSit : (bulldogAdultPortrait || bulldogAdultSit)
  } else if (level >= 4) {
    stage = 'Young'
    stageLabel = 'Young Pup'
    stageFullTitle = isHusky ? 'Young Arctic Husky' : 'Young Pup Stage'
    sitImg = isHusky ? huskyYoungSit : bulldogYoungSit
    walkImg = isHusky ? huskyYoungWalk : bulldogYoungWalk
    portraitImg = isHusky ? huskyYoungSit : (bulldogYoungPortrait || bulldogYoungSit)
  }

  // Dragon City Feeding Formula:
  // Feeds required per level: exactly 4 feeds
  const feedRequired = 4
  const feedProgress = Number(dog?.feedProgress) || 0

  // Kibble cost scales smoothly with level (e.g. Lv 1 = 20, Lv 2 = 30, Lv 3 = 45, Lv 4 = 65...)
  const kibbleCostPerFeed = Math.round(15 + Math.pow(level, 1.25) * 8)
  const coinsRewardPerFeed = Math.round(25 + level * 35)
  const xpRewardPerFeed = Math.round(15 + level * 20)
  const xpBonusOnLevelUp = Math.round(60 + level * 65)

  // Gold generation per minute based on level
  const coinRatePerMin = Math.round(30 + level * 18)

  const breedName = isHusky ? 'Arctic Husky' : 'English Bulldog'
  const defaultName = isHusky ? 'Storm' : 'Winston'

  const description = isHusky
    ? 'Spirited, resilient, and famously athletic! The Arctic Husky thrives in snowy peaks and frosty trails, howling with joyful zest and racing with boundless agility. He loves crisp alpine breezes, hearty kibble feasts, and running across the snow!'
    : 'Sturdy, courageous, and remarkably affectionate! Winston the English Bulldog thrives in sunny garden parks, greeting trainers with playful waddles and unwavering loyalty. He loves hearty kibble feasts and cozy afternoon naps on the lawn!'

  const youngEvolutionDesc = isHusky
    ? 'Incredible! Your companion transformed into a swift and spirited Young Husky! Endurance and coin output increased!'
    : 'Your companion has transformed into a sturdy Young Bulldog! Strength and coin output increased!'

  const adultEvolutionDesc = isHusky
    ? 'Magnificent! Your companion reached full maturity as a majestic Adult Arctic Husky! Maximum Frost mastery unlocked!'
    : 'Incredible! Your companion reached full maturity as a magnificent Adult Bulldog! Maximum Garden mastery unlocked!'

  return {
    level,
    stage,
    stageLabel,
    stageFullTitle,
    sitImg,
    walkImg,
    portraitImg,
    feedProgress,
    feedRequired,
    kibbleCostPerFeed,
    coinsRewardPerFeed,
    xpRewardPerFeed,
    xpBonusOnLevelUp,
    coinRatePerMin,
    isHusky,
    breedName,
    defaultName,
    description,
    youngEvolutionDesc,
    adultEvolutionDesc,
    isYoungEvolution: level === 4,
    isAdultEvolution: level === 12,
  }
}

