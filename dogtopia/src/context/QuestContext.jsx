import React, { createContext, useContext, useReducer } from 'react'

const initialState = { quests: [], completed: [] }

function questReducer(state, action) {
  switch (action.type) {
    default:
      return state
  }
}

const QuestContext = createContext(null)

export function QuestProvider({ children }) {
  const [state, dispatch] = useReducer(questReducer, initialState)
  return (
    <QuestContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestContext.Provider>
  )
}

export function useQuests() {
  return useContext(QuestContext)
}

