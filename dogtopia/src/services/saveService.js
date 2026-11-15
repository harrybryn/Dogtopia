// saveService.js – local/cloud save and load helpers stub
const SAVE_KEY = 'dogtopia_save'

export function saveGame(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY)
}

