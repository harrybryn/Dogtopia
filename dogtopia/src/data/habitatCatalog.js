/**
 * habitatCatalog.js
 * Catalog of buildable habitats, facilities, and decorations
 * derived directly from GameConcept.txt.
 * Includes high-resolution generated isometric habitat PNGs.
 */
import oasisImg from '../assets/habitats/OasisHabitat.png'
import snowImg from '../assets/habitats/SnowHabitat.png'
import forestImg from '../assets/habitats/ForestHabitat.png'
import beachImg from '../assets/habitats/BeachHabitat.png'
import gardenImg from '../assets/habitats/GardenHabitat.png'
import legendImg from '../assets/habitats/LegendaryHabitat.png'

import bulldogPortrait from '../assets/dogs/BulldogPortrait.png'
import bulldogSitImg from '../assets/dogs/BulldogSit.png'
import bulldogPuppyWalk from '../assets/dogs/BulldogPuppyWalkingCycle.png'
import bulldogPuppySit from '../assets/itemsInShop/dogs/BulldogPuppySit.png'

import breedingDenImg from '../assets/itemsInShop/building/BreedingDen.webp'
import waterStationImg from '../assets/itemsInShop/building/WaterStation.webp'
import dogfoodFactoryImg from '../assets/itemsInShop/building/DogfoodFactory.png'
import goldenPalmImg from '../assets/itemsInShop/building/GoldenPalm.webp'
import boneSignImg from '../assets/itemsInShop/building/BoneShapeSign.webp'

import huskyPuppySit from '../assets/itemsInShop/dogs/HuskyPuppySit.png'
import huskyPuppyWalk from '../assets/itemsInShop/dogs/HuskyPuppyWalkingCycle.png'

export const BULLDOG_DATA = {
  id: 'english-bulldog',
  name: 'English Bulldog',
  tagline: 'Loyal Garden Companion',
  desc: 'Affectionate, sturdy, and brave companion. Loves relaxing among the lush flowerbeds and sunny Garden Park cushions!',
  element: 'Garden Element',
  habitatId: 'garden',
  habitatName: 'Garden Park',
  portrait: bulldogPortrait,
  animation: bulldogSitImg,
  walkCycle: bulldogPuppyWalk,
  cost: { coins: 0 },
  rarity: 'Starter Pup',
  isDefault: true,
}

export const HUSKY_DATA = {
  id: 'arctic-husky',
  name: 'Arctic Husky',
  tagline: 'Spirited Snow Runner',
  desc: 'Athletic, vocal, and affectionate snow dog. Loves crisp breezes and running through snowy trails!',
  element: 'Snow Element',
  habitatId: 'snow',
  habitatName: 'Snowy Peak',
  portrait: huskyPuppySit,
  animation: huskyPuppySit,
  walkCycle: huskyPuppyWalk,
  cost: { coins: 800 },
  rarity: 'Frost Pup',
  isDefault: false,
}

export const HABITAT_IMAGES = {
  'garden-park': gardenImg,
  'desert-oasis': oasisImg,
  'snowy-peak': snowImg,
  'forest-meadow': forestImg,
  'beach-cove': beachImg,
  'legendary-realm': legendImg,
  'breeding-den': breedingDenImg,
  'water-station': waterStationImg,
  'dogfood-factory': dogfoodFactoryImg,
  'golden-palm': goldenPalmImg,
  'bone-sign': boneSignImg,
}

export const HABITAT_CATALOG = [
  // ── 1. The 6 Core Habitats (GameConcept.txt) ──
  {
    id: 'garden-park',
    type: 'habitat',
    name: 'Garden Park',
    tagline: 'Toy & Companion Breed Sanctuary',
    desc: 'Manicured flowerbeds, topiary bushes, plush cushions, and ribbons for Bulldog, Pug, and small companions.',
    size: { w: 3, h: 3 },
    cost: { coins: 500 },
    requiredLevel: 1,
    maxCoins: 1000,
    coinRate: '60/min',
    bestFor: 'English Bulldog, Toy Pug, Japanese Shiba',
    themeColor: '#ec4899',
    bgGradient: 'from-pink-200 to-rose-500',
    image: gardenImg,
    defaultDogs: [],
  },
  {
    id: 'desert-oasis',
    type: 'habitat',
    name: 'Desert Oasis',
    tagline: 'Warm-Climate Sanctuary',
    desc: 'Golden sand dunes, bright blue oasis pond, cacti, and shaded resting canopies. Suited for German Shepherds, Pharaoh Hounds, and Basenjis.',
    size: { w: 3, h: 3 },
    cost: { coins: 1500 },
    requiredLevel: 2,
    maxCoins: 2500,
    coinRate: '120/min',
    bestFor: 'German Shepherd, Pharaoh Hound, Basenji',
    themeColor: '#f59e0b',
    bgGradient: 'from-amber-200 to-amber-500',
    image: oasisImg,
    defaultDogs: [], // Empty: No dog included upon buying!
  },
  {
    id: 'snowy-peak',
    type: 'habitat',
    name: 'Snowy Peak',
    tagline: 'Cozy Alpine Frost Haven',
    desc: 'Thick snowdrifts, frozen hot springs, and pine shelters. Suited for Bulldog and thick-coated arctic explorers.',
    size: { w: 3, h: 3 },
    cost: { coins: 1500 },
    requiredLevel: 4,
    maxCoins: 2500,
    coinRate: '120/min',
    bestFor: 'Arctic Husky, White Samoyed',
    themeColor: '#38bdf8',
    bgGradient: 'from-sky-200 to-blue-500',
    image: snowImg,
    defaultDogs: [],
  },
  {
    id: 'forest-meadow',
    type: 'habitat',
    name: 'Forest Meadow',
    tagline: 'Active Grassy Clearing',
    desc: 'Lush green grass, oak tree shade, wooden obstacles, and chew toys for energetic hounds.',
    size: { w: 3, h: 3 },
    cost: { coins: 3000 },
    requiredLevel: 6,
    maxCoins: 5000,
    coinRate: '250/min',
    bestFor: 'Hunting Beagle, Golden Retriever',
    themeColor: '#22c55e',
    bgGradient: 'from-emerald-200 to-green-600',
    image: forestImg,
    defaultDogs: [],
  },
  {
    id: 'beach-cove',
    type: 'habitat',
    name: 'Beach Cove',
    tagline: 'Sunny Shoreline Paradise',
    desc: 'Crystal waves, golden beach sand, surfboards, and splash lagoons for swimmers.',
    size: { w: 3, h: 3 },
    cost: { coins: 6000 },
    requiredLevel: 8,
    maxCoins: 10000,
    coinRate: '450/min',
    bestFor: 'Yellow Labrador, Newfoundland',
    themeColor: '#06b6d4',
    bgGradient: 'from-cyan-200 to-teal-500',
    image: beachImg,
    defaultDogs: [],
  },
  {
    id: 'legendary-realm',
    type: 'habitat',
    name: 'Legendary Realm',
    tagline: 'Astral Ancient Dog Realm',
    desc: 'Hovering celestial crystals, stardust fountains, and glowing aura sanctuary for Mythic pups.',
    size: { w: 3, h: 3 },
    cost: { crystals: 45 },
    requiredLevel: 12,
    maxCoins: 50000,
    coinRate: '2000/min',
    bestFor: 'Cerberus Pup, Galaxy Astral Pup',
    themeColor: '#a855f7',
    bgGradient: 'from-purple-200 to-violet-600',
    image: legendImg,
    defaultDogs: ['English Bulldog'],
  },

  // ── Facilities ──
  {
    id: 'breeding-den',
    type: 'facility',
    name: 'Breeding Den',
    tagline: 'Discover secret dog hybrids',
    desc: 'Pair two adult dogs to hatch unique hybrid pups (e.g. Husky + Shiba = Snow Fox Shiba)!',
    size: { w: 3, h: 3 },
    cost: { coins: 2500 },
    maxCoins: 0,
    coinRate: 'Hatchery',
    bestFor: 'All Adult Breeds (Lv 30+)',
    themeColor: '#f43f5e',
    bgGradient: 'from-rose-200 to-pink-500',
    image: breedingDenImg,
    defaultDogs: [],
  },
  {
    id: 'water-station',
    type: 'facility',
    name: 'Water Station',
    tagline: 'Hydration and quick coins',
    desc: 'Stone water bowls and fountains to keep dogs energetic. Generates small coin bonuses.',
    size: { w: 2, h: 2 },
    cost: { coins: 600 },
    maxCoins: 300,
    coinRate: '30/min',
    bestFor: 'Park-wide hydration',
    themeColor: '#3b82f6',
    bgGradient: 'from-blue-200 to-blue-400',
    image: waterStationImg,
    defaultDogs: [],
  },
  {
    id: 'dogfood-factory',
    type: 'facility',
    name: 'Dogfood Factory',
    tagline: 'Automatic Kibble Bakery',
    desc: 'Bakes fresh, nutritious kibble biscuits over time to nourish and level up your companion dogs!',
    size: { w: 3, h: 3 },
    cost: { coins: 1000 },
    maxCoins: 0,
    maxDogfood: 300,
    dogfoodRate: '25/min',
    bestFor: 'All Dog Feeding & Evolution',
    themeColor: '#f59e0b',
    bgGradient: 'from-amber-200 to-amber-500',
    image: dogfoodFactoryImg,
    defaultDogs: [],
  },

  // ── Decorations ──
  {
    id: 'golden-palm',
    type: 'decor',
    name: 'Golden Palm',
    tagline: 'Tropical oasis shade',
    desc: 'Provides lovely shade for resting dogs during midday desert sun.',
    size: { w: 1, h: 1 },
    cost: { coins: 250 },
    maxCoins: 0,
    coinRate: '+5% Comfort',
    bestFor: 'Desert Oasis decor',
    themeColor: '#eab308',
    bgGradient: 'from-yellow-200 to-amber-400',
    image: goldenPalmImg,
    defaultDogs: [],
  },
  {
    id: 'bone-sign',
    type: 'decor',
    name: 'Bone-Shaped Sign',
    tagline: 'Cute welcoming monument',
    desc: 'Hand-carved wooden sign greeting visitors to your PupPal park.',
    size: { w: 1, h: 1 },
    cost: { coins: 150 },
    maxCoins: 0,
    coinRate: '+3% Comfort',
    bestFor: 'Park entrance',
    themeColor: '#f97316',
    bgGradient: 'from-orange-200 to-amber-500',
    image: boneSignImg,
    defaultDogs: [],
  },
]

/**
 * Compatibility helper: checks if a dog can live in a given habitat
 */
export function isDogCompatibleWithHabitat(dog, hab) {
  if (!dog || !hab) return false

  const habId = (hab.habitatId || hab.id || '').toLowerCase()
  const dogHab = (dog.compatibleHabitat || dog.habitatType || dog.habitatId || dog.element || dog.category || '').toLowerCase()
  const breedId = (dog.breedId || dog.id || dog.name || '').toLowerCase()

  // Arctic Husky is compatible with Snowy Peak and Garden Park
  if (breedId.includes('husky') && (habId.includes('snow') || habId.includes('garden'))) return true

  // English Bulldog is compatible with Garden Park and Snowy Peak
  if (breedId.includes('bulldog') && (habId.includes('garden') || habId.includes('snow'))) return true

  if ((dogHab.includes('desert') || dogHab.includes('oasis')) && (habId.includes('oasis') || habId.includes('desert'))) return true
  if (dogHab.includes('garden') && habId.includes('garden')) return true
  if (dogHab.includes('snow') && habId.includes('snow')) return true
  if (dogHab.includes('forest') && habId.includes('forest')) return true
  if (dogHab.includes('beach') && habId.includes('beach')) return true
  if ((dogHab.includes('legend') || dogHab.includes('realm')) && (habId.includes('legend') || habId.includes('realm'))) return true

  return false
}

