import React, { useState } from 'react'
import { useGame } from '../../context/GameContext.jsx'
import { HABITAT_CATALOG } from '../../data/habitatCatalog.js'
import shopModalBg from '../../assets/ui/ShopModal.webp'

// TrioUIKit Assets (Authentic game icons, NO emojis!)
import iconGoldPile from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_gold_pile.svg'
import iconCoin from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_coin.svg'
import iconGem from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_gem.svg'
import iconAxe from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_axe.svg'
import iconMap from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_map.svg'
import iconHeart from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_heart.svg'
import iconHome from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_home.svg'
import iconCrown from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_crown.svg'
import iconChest from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_chest.svg'
import iconLock from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_lock.svg'
import arrowLeft from '../../assets/TrioUIKit_FreeSample_v2.2/cozy/arrow_left.svg'

// Handcrafted Custom Game Currencies
import coinsImg from '../../assets/ui/coins.png'
import diamondsImg from '../../assets/ui/diamonds.png'
import dogfoodImg from '../../assets/ui/dogfood.png'

/**
 * Visual graphic displaying 1 to many diamonds, food bowls, or coins
 * depending on package size!
 */
function TieredCurrencyGraphic({ type = 'diamonds', tier = 1, size = 'lg' }) {
  const icon = type === 'diamonds' ? diamondsImg : type === 'food' ? dogfoodImg : coinsImg
  const isLg = size === 'lg'
  const boxDim = isLg ? 'w-20 h-20' : 'w-14 h-14'
  const iconBase = isLg ? 'w-14 h-14' : 'w-10 h-10'
  const iconSm = isLg ? 'w-10 h-10' : 'w-7 h-7'
  const iconXs = isLg ? 'w-8 h-8' : 'w-6 h-6'

  if (tier <= 1) {
    return (
      <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
        <img
          src={icon}
          alt=""
          className={`${iconBase} object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)] hover:scale-110 transition-transform`}
        />
      </div>
    )
  }

  if (tier === 2) {
    return (
      <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute left-1 bottom-1 filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]`}
        />
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute right-1 top-1 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]`}
        />
      </div>
    )
  }

  if (tier === 3) {
    return (
      <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md pointer-events-none" />
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute left-0 bottom-0 filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]`}
        />
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute right-0 bottom-0 filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]`}
        />
        <img
          src={icon}
          alt=""
          className={`${iconSm} object-contain absolute top-0 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]`}
        />
      </div>
    )
  }

  if (tier === 4) {
    return (
      <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
        <div className="absolute inset-0 rounded-full bg-purple-400/30 blur-lg pointer-events-none" />
        <img src={icon} alt="" className={`${iconXs} object-contain absolute left-0 bottom-1 drop-shadow`} />
        <img src={icon} alt="" className={`${iconXs} object-contain absolute right-0 bottom-1 drop-shadow`} />
        <img src={icon} alt="" className={`${iconXs} object-contain absolute left-2 top-0 drop-shadow`} />
        <img src={icon} alt="" className={`${iconXs} object-contain absolute right-2 top-0 drop-shadow`} />
        <img src={icon} alt="" className={`${iconSm} object-contain absolute inset-0 m-auto drop-shadow-2xl scale-110`} />
      </div>
    )
  }

  // Tier 5 & 6: Massive Mountain / Hoard of many gleaming items
  return (
    <div className={`relative ${boxDim} flex items-center justify-center select-none`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/35 to-purple-500/35 blur-xl animate-pulse pointer-events-none" />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute -left-1 bottom-0 drop-shadow`} />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute left-3 bottom-0 drop-shadow`} />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute -right-1 bottom-0 drop-shadow`} />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute left-0 top-0.5 drop-shadow`} />
      <img src={icon} alt="" className={`${iconXs} object-contain absolute right-0 top-0.5 drop-shadow`} />
      <img src={icon} alt="" className={`${iconSm} object-contain absolute top-0 inset-x-0 mx-auto drop-shadow-2xl scale-125`} />
    </div>
  )
}

// High-res Habitat Assets
import oasisImg from '../../assets/habitats/OasisHabitat.png'
import snowImg from '../../assets/habitats/SnowHabitat.png'
import forestImg from '../../assets/habitats/ForestHabitat.png'
import beachImg from '../../assets/habitats/BeachHabitat.png'
import gardenImg from '../../assets/habitats/GardenHabitat.png'
import legendImg from '../../assets/habitats/LegendaryHabitat.png'

// Building & Decor Assets
import breedingDenImg from '../../assets/itemsInShop/building/BreedingDen.webp'
import waterStationImg from '../../assets/itemsInShop/building/WaterStation.webp'
import dogfoodFactoryImg from '../../assets/itemsInShop/building/DogfoodFactory.png'
import goldenPalmImg from '../../assets/itemsInShop/building/GoldenPalm.webp'
import boneSignImg from '../../assets/itemsInShop/building/BoneShapeSign.webp'

// Real Dog Puppy Assets
import bulldogPuppySit from '../../assets/itemsInShop/dogs/BulldogPuppySit.png'
import huskyPuppySit from '../../assets/itemsInShop/dogs/HuskyPuppySit.png'
import bulldogPortrait from '../../assets/dogs/BulldogPortrait.png'
import coinAndDiamondsShopIcon from '../../assets/ui/CoinAndDiamondsShopICon.webp'

/**
 * BuildStoreModal
 * Handcrafted Dogtopia Shop built on the new ShopModal.webp asset.
 * Features:
 *   - Starts directly at the main Category Menu when opened
 *   - In Dog Adoptions, category tabs are based on HABITATS (Garden, Snow, Forest, Desert, Beach, Legend)
 *   - Habitats and Dogs have level locking requirements
 *   - Buying dogs closes modal and triggers habitat compatibility pulse
 *   - Zero emojis; utilizes authentic TrioUIKit icons
 */
export default function BuildStoreModal({ onClose, onStartPlacing, onStartPlacingDog, initialTab = 'categories' }) {
  const { state, dispatch } = useGame()
  // Active tab in the store
  const [activeTab, setActiveTab] = useState(initialTab) // 'categories' | 'diamonds' | 'habitats' | 'dogs' | 'buildings' | 'decor' | 'orbs' | 'packs'
  const [dogFilter, setDogFilter] = useState('all') // 'all' | 'garden' | 'snow' | 'forest' | 'desert' | 'beach' | 'legendary'
  const [purchaseSuccess, setPurchaseSuccess] = useState(null)

  // The 6 elemental habitats with level unlock requirements
  const habitats = [
    {
      id: 'garden-park',
      name: 'Garden Park',
      element: 'Garden Element',
      size: { w: 3, h: 3 },
      plotLabel: '3×3 Plot',
      cost: { coins: 500 },
      requiredLevel: 1,
      coinRate: '60/min',
      image: gardenImg,
    },
    {
      id: 'desert-oasis',
      name: 'Desert Oasis',
      element: 'Desert Element',
      size: { w: 3, h: 3 },
      plotLabel: '3×3 Plot',
      cost: { coins: 1500 },
      requiredLevel: 2,
      coinRate: '120/min',
      image: oasisImg,
    },
    {
      id: 'snowy-peak',
      name: 'Snowy Peak',
      element: 'Snow Element',
      size: { w: 3, h: 3 },
      plotLabel: '3×3 Plot',
      cost: { coins: 3000 },
      requiredLevel: 4,
      coinRate: '250/min',
      image: snowImg,
    },
    {
      id: 'forest-meadow',
      name: 'Forest Meadow',
      element: 'Forest Element',
      size: { w: 3, h: 3 },
      plotLabel: '3×3 Plot',
      cost: { coins: 6000 },
      requiredLevel: 6,
      coinRate: '450/min',
      image: forestImg,
    },
    {
      id: 'beach-cove',
      name: 'Beach Cove',
      element: 'Beach Element',
      size: { w: 3, h: 3 },
      plotLabel: '3×3 Plot',
      cost: { coins: 12000 },
      requiredLevel: 8,
      coinRate: '800/min',
      image: beachImg,
    },
    {
      id: 'legendary-realm',
      name: 'Legendary Realm',
      element: 'Legendary Element',
      size: { w: 3, h: 3 },
      plotLabel: '3×3 Plot',
      cost: { crystals: 45 },
      requiredLevel: 12,
      coinRate: '2,000/min',
      image: legendImg,
    },
  ]

  // Main Shop Categories using actual Representative Game Assets!
  const SHOP_CATEGORIES = [
    {
      id: 'diamonds',
      name: 'BUY DIAMONDS',
      image: diamondsImg,
      desc: 'Diamonds & Gems in ₱ (PHP)',
      highlight: true,
    },
    {
      id: 'habitats',
      name: 'HABITATS',
      image: gardenImg,
      desc: '6 Elemental Sanctuaries',
    },
    {
      id: 'dogs',
      name: 'DOG ADOPTIONS',
      image: bulldogPuppySit,
      desc: 'Breed by Habitat Element',
    },
    {
      id: 'buildings',
      name: 'BUILDINGS',
      image: breedingDenImg,
      desc: 'Training & Care Facilities',
    },
    {
      id: 'decor',
      name: 'ISLAND DECOR',
      image: goldenPalmImg,
      desc: 'Ornaments, Trees & Paths',
    },
    {
      id: 'packs',
      name: 'FOOD & PACKS',
      image: dogfoodImg,
      desc: 'Gourmet Kibble & Coins',
    },
  ]

  // Diamonds / Star Crystals Packs buyable with real money in Philippine Peso (₱)
  const diamondPacks = [
    {
      id: 'diamonds_50',
      name: 'Handful of Diamonds',
      diamonds: 50,
      pricePhp: 49,
      badge: 'STARTER',
      tagline: '50 Star Crystals',
      desc: 'Instant 50 Diamonds for speedups & boosts.',
      tier: 1,
      type: 'diamonds',
    },
    {
      id: 'diamonds_150',
      name: 'Pouch of Diamonds',
      diamonds: 150,
      pricePhp: 129,
      badge: '+10% BONUS',
      tagline: '150 Star Crystals',
      desc: '150 Diamonds to unlock rare decor & treats.',
      tier: 2,
      type: 'diamonds',
    },
    {
      id: 'diamonds_500',
      name: 'Sack of Diamonds',
      diamonds: 500,
      pricePhp: 399,
      badge: 'POPULAR',
      tagline: '500 Star Crystals',
      desc: '500 Diamonds for premium habitats & facilities.',
      popular: true,
      tier: 3,
      type: 'diamonds',
    },
    {
      id: 'diamonds_1200',
      name: 'Chest of Diamonds',
      diamonds: 1200,
      pricePhp: 799,
      badge: 'BEST VALUE',
      tagline: '1,200 Star Crystals',
      desc: '1,200 Diamonds with +40% extra value bonus!',
      bestValue: true,
      tier: 4,
      type: 'diamonds',
    },
    {
      id: 'diamonds_2800',
      name: 'Vault of Diamonds',
      diamonds: 2800,
      pricePhp: 1499,
      badge: '+60% EXTRA',
      tagline: '2,800 Star Crystals',
      desc: '2,800 Diamonds for master dog trainers.',
      tier: 5,
      type: 'diamonds',
    },
    {
      id: 'diamonds_6500',
      name: 'Mountain of Diamonds',
      diamonds: 6500,
      pricePhp: 2999,
      badge: 'MEGA HOARD',
      tagline: '6,500 Star Crystals',
      desc: '6,500 Diamonds to rule the floating islands!',
      tier: 6,
      type: 'diamonds',
    },
  ]

  const handleBuyDiamonds = (pack) => {
    dispatch({
      type: 'ADD_CURRENCY',
      payload: {
        crystals: pack.diamonds,
      },
    })
    setPurchaseSuccess(pack)
  }

  const handleBuySupplyPack = (pack) => {
    const costCoins = pack.cost?.coins || 0
    const costCrystals = pack.cost?.crystals || 0
    if (state.coins < costCoins || state.crystals < costCrystals) return

    dispatch({
      type: 'ADD_CURRENCY',
      payload: {
        coins: (pack.coinsReward || 0) - costCoins,
        crystals: (pack.crystalsReward || 0) - costCrystals,
        kibble: pack.kibbleReward || 0,
      },
    })
    setPurchaseSuccess(pack)
  }

  // Dog Category Tabs based on the HABITATS (ordered by unlock progression)
  const HABITAT_TABS = [
    { id: 'all', label: 'ALL' },
    { id: 'garden', label: 'GARDEN' },
    { id: 'desert', label: 'DESERT' },
    { id: 'snow', label: 'SNOW' },
    { id: 'forest', label: 'FOREST' },
    { id: 'beach', label: 'BEACH' },
    { id: 'legendary', label: 'LEGEND' },
  ]

  // Dogs categorized by their ELEMENT matching each Habitat
  const allDogs = [
    {
      id: 'english-bulldog',
      name: 'English Bulldog',
      element: 'Garden Element',
      category: 'Garden Element',
      habitatId: 'garden',
      habitatName: 'Garden Park',
      cost: { coins: 500 },
      requiredLevel: 1,
      image: bulldogPuppySit,
    },
    {
      id: 'toy-pug',
      name: 'Toy Pug',
      element: 'Garden Element',
      category: 'Garden Element',
      habitatId: 'garden',
      habitatName: 'Garden Park',
      cost: { coins: 1500 },
      requiredLevel: 2,
      imageIcon: iconHeart,
    },
    {
      id: 'japanese-shiba',
      name: 'Japanese Shiba',
      element: 'Garden Element',
      category: 'Garden Element',
      habitatId: 'garden',
      habitatName: 'Garden Park',
      cost: { coins: 5000 },
      requiredLevel: 3,
      imageIcon: iconHeart,
    },
    {
      id: 'german-shepherd',
      name: 'German Shepherd',
      element: 'Desert Element',
      category: 'Desert Element',
      habitatId: 'desert',
      habitatName: 'Desert Oasis',
      cost: { coins: 2500 },
      requiredLevel: 4,
      imageIcon: iconHeart,
    },
    {
      id: 'pharaoh-hound',
      name: 'Pharaoh Hound',
      element: 'Desert Element',
      category: 'Desert Element',
      habitatId: 'desert',
      habitatName: 'Desert Oasis',
      cost: { coins: 8000 },
      requiredLevel: 5,
      imageIcon: iconCrown,
    },
    {
      id: 'arctic-husky',
      name: 'Arctic Husky',
      element: 'Snow Element',
      category: 'Snow Element',
      habitatId: 'snow',
      habitatName: 'Snowy Peak',
      cost: { coins: 800 },
      requiredLevel: 1,
      image: huskyPuppySit,
    },
    {
      id: 'white-samoyed',
      name: 'White Samoyed',
      element: 'Snow Element',
      category: 'Snow Element',
      habitatId: 'snow',
      habitatName: 'Snowy Peak',
      cost: { coins: 9000 },
      requiredLevel: 7,
      imageIcon: iconHeart,
    },
    {
      id: 'hunting-beagle',
      name: 'Hunting Beagle',
      element: 'Forest Element',
      category: 'Forest Element',
      habitatId: 'forest',
      habitatName: 'Forest Meadow',
      cost: { coins: 3500 },
      requiredLevel: 8,
      imageIcon: iconHeart,
    },
    {
      id: 'golden-retriever',
      name: 'Golden Retriever',
      element: 'Forest Element',
      category: 'Forest Element',
      habitatId: 'forest',
      habitatName: 'Forest Meadow',
      cost: { coins: 8000 },
      requiredLevel: 9,
      imageIcon: iconCrown,
    },
    {
      id: 'yellow-labrador',
      name: 'Yellow Labrador',
      element: 'Beach Element',
      category: 'Beach Element',
      habitatId: 'beach',
      habitatName: 'Beach Cove',
      cost: { coins: 7000 },
      requiredLevel: 10,
      imageIcon: iconHeart,
    },
    {
      id: 'galaxy-astral-pup',
      name: 'Galaxy Astral Pup',
      element: 'Legendary Element',
      category: 'Legendary Element',
      habitatId: 'legendary',
      habitatName: 'Legendary Realm',
      cost: { crystals: 100 },
      requiredLevel: 12,
      imageIcon: iconGem,
    },
    {
      id: 'cerberus-pup',
      name: 'Cerberus Pup',
      element: 'Legendary Element',
      category: 'Legendary Element',
      habitatId: 'legendary',
      habitatName: 'Legendary Realm',
      cost: { crystals: 150 },
      requiredLevel: 15,
      imageIcon: iconGem,
    },
  ]

  // Filter dogs based on the active habitat tab
  const filteredDogs = dogFilter === 'all'
    ? allDogs.slice(0, 6)
    : allDogs.filter((d) => d.habitatId === dogFilter || d.habitatId === 'all').slice(0, 6)

  // Buildings using official WebP assets
  const buildings = [
    {
      id: 'dogfood-factory',
      type: 'facility',
      name: 'Dogfood Factory',
      element: 'Care Facility',
      tagline: 'Automatic Kibble Bakery',
      desc: 'Bakes fresh, delicious kibble treats over time to nourish and level up your companions!',
      size: { w: 3, h: 3 },
      plotLabel: '3×3 Plot',
      cost: { coins: 1000 },
      requiredLevel: 1,
      coinRate: '25 Kibble/min',
      image: dogfoodFactoryImg,
    },
    {
      id: 'breeding-den',
      type: 'facility',
      name: 'Breeding Den',
      element: 'Care Facility',
      tagline: 'Hatch Rare Dog Hybrids',
      desc: 'Pair two adult dogs to hatch unique hybrid pups!',
      size: { w: 3, h: 3 },
      plotLabel: '3×3 Plot',
      cost: { coins: 2500 },
      requiredLevel: 4,
      coinRate: 'Hatchery',
      image: breedingDenImg,
    },
    {
      id: 'water-station',
      type: 'facility',
      name: 'Water Station',
      element: 'Care Facility',
      tagline: 'Hydration & Coin Fountain',
      desc: 'Stone water bowls and fountains to keep dogs energetic.',
      size: { w: 2, h: 2 },
      plotLabel: '2×2 Plot',
      cost: { coins: 600 },
      requiredLevel: 1,
      coinRate: '30/min',
      image: waterStationImg,
    },
  ]

  // Island Decorations using official WebP assets
  const decorations = [
    {
      id: 'golden-palm',
      type: 'decor',
      name: 'Golden Palm',
      element: 'Park Decor',
      tagline: 'Tropical Oasis Shade',
      desc: 'Provides lovely shade for resting dogs during midday.',
      size: { w: 1, h: 1 },
      plotLabel: '1×1 Plot',
      cost: { coins: 250 },
      requiredLevel: 1,
      coinRate: '+5% Comfort',
      image: goldenPalmImg,
    },
    {
      id: 'bone-sign',
      type: 'decor',
      name: 'Bone-Shaped Sign',
      element: 'Park Decor',
      tagline: 'Welcoming Park Monument',
      desc: 'Hand-carved wooden sign greeting visitors to your island.',
      size: { w: 1, h: 1 },
      plotLabel: '1×1 Plot',
      cost: { coins: 150 },
      requiredLevel: 1,
      coinRate: '+3% Comfort',
      image: boneSignImg,
    },
  ]

  // Astral Orbs & Celestial Runes
  const astralOrbs = [
    {
      id: 'astral-star-orb',
      name: 'Astral Star Orb',
      element: 'Cosmic Rune',
      tagline: 'Mythic Energy Source',
      desc: 'Channel starlight to boost breeding chance for mythical pups.',
      cost: { crystals: 25 },
      requiredLevel: 5,
      imageIcon: iconGem,
    },
    {
      id: 'breeding-essence-orb',
      name: 'Breeding Essence',
      element: 'Evolution Catalyst',
      tagline: 'Instant Hatch Rune',
      desc: 'Instantly completes breeding cycles in the Breeding Den.',
      cost: { crystals: 50 },
      requiredLevel: 8,
      imageIcon: iconGem,
    },
  ]

  // Food Packs & Coin Treasure Bundles with tiered visual images
  const foodPacks = [
    {
      id: 'kibble_snack',
      name: 'Bowl of Crunchy Kibble',
      element: '+1,500 Kibble',
      tagline: 'Crunchy Nutrition Treats',
      desc: 'Feed your dogs to level up and increase coin generation rate.',
      cost: { coins: 1000 },
      requiredLevel: 1,
      tier: 1,
      type: 'food',
      kibbleReward: 1500,
    },
    {
      id: 'kibble_sack',
      name: 'Sack of Gourmet Kibble',
      element: '+5,000 Kibble',
      tagline: 'Hearty Doggy Feast',
      desc: 'Stockpile delicious nutrition for your furry companions.',
      cost: { coins: 3000 },
      requiredLevel: 2,
      tier: 3,
      type: 'food',
      badge: 'POPULAR',
      popular: true,
      kibbleReward: 5000,
    },
    {
      id: 'kibble_banquet',
      name: 'Grand Sanctuary Feast',
      element: '+20,000 Kibble',
      tagline: 'Royal Canine Banquet',
      desc: 'Massive nourishment feast to quickly evolve multiple dogs.',
      cost: { coins: 10000 },
      requiredLevel: 4,
      tier: 5,
      type: 'food',
      badge: 'BEST VALUE',
      bestValue: true,
      kibbleReward: 20000,
    },
    {
      id: 'coins_pouch',
      name: 'Pouch of Paw Coins',
      element: '+15,000 Coins',
      tagline: 'Shiny Gold Paw Coins',
      desc: 'Handful of shimmering paw gold for quick upgrades.',
      cost: { crystals: 25 },
      requiredLevel: 1,
      tier: 2,
      type: 'coins',
      coinsReward: 15000,
    },
    {
      id: 'coins_sack',
      name: 'Treasure Sack of Coins',
      element: '+60,000 Coins',
      tagline: 'Overflowing Paw Gold',
      desc: 'A heavy sack of golden paws to build grand habitats.',
      cost: { crystals: 80 },
      requiredLevel: 3,
      tier: 3,
      type: 'coins',
      badge: 'POPULAR',
      popular: true,
      coinsReward: 60000,
    },
    {
      id: 'coins_vault',
      name: 'Royal Mountain of Coins',
      element: '+250,000 Coins',
      tagline: 'Imperial Dogtopia Treasury',
      desc: 'A grand mountain of golden coins for unlimited sanctuary expansion.',
      cost: { crystals: 250 },
      requiredLevel: 5,
      tier: 6,
      type: 'coins',
      badge: 'MEGA HOARD',
      bestValue: true,
      coinsReward: 250000,
    },
  ]

  // Dynamic items based on activeTab
  const currentItems =
    activeTab === 'diamonds'
      ? diamondPacks
      : activeTab === 'habitats'
      ? habitats
      : activeTab === 'dogs'
      ? filteredDogs
      : activeTab === 'buildings'
      ? buildings
      : activeTab === 'decor'
      ? decorations
      : activeTab === 'orbs'
      ? astralOrbs
      : activeTab === 'packs'
      ? foodPacks
      : habitats

  // Dynamic Title for the carved wooden banner
  const getBannerTitle = () => {
    switch (activeTab) {
      case 'categories': return 'SHOP CATEGORIES'
      case 'diamonds': return 'BUY DIAMONDS (PHP ₱)'
      case 'habitats': return 'ISLAND HABITATS'
      case 'dogs': return 'DOG ADOPTIONS'
      case 'buildings': return 'ISLAND BUILDINGS'
      case 'decor': return 'ISLAND DECOR'
      case 'orbs': return 'ASTRAL ORBS'
      case 'packs': return 'FOOD & PACKS'
      default: return 'DOGTOPIA STORE'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn select-none">
      {/* ── Main Shop Window (Aspect 1536 / 1024 = 3 : 2) ── */}
      <div
        className="relative w-full max-w-5xl aspect-[3/2] max-h-[92vh] select-none flex flex-col"
        style={{
          backgroundImage: `url(${shopModalBg})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'drop-shadow(0 20px 45px rgba(0,0,0,0.85))',
        }}
      >
        {/* ── Top-Center Wooden Title Banner ── */}
        <div
          className="absolute left-[32%] right-[32%] top-[4.5%] h-[12%] flex items-center justify-center pointer-events-none"
        >
          <span
            className="font-black text-sm sm:text-lg md:text-xl lg:text-2xl uppercase tracking-wider text-center leading-none"
            style={{
              fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
              color: '#3b1404',
              textShadow: '0 1px 0 rgba(255,255,255,0.85), 0 2px 4px rgba(0,0,0,0.25)',
              letterSpacing: '0.06em',
            }}
          >
            {getBannerTitle()}
          </span>
        </div>

        {/* ── Top-Right Red (X) Close Button Overlay (over illustrated button) ── */}
        <button
          onClick={onClose}
          title="Close Shop"
          className="absolute right-[5.5%] top-[11.5%] w-[8%] aspect-square rounded-full cursor-pointer z-30 transition-transform active:scale-90 hover:scale-105 flex items-center justify-center bg-transparent border-0 p-0"
        >
          <span className="sr-only">Close Shop</span>
        </button>

        {/* ── Main Parchment Board Content Area ── */}
        <div
          className="absolute left-[10.5%] right-[10.5%] top-[23%] bottom-[13.5%] flex flex-col overflow-hidden px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2.5"
        >
          {/* Subcategory Top Bar: Back Button + Habitat Category Tabs */}
          {activeTab !== 'categories' && (
            <div className="flex items-center justify-between gap-1 sm:gap-2 mb-2 flex-shrink-0">
              {/* Back to Categories Button */}
              <button
                onClick={() => setActiveTab('categories')}
                className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-black text-xs sm:text-sm text-amber-950 uppercase transition-all active:scale-90 hover:scale-105 cursor-pointer shadow-md flex-shrink-0"
                style={{
                  background: 'linear-gradient(180deg, #fef08a 0%, #f59e0b 100%)',
                  border: '1.5px solid #d97706',
                  boxShadow: '0 2px 6px rgba(217, 119, 6, 0.35), inset 0 1px 1px rgba(255,255,255,0.7)',
                  fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                }}
              >
                <img src={arrowLeft} alt="" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
                <span className="whitespace-nowrap">CATEGORIES</span>
              </button>

              {/* Habitat Tabs for Dogs (Based on the 6 Habitats, NO scrollbars!) */}
              {activeTab === 'dogs' && (
                <div className="flex items-center gap-1 overflow-hidden flex-wrap justify-end">
                  {HABITAT_TABS.map((tab) => {
                    const isSelected = dogFilter === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setDogFilter(tab.id)}
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[11px] uppercase transition-all cursor-pointer whitespace-nowrap shadow-sm active:scale-95"
                        style={{
                          background: isSelected
                            ? 'linear-gradient(180deg, #451a03 0%, #290e02 100%)'
                            : 'linear-gradient(180deg, #fef9c3 0%, #fde68a 100%)',
                          color: isSelected ? '#fef08a' : '#78350f',
                          border: isSelected ? '1.5px solid #d97706' : '1px solid rgba(217, 119, 6, 0.4)',
                          boxShadow: isSelected
                            ? '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.2)'
                            : '0 1px 2px rgba(120, 53, 15, 0.15)',
                          fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                          letterSpacing: '0.03em',
                        }}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── VIEW 1: Categories Menu Grid (Starts Here When Clicked!) ── */}
          {activeTab === 'categories' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-2 auto-rows-fr gap-2 sm:gap-3 flex-1 overflow-hidden p-1">
              {SHOP_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className="relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.03] active:scale-95 group shadow-md hover:shadow-xl"
                  style={{
                    background: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #fef8eb 65%, #fde6ba 100%)',
                    border: '2px solid #d97706',
                    boxShadow: '0 4px 10px rgba(120, 53, 15, 0.2), inset 0 1px 2px rgba(255,255,255,0.9)',
                  }}
                >
                  {/* Category Image Asset (Garden Habitat, Puppy Bulldog, Breeding Den, Golden Palm) */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={cat.image || cat.icon}
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  {/* Category Title */}
                  <h3
                    className="font-black text-xs sm:text-sm md:text-base uppercase tracking-wider leading-tight text-center"
                    style={{
                      fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                      color: '#451a03',
                      textShadow: '0 1px 0 rgba(255,255,255,0.85)',
                    }}
                  >
                    {cat.name}
                  </h3>

                  {/* Clean Subtitle */}
                  <span className="text-[10px] sm:text-[11px] font-semibold text-amber-900/80 text-center line-clamp-1 mt-0.5">
                    {cat.desc}
                  </span>

                  {/* Action Pill */}
                  <div className="mt-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[9px] sm:text-[10px] uppercase shadow-sm group-hover:brightness-110">
                    EXPLORE
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── VIEW 2: Items Grid (Habitats or Dogs or Buildings) ── */
            <div className="grid grid-cols-2 sm:grid-cols-3 grid-rows-2 auto-rows-fr gap-2 sm:gap-2.5 flex-1 overflow-hidden p-1">
              {currentItems.map((item) => {
                if (!item) return null
                const costCoins = item.cost?.coins || 0
                const costCrystals = item.cost?.crystals || 0
                const reqLvl = item.requiredLevel || 1
                const isLocked = (state.level || 1) < reqLvl
                const canAfford = !isLocked && state.coins >= costCoins && state.crystals >= costCrystals

                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col justify-between p-2 sm:p-2.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-md group overflow-hidden"
                    style={{
                      background: isLocked
                        ? 'radial-gradient(circle at 50% 20%, #efe7dc 0%, #dbcfbe 60%, #baa894 100%)'
                        : 'radial-gradient(circle at 50% 20%, #ffffff 0%, #fef9ee 60%, #fae8c8 100%)',
                      border: isLocked ? '2px solid #786c5f' : '2px solid #d97706',
                      boxShadow: isLocked
                        ? '0 3px 8px rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.7)'
                        : '0 4px 12px rgba(120, 53, 15, 0.18), inset 0 1px 2px rgba(255,255,255,0.95)',
                    }}
                  >
                    {/* Top: Image Area with Fixed, Sized Image */}
                    <div className="relative flex items-center justify-center h-[54%]">
                      {item.tier ? (
                        <TieredCurrencyGraphic type={item.type || 'diamonds'} tier={item.tier} size="lg" />
                      ) : item.image ? (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 ${
                              isLocked ? 'select-none' : ''
                            }`}
                            style={isLocked ? { filter: 'brightness(0) drop-shadow(0 2px 4px rgba(0,0,0,0.35))', opacity: 0.88 } : {}}
                          />
                        </div>
                      ) : (
                        <div className={`w-11 h-11 rounded-full border flex items-center justify-center ${
                          isLocked ? 'bg-stone-300 border-stone-400' : 'bg-amber-100/90 border-amber-300'
                        }`}>
                          <img
                            src={item.imageIcon || iconHome}
                            alt=""
                            className="w-6 h-6 object-contain drop-shadow"
                            style={isLocked ? { filter: 'brightness(0)', opacity: 0.8 } : {}}
                          />
                        </div>
                      )}

                      {/* Status / Lock / Rate Badge */}
                      {item.badge ? (
                        <div
                          className="absolute top-0 right-0 flex items-center gap-1 px-2 py-0.5 rounded-md shadow-sm font-black text-[8px] sm:text-[9px] uppercase leading-none"
                          style={{
                            background: item.bestValue
                              ? 'linear-gradient(180deg, #e11d48 0%, #9f1239 100%)'
                              : item.popular
                              ? 'linear-gradient(180deg, #d97706 0%, #b45309 100%)'
                              : 'linear-gradient(180deg, #059669 0%, #047857 100%)',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.4)',
                          }}
                        >
                          <span>{item.badge}</span>
                        </div>
                      ) : isLocked ? (
                        <div className="absolute top-0 right-0 flex items-center gap-1 px-1.5 py-0.5 rounded-md shadow-sm bg-zinc-900 border border-amber-600/70">
                          <img src={iconLock} alt="" className="w-2.5 h-2.5 object-contain" />
                          <span className="font-black text-[8px] sm:text-[9px] text-amber-300 uppercase leading-none">
                            REQ LVL {reqLvl}
                          </span>
                        </div>
                      ) : item.coinRate ? (
                        <div
                          className="absolute top-0 right-0 flex items-center gap-1 px-2 py-0.5 rounded-md shadow-sm"
                          style={{
                            background: 'linear-gradient(180deg, #059669 0%, #047857 100%)',
                            border: '1px solid #6ee7b7',
                          }}
                        >
                          <img src={iconCoin} alt="" className="w-3 h-3 object-contain" />
                          <span className="font-black text-[9px] sm:text-[10px] text-white leading-none">
                            +{item.coinRate}
                          </span>
                        </div>
                      ) : activeTab === 'dogs' || item.category ? (
                        <span
                          className={`absolute top-0 right-0 px-1.5 py-0.5 rounded-md border text-[8px] sm:text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm ${
                            item.habitatId === 'all'
                              ? 'bg-amber-400 text-amber-950 border-amber-500'
                              : item.habitatId === 'desert'
                              ? 'bg-amber-600 text-white border-amber-400'
                              : item.habitatId === 'garden'
                              ? 'bg-rose-500 text-white border-rose-300'
                              : item.habitatId === 'snow'
                              ? 'bg-sky-500 text-white border-sky-300'
                              : item.habitatId === 'forest'
                              ? 'bg-emerald-600 text-white border-emerald-400'
                              : item.habitatId === 'beach'
                              ? 'bg-teal-600 text-white border-teal-300'
                              : item.habitatId === 'legendary'
                              ? 'bg-purple-600 text-white border-purple-400'
                              : 'bg-emerald-600 text-white border-emerald-400'
                          }`}
                        >
                          {item.habitatName || 'All Habitats'}
                        </span>
                      ) : item.plotLabel ? (
                        <span className="absolute top-0 right-0 px-1.5 py-0.5 rounded-md border text-[8px] sm:text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm bg-amber-600 text-white border-amber-400">
                          {item.plotLabel}
                        </span>
                      ) : (
                        <span className="absolute top-0 right-0 px-2 py-0.5 rounded-md border text-[8px] sm:text-[9px] font-black uppercase tracking-wider whitespace-nowrap shadow-sm bg-emerald-600 text-white border-emerald-400">
                          READY
                        </span>
                      )}
                    </div>

                    {/* Middle: Name & Element Subtitle */}
                    <div className="flex flex-col px-1 leading-tight mt-1">
                      <h4
                        className="font-black text-xs sm:text-sm md:text-[15px] uppercase tracking-tight truncate"
                        style={{
                          fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
                          color: isLocked ? '#44403c' : '#3b1404',
                          textShadow: isLocked ? 'none' : '0 1px 0 rgba(255,255,255,0.85)',
                        }}
                      >
                        {item.name}
                      </h4>
                      <span className={`text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-wide truncate ${isLocked ? 'text-stone-500' : 'text-amber-900/80'}`}>
                        {item.diamonds ? `+${item.diamonds.toLocaleString()} Diamonds` : (item.element || item.category || item.habitatName || item.plotLabel || (item.size?.w && `${item.size.w}×${item.size.h} Plot`) || item.tagline || 'Island Facility')}
                      </span>
                    </div>

                    {/* Bottom: Price Tag & Action Button */}
                    <div className="flex items-center justify-between gap-1.5 pt-1 mt-auto">
                      {/* Price Tag */}
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-950/40 flex-shrink-0"
                        style={{ background: 'linear-gradient(180deg, #3d1706 0%, #200a02 100%)' }}
                      >
                        {item.pricePhp ? (
                          <span
                            className="font-black text-[10px] sm:text-xs text-amber-300"
                            style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                          >
                            ₱{item.pricePhp.toLocaleString()}
                          </span>
                        ) : costCoins > 0 ? (
                          <>
                            <img src={coinsImg} alt="" className="w-3.5 h-3.5 object-contain drop-shadow" />
                            <span
                              className="font-black text-[10px] sm:text-xs text-amber-300"
                              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                            >
                              {costCoins.toLocaleString()}
                            </span>
                          </>
                        ) : costCrystals > 0 ? (
                          <>
                            <img src={diamondsImg} alt="" className="w-3.5 h-3.5 object-contain drop-shadow" />
                            <span
                              className="font-black text-[10px] sm:text-xs text-purple-300"
                              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                            >
                              {costCrystals}
                            </span>
                          </>
                        ) : (
                          <span
                            className="font-black text-[10px] sm:text-xs text-amber-300"
                            style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
                          >
                            FREE
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      {item.pricePhp ? (
                        <button
                          type="button"
                          onClick={() => handleBuyDiamonds(item)}
                          className="flex-1 py-1 px-2 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-md active:scale-90 hover:brightness-110 hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5 text-white"
                          style={{
                            background: 'linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)',
                            border: '1.5px solid #a7f3d0',
                            boxShadow: '0 3px 8px rgba(5, 150, 105, 0.4), inset 0 1px 2px rgba(255,255,255,0.7)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                            fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                          }}
                        >
                          <img src={diamondsImg} alt="" className="w-3.5 h-3.5 object-contain drop-shadow" />
                          <span>BUY (₱{item.pricePhp})</span>
                        </button>
                      ) : isLocked ? (
                        <div className="flex-1 py-1 px-2 rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-wider text-center bg-zinc-800 text-amber-200/90 border border-amber-900/60 cursor-not-allowed flex items-center justify-center gap-1 shadow-inner">
                          <img src={iconLock} alt="" className="w-3 h-3 object-contain opacity-90" />
                          <span>LOCKED (LVL {reqLvl})</span>
                        </div>
                      ) : item.type === 'food' || item.type === 'coins' ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (canAfford) {
                              handleBuySupplyPack(item)
                            }
                          }}
                          disabled={!canAfford}
                          className={`flex-1 py-1 px-2 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-md active:scale-90 cursor-pointer flex items-center justify-center gap-1.5 ${
                            canAfford
                              ? 'text-white hover:brightness-110 hover:scale-105'
                              : 'bg-zinc-600 text-zinc-300 cursor-not-allowed opacity-60'
                          }`}
                          style={{
                            background: canAfford
                              ? item.type === 'food'
                                ? 'linear-gradient(180deg, #f97316 0%, #ea580c 50%, #c2410c 100%)'
                                : 'linear-gradient(180deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
                              : undefined,
                            border: canAfford ? '1.5px solid #fed7aa' : '1px solid #71717a',
                            boxShadow: canAfford
                              ? '0 3px 8px rgba(234, 88, 12, 0.4), inset 0 1px 2px rgba(255,255,255,0.7)'
                              : 'none',
                            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                            fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                          }}
                        >
                          <img src={item.type === 'food' ? dogfoodImg : coinsImg} alt="" className="w-3.5 h-3.5 object-contain drop-shadow" />
                          <span>GET</span>
                        </button>
                      ) : activeTab === 'dogs' ? (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              onStartPlacingDog && onStartPlacingDog(item)
                              onClose()
                            }
                          }}
                          disabled={!canAfford}
                          className={`flex-1 py-1 px-2 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-md active:scale-90 cursor-pointer flex items-center justify-center gap-1.5 ${
                            canAfford
                              ? 'text-white hover:brightness-110 hover:scale-105'
                              : 'bg-zinc-600 text-zinc-300 cursor-not-allowed opacity-60'
                          }`}
                          style={{
                            background: canAfford
                              ? 'linear-gradient(180deg, #ec4899 0%, #db2777 50%, #be185d 100%)'
                              : undefined,
                            border: canAfford ? '1.5px solid #fbcfe8' : '1px solid #71717a',
                            boxShadow: canAfford
                              ? '0 3px 8px rgba(219, 39, 119, 0.4), inset 0 1px 2px rgba(255,255,255,0.7)'
                              : 'none',
                            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                            fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                          }}
                        >
                          <img src={iconHeart} alt="" className="w-3.5 h-3.5 object-contain drop-shadow" />
                          <span>ADOPT</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (canAfford) {
                              onStartPlacing && onStartPlacing(item)
                              onClose()
                            }
                          }}
                          disabled={!canAfford}
                          className={`flex-1 py-1 px-2 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-md active:scale-90 cursor-pointer flex items-center justify-center gap-1.5 ${
                            canAfford
                              ? 'text-white hover:brightness-110 hover:scale-105'
                              : 'bg-zinc-600 text-zinc-300 cursor-not-allowed opacity-60'
                          }`}
                          style={{
                            background: canAfford
                              ? 'linear-gradient(180deg, #34d399 0%, #10b981 40%, #059669 100%)'
                              : undefined,
                            border: canAfford ? '1.5px solid #d1fae5' : '1px solid #71717a',
                            boxShadow: canAfford
                              ? '0 3px 8px rgba(5, 150, 105, 0.4), inset 0 1px 2px rgba(255,255,255,0.7)'
                              : 'none',
                            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                            fontFamily: "'Lilita One', 'Fredoka', sans-serif",
                          }}
                        >
                          <img src={iconAxe} alt="" className="w-3.5 h-3.5 object-contain drop-shadow" />
                          <span>BUILD</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Purchase Success Fanfare Modal ── */}
      {purchaseSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
          <div
            className="relative w-full max-w-sm rounded-3xl p-6 flex flex-col items-center text-center border-4 border-amber-300 shadow-[0_0_50px_rgba(245,158,11,0.5)]"
            style={{
              background: 'radial-gradient(circle at 50% 20%, #451a03 0%, #200a02 100%)',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-purple-500 to-indigo-700 border-2 border-white flex items-center justify-center shadow-xl mb-3 animate-bounce">
              <img
                src={
                  purchaseSuccess.type === 'food'
                    ? dogfoodImg
                    : purchaseSuccess.type === 'coins'
                    ? coinsImg
                    : diamondsImg
                }
                alt=""
                className="w-10 h-10 object-contain drop-shadow"
              />
            </div>

            <h3
              className="font-black text-xl text-amber-200 uppercase tracking-wide mb-1"
              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
            >
              PURCHASE SUCCESSFUL!
            </h3>

            <p className="text-xs text-amber-300/80 mb-3">
              {purchaseSuccess.pricePhp ? (
                <span>Thank you for your purchase of <strong className="text-white">₱{purchaseSuccess.pricePhp}</strong>!</span>
              ) : (
                <span>{purchaseSuccess.name} added to your inventory!</span>
              )}
            </p>

            <div className="px-4 py-2 rounded-2xl bg-black/60 border border-amber-400/50 flex items-center gap-2 mb-5 shadow-inner">
              <img
                src={
                  purchaseSuccess.type === 'food'
                    ? dogfoodImg
                    : purchaseSuccess.type === 'coins'
                    ? coinsImg
                    : diamondsImg
                }
                alt=""
                className="w-5 h-5 object-contain animate-pulse"
              />
              <span
                className="font-black text-lg text-amber-200"
                style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
              >
                {purchaseSuccess.diamonds
                  ? `+${purchaseSuccess.diamonds.toLocaleString()} DIAMONDS`
                  : purchaseSuccess.kibbleReward
                  ? `+${purchaseSuccess.kibbleReward.toLocaleString()} KIBBLE`
                  : `+${(purchaseSuccess.coinsReward || 0).toLocaleString()} COINS`}
              </span>
            </div>

            <button
              onClick={() => setPurchaseSuccess(null)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:brightness-110 border-2 border-white text-amber-950 font-black text-sm uppercase shadow-xl active:scale-95 transition-all cursor-pointer"
              style={{ fontFamily: "'Lilita One', 'Fredoka', sans-serif" }}
            >
              CLAIM & ENJOY!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
