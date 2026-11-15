import React, { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'puppal_dogtopia_save_v1'

export const createDefaultGardenPark = (now = Date.now()) => ({
  id: 'hab_starter_garden',
  type: 'habitat',
  habitatId: 'garden-park',
  name: 'Garden Park',
  col: 11,
  row: 9,
  size: { w: 3, h: 3 },
  dogs: [
    {
      id: 'dog_starter_bulldog',
      breedId: 'english-bulldog',
      name: 'Winston',
      level: 1,
      feedProgress: 0,
      feedRequired: 4,
      stage: 'Puppy',
      element: 'Garden Element',
      category: 'Garden Element',
      habitatId: 'garden-park',
      habitatName: 'Garden Park',
      adoptedAt: now,
    },
  ],
  coinsAccumulated: 0,
  maxCoins: 1000,
  readyToCollect: false,
  lastCollectTime: now,
  underConstruction: false,
  constructionDuration: 0,
  constructionEndsAt: null,
})

export const createDefaultOasis = createDefaultGardenPark

const defaultState = {
  // Currencies (original naming based on GameConcept.txt)
  coins: 5000,          // Starter Paw Coins
  gold: 5000,           // Backwards compatibility
  crystals: 25,         // Starter Star Crystals
  gems: 25,             // Backwards compatibility
  kibble: 1000,         // Food / Kibble treats (Cherries equivalent)
  level: 1,             // Early stage Level 1 (Garden Park + Bulldog unlocked, others locked!)
  xp: 0,
  maxXp: 500,
  gridVisible: false,   // Grid lines hidden by default (shown dynamically during habitat moving / placement)
  gridV2: true,         // Big island grid system v2

  // Starts with default Garden Park habitat under 30-second construction
  placedHabitats: [createDefaultGardenPark()],

  // Active tasks from GameConcept.txt
  tasks: [
    { id: 'task-1', type: 'Feed', desc: 'Feed dogs basic kibble', rewardCoins: 350, rewardXp: 120, done: false },
    { id: 'task-2', type: 'Bath', desc: 'Scrub dog at the oasis pond', rewardCoins: 500, rewardXp: 180, done: false },
    { id: 'task-3', type: 'Play', desc: 'Throw a bone for Basenji', rewardCoins: 400, rewardXp: 150, done: false },
    { id: 'task-4', type: 'Refill', desc: 'Refill stone water station', rewardCoins: 200, rewardXp: 80, done: false },
    { id: 'task-5', type: 'Groom', desc: 'Brush Pharaoh Hound coat', rewardCrystals: 5, rewardXp: 250, done: false },
  ],
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      let habitats = parsed.placedHabitats || []

      // Clean legacy clutter
      habitats = habitats.filter(
        (h) => h.id !== 'water-starter' && h.id !== 'palm-decor-1'
      )

      // Ensure default Garden Park starter exists if player has no habitats
      if (habitats.length === 0) {
        habitats = [createDefaultGardenPark()]
      }

      // If player was on test level 18, reset to early stage Level 1
      if (parsed.level === 18) {
        parsed.level = 1
        parsed.xp = 0
        parsed.maxXp = 500
      }

      // Upgrade any starter habitats and legacy dog data to Garden Park & clean Habitat Elements
      const seenDogIds = new Set()
      habitats.forEach(h => {
        if (h.id === 'hab_starter_oasis' || h.id === 'hab_starter_garden') {
          h.habitatId = 'garden-park'
          h.name = 'Garden Park'
        }

        if (Array.isArray(h.dogs)) {
          h.dogs = h.dogs.map((d, dIdx) => {
            const raw = typeof d === 'string' ? { name: d, breedId: 'english-bulldog' } : (d || {})
            let dogId = raw.id
            if (!dogId || typeof dogId !== 'string' || seenDogIds.has(dogId) || dogId === 'english-bulldog' || dogId === 'arctic-husky') {
              dogId = dIdx === 0 && (h.id === 'hab_starter_garden' || h.id === 'hab_starter_oasis')
                ? 'dog_starter_bulldog'
                : `dog_${h.id}_${dIdx}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
            }
            seenDogIds.add(dogId)

            let elem = raw.element || raw.category
            let habId = raw.habitatId
            let habName = raw.habitatName
            const level = Math.max(1, Number(raw.level) || 1)
            const feedProgress = Math.max(0, Math.min(3, Number(raw.feedProgress) || 0))
            const stage = level >= 12 ? 'Adult' : (level >= 4 ? 'Young' : 'Puppy')

            if (raw.breedId === 'english-bulldog') {
              elem = 'Garden Element'
              habId = 'garden'
              habName = 'Garden Park'
            } else if (!elem || elem.includes('Native') || elem.includes('Breed') || elem.includes('Companion') || elem.includes('Universal')) {
              if (raw.habitatId === 'desert' || raw.breedId === 'german-shepherd' || raw.breedId === 'pharaoh-hound') {
                elem = 'Desert Element'
                habId = 'desert'
                habName = 'Desert Oasis'
              } else if (raw.habitatId === 'garden' || raw.breedId === 'toy-pug' || raw.breedId === 'japanese-shiba') {
                elem = 'Garden Element'
                habId = 'garden'
                habName = 'Garden Park'
              } else if (raw.habitatId === 'snow' || raw.breedId === 'arctic-husky' || raw.breedId === 'white-samoyed') {
                elem = 'Snow Element'
                habId = 'snow'
                habName = 'Snowy Peak'
              } else if (raw.habitatId === 'forest' || raw.breedId === 'hunting-beagle' || raw.breedId === 'golden-retriever') {
                elem = 'Forest Element'
                habId = 'forest'
                habName = 'Forest Meadow'
              } else if (raw.habitatId === 'beach' || raw.breedId === 'yellow-labrador') {
                elem = 'Beach Element'
                habId = 'beach'
                habName = 'Beach Cove'
              } else if (raw.habitatId === 'legendary' || raw.breedId === 'galaxy-astral-pup' || raw.breedId === 'cerberus-pup') {
                elem = 'Legendary Element'
                habId = 'legendary'
                habName = 'Legendary Realm'
              }
            }
            return {
              ...raw,
              id: dogId,
              name: raw.name || (dIdx === 0 ? 'Winston' : `Bulldog #${dIdx + 1}`),
              category: elem || 'Garden Element',
              element: elem || 'Garden Element',
              habitatId: habId || h.habitatId || 'garden-park',
              habitatName: habName || h.name || 'Garden Park',
              level,
              feedProgress,
              feedRequired: 4,
              stage,
            }
          })
        }
      })

      // If no habitat has any dog, ensure the first habitat has Winston the English Bulldog
      const hasAnyDog = habitats.some(h => Array.isArray(h.dogs) && h.dogs.length > 0)
      if (!hasAnyDog && habitats.length > 0) {
        habitats[0].dogs = [
          {
            id: 'dog_starter_bulldog',
            breedId: 'english-bulldog',
            name: 'Winston',
            level: 1,
            feedProgress: 0,
            feedRequired: 4,
            stage: 'Puppy',
            element: 'Garden Element',
            category: 'Garden Element',
            habitatId: habitats[0].habitatId || 'garden-park',
            habitatName: habitats[0].name || 'Garden Park',
            adoptedAt: Date.now(),
          },
        ]
      }

      // Ensure decor, facilities, and empty habitats do not accumulate coins or show bubbles
      habitats.forEach(h => {
        const isDogfoodFactory = h.habitatId === 'dogfood-factory' || h.name === 'Dogfood Factory'
        if (isDogfoodFactory) {
          h.type = 'facility'
          h.maxDogfood = h.maxDogfood || 300
          if (typeof h.dogfoodAccumulated !== 'number') {
            h.dogfoodAccumulated = 60
          }
          h.readyToCollectDogfood = h.dogfoodAccumulated >= 25
          h.maxCoins = 0
          h.coinsAccumulated = 0
          h.readyToCollect = false
          return
        }

        const isTrueHabitat = (h.type || 'habitat') === 'habitat' && !['golden-palm', 'bone-sign', 'water-station', 'breeding-den', 'dogfood-factory'].includes(h.habitatId)
        if (!isTrueHabitat) {
          h.type = h.type || (h.habitatId === 'golden-palm' || h.habitatId === 'bone-sign' ? 'decor' : 'facility')
          h.maxCoins = 0
          h.coinsAccumulated = 0
          h.readyToCollect = false
        } else if (!Array.isArray(h.dogs) || h.dogs.length === 0) {
          h.coinsAccumulated = 0
          h.readyToCollect = false
        }
      })

      return { ...defaultState, ...parsed, placedHabitats: habitats }
    }
  } catch (err) {
    console.warn('Failed to load saved state, using default', err)
  }
  return defaultState
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'PLACE_HABITAT': {
      const { habitat } = action.payload
      const costCoins = habitat.cost?.coins || 0
      const costCrystals = habitat.cost?.crystals || 0

      if (state.coins < costCoins || state.crystals < costCrystals) {
        return state
      }

      const nextCoins = state.coins - costCoins
      const nextCrystals = state.crystals - costCrystals
      const now = Date.now()

      const isDogfoodFactory = habitat.id === 'dogfood-factory' || habitat.name === 'Dogfood Factory'
      const isRealHabitat = (habitat.type || 'habitat') === 'habitat' && !['golden-palm', 'bone-sign', 'water-station', 'breeding-den', 'dogfood-factory'].includes(habitat.id)
      const maxCoins = isRealHabitat ? (Number(habitat.maxCoins) || 800) : 0
      const maxDogfood = isDogfoodFactory ? (Number(habitat.maxDogfood) || 300) : 0

      const newBuilding = {
        id: 'hab_' + now,
        type: isRealHabitat ? 'habitat' : 'facility',
        habitatId: habitat.id,
        name: habitat.name,
        col: habitat.col,
        row: habitat.row,
        size: habitat.size || { w: 3, h: 3 },
        dogs: [], // Always start with NO DOGS when buying a habitat!
        coinsAccumulated: 0,
        maxCoins: maxCoins,
        dogfoodAccumulated: isDogfoodFactory ? 75 : 0, // starts with fresh starter kibble!
        maxDogfood: maxDogfood,
        readyToCollect: false,
        readyToCollectDogfood: isDogfoodFactory ? true : false,
        lastCollectTime: now,
        underConstruction: true,
        constructionDuration: 15, // 15-second construction timer
        constructionEndsAt: now + 15 * 1000,
      }

      return {
        ...state,
        coins: nextCoins,
        gold: nextCoins,
        crystals: nextCrystals,
        gems: nextCrystals,
        xp: state.xp + 150,
        placedHabitats: [...state.placedHabitats, newBuilding],
      }
    }

    case 'COMPLETE_CONSTRUCTION': {
      const { id } = action.payload
      return {
        ...state,
        xp: state.xp + 50,
        placedHabitats: state.placedHabitats.map(h =>
          h.id === id ? { ...h, underConstruction: false, constructionEndsAt: null } : h
        ),
      }
    }

    case 'BUY_DOG_FOR_HABITAT': {
      const { habitatId, dog } = action.payload
      const target = state.placedHabitats.find(h => h.id === habitatId)
      if (!target) return state

      // Enforce max 4 dogs per habitat
      if ((target.dogs?.length || 0) >= 4) return state
      if (target.underConstruction) return state

      const costCoins = dog.cost?.coins || 0
      const costCrystals = dog.cost?.crystals || 0
      if (state.coins < costCoins || state.crystals < costCrystals) return state

      const nextCoins = state.coins - costCoins
      const nextCrystals = state.crystals - costCrystals

      const newDog = {
        id: 'dog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        breedId: dog.id,
        name: dog.name,
        habitatId: dog.habitatId,
        habitatName: dog.habitatName,
        category: dog.category || dog.element || 'Garden Element',
        element: dog.category || dog.element || 'Garden Element',
        level: 1,
        feedProgress: 0,
        feedRequired: 4,
        stage: 'Puppy',
        image: dog.image,
        imageIcon: dog.imageIcon,
        adoptedAt: Date.now(),
      }

      return {
        ...state,
        coins: nextCoins,
        gold: nextCoins,
        crystals: nextCrystals,
        gems: nextCrystals,
        xp: state.xp + 100,
        placedHabitats: state.placedHabitats.map(h =>
          h.id === habitatId
            ? { ...h, dogs: [...(h.dogs || []), newDog] }
            : h
        ),
      }
    }

    case 'FEED_DOG': {
      const { habitatId, dogId } = action.payload || {}
      let targetHab = state.placedHabitats.find(h => {
        if (habitatId && h.id === habitatId) return true
        return Array.isArray(h.dogs) && h.dogs.some(d => d.id === dogId)
      })

      if (!targetHab) {
        targetHab = state.placedHabitats.find(h => Array.isArray(h.dogs) && h.dogs.length > 0)
      }
      if (!targetHab || !Array.isArray(targetHab.dogs) || targetHab.dogs.length === 0) {
        return state
      }

      const targetDog = targetHab.dogs.find(d => d.id === dogId) || targetHab.dogs[0]
      if (!targetDog) return state

      const curLevel = Math.max(1, Number(targetDog.level) || 1)
      const feedCost = Math.round(15 + Math.pow(curLevel, 1.25) * 8)

      // Kibble validation
      if ((state.kibble || 0) < feedCost) {
        return state
      }

      const nextKibble = state.kibble - feedCost
      const nextFeedProgress = (Number(targetDog.feedProgress) || 0) + 1
      const leveledUp = nextFeedProgress >= 4
      const nextLevel = leveledUp ? curLevel + 1 : curLevel
      const finalFeedProgress = leveledUp ? 0 : nextFeedProgress
      const nextStage = nextLevel >= 12 ? 'Adult' : (nextLevel >= 4 ? 'Young' : 'Puppy')

      const coinsReward = Math.round(25 + curLevel * 35)
      const xpReward = leveledUp
        ? Math.round(15 + curLevel * 20) + Math.round(60 + curLevel * 65)
        : Math.round(15 + curLevel * 20)

      const nextTrainerXp = (state.xp || 0) + xpReward
      const maxXp = state.maxXp || 500
      const trainerLeveledUp = nextTrainerXp >= maxXp
      const finalTrainerXp = trainerLeveledUp ? nextTrainerXp - maxXp : nextTrainerXp
      const finalTrainerLevel = trainerLeveledUp ? (state.level || 1) + 1 : (state.level || 1)
      const finalMaxXp = trainerLeveledUp ? Math.floor(maxXp * 1.3) : maxXp

      const updatedHabitats = state.placedHabitats.map(h => {
        if (h.id !== targetHab.id) return h
        return {
          ...h,
          dogs: h.dogs.map(d => {
            if (d.id !== targetDog.id) return d
            return {
              ...d,
              level: nextLevel,
              feedProgress: finalFeedProgress,
              feedRequired: 4,
              stage: nextStage,
            }
          }),
        }
      })

      return {
        ...state,
        kibble: nextKibble,
        coins: (state.coins || 0) + coinsReward,
        gold: (state.gold || 0) + coinsReward,
        xp: finalTrainerXp,
        level: finalTrainerLevel,
        maxXp: finalMaxXp,
        placedHabitats: updatedHabitats,
      }
    }

    case 'MOVE_HABITAT': {
      const { id, col, row } = action.payload
      return {
        ...state,
        placedHabitats: state.placedHabitats.map(h =>
          h.id === id ? { ...h, col, row } : h
        ),
      }
    }

    case 'REMOVE_HABITAT': {
      const { id } = action.payload
      return {
        ...state,
        placedHabitats: state.placedHabitats.filter(h => h.id !== id),
      }
    }

    case 'SELL_DOG': {
      const { dogId, refundCoins = 500 } = action.payload
      return {
        ...state,
        coins: state.coins + refundCoins,
        gold: state.gold + refundCoins,
        placedHabitats: state.placedHabitats.map(h => ({
          ...h,
          dogs: (h.dogs || []).filter(d => d.id !== dogId),
        })),
      }
    }

    case 'MOVE_DOG': {
      const { dogId, targetHabitatId } = action.payload
      let dogToMove = null
      const removed = state.placedHabitats.map(h => {
        const d = (h.dogs || []).find(item => item.id === dogId)
        if (d) {
          dogToMove = { ...d, habitatId: targetHabitatId }
        }
        return {
          ...h,
          dogs: (h.dogs || []).filter(item => item.id !== dogId),
        }
      })
      if (!dogToMove) return state

      return {
        ...state,
        placedHabitats: removed.map(h =>
          h.id === targetHabitatId
            ? { ...h, dogs: [...(h.dogs || []), dogToMove] }
            : h
        ),
      }
    }

    case 'COLLECT_HABITAT_COINS': {
      const { id } = action.payload
      const target = state.placedHabitats.find(h => h.id === id)
      if (!target || target.coinsAccumulated <= 0) return state

      const amount = target.coinsAccumulated
      return {
        ...state,
        coins: state.coins + amount,
        gold: state.gold + amount,
        placedHabitats: state.placedHabitats.map(h =>
          h.id === id ? { ...h, coinsAccumulated: 0, readyToCollect: false, lastCollectTime: Date.now() } : h
        ),
      }
    }

    case 'COLLECT_DOGFOOD': {
      const { id } = action.payload
      const target = state.placedHabitats.find(h => h.id === id)
      if (!target || !target.dogfoodAccumulated || target.dogfoodAccumulated <= 0) return state

      const amount = target.dogfoodAccumulated
      return {
        ...state,
        kibble: (state.kibble || 0) + amount,
        placedHabitats: state.placedHabitats.map(h =>
          h.id === id
            ? {
                ...h,
                dogfoodAccumulated: 0,
                readyToCollectDogfood: false,
                lastCollectTime: Date.now(),
              }
            : h
        ),
      }
    }

    case 'TICK_INCOME': {
      // Accumulate coins over time for habitats, AND fresh dogfood for Dogfood Factory!
      return {
        ...state,
        placedHabitats: state.placedHabitats.map(h => {
          // Dogfood Factory automatic production
          if (h.habitatId === 'dogfood-factory' || h.name === 'Dogfood Factory') {
            if (h.underConstruction) return h
            const maxFood = h.maxDogfood || 300
            const currentFood = h.dogfoodAccumulated || 0
            if (currentFood >= maxFood) {
              return { ...h, readyToCollectDogfood: true }
            }
            const addFood = Math.min(maxFood - currentFood, 25)
            const nextFood = currentFood + addFood
            return {
              ...h,
              dogfoodAccumulated: nextFood,
              readyToCollectDogfood: nextFood >= 25,
            }
          }

          if (h.type !== 'habitat' || !h.maxCoins || h.maxCoins <= 0) return h
          // Must have resident dogs to produce coins (Dragon City rules)
          if (!Array.isArray(h.dogs) || h.dogs.length === 0) {
            return { ...h, coinsAccumulated: 0, readyToCollect: false }
          }
          // Compute income rate based on resident dogs' levels
          const dogRateSum = h.dogs.reduce((sum, d) => sum + (30 + (Number(d.level) || 1) * 15), 0)
          const add = Math.min(h.maxCoins - h.coinsAccumulated, Math.max(25, Math.round(dogRateSum / 4)))
          const nextCoins = h.coinsAccumulated + add
          return {
            ...h,
            coinsAccumulated: nextCoins,
            readyToCollect: nextCoins >= Math.floor(h.maxCoins * 0.35),
          }
        }),
      }
    }

    case 'COMPLETE_TASK': {
      const { taskId } = action.payload
      const task = state.tasks.find(t => t.id === taskId)
      if (!task || task.done) return state

      const rewardCoins = task.rewardCoins || 0
      const rewardXp = task.rewardXp || 0
      const rewardCrystals = task.rewardCrystals || 0
      const nextXp = state.xp + rewardXp
      const leveledUp = nextXp >= state.maxXp

      return {
        ...state,
        coins: state.coins + rewardCoins,
        gold: state.gold + rewardCoins,
        crystals: state.crystals + rewardCrystals,
        gems: state.gems + rewardCrystals,
        xp: leveledUp ? nextXp - state.maxXp : nextXp,
        level: leveledUp ? state.level + 1 : state.level,
        maxXp: leveledUp ? Math.floor(state.maxXp * 1.3) : state.maxXp,
        tasks: state.tasks.map(t => (t.id === taskId ? { ...t, done: true } : t)),
      }
    }

    case 'TOGGLE_GRID': {
      return {
        ...state,
        gridVisible: !state.gridVisible,
      }
    }

    case 'SET_GRID_VISIBLE': {
      return {
        ...state,
        gridVisible: Boolean(action.payload),
      }
    }

    case 'ADD_CURRENCY': {
      const { coins = 0, crystals = 0, kibble = 0, xp = 0 } = action.payload
      return {
        ...state,
        coins: state.coins + coins,
        gold: state.gold + coins,
        crystals: state.crystals + crystals,
        gems: state.gems + crystals,
        kibble: state.kibble + kibble,
        xp: state.xp + xp,
      }
    }

    default:
      return state
  }
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, loadInitialState)

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (err) {
      // ignore
    }
  }, [state])

  // Periodic passive coin accumulation for habitats
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'TICK_INCOME' })
    }, 12000)
    return () => clearInterval(timer)
  }, [])

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}
