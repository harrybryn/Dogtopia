import React, { createContext, useContext, useReducer } from 'react'

const initialState = { dogs: [] }

function dogReducer(state, action) {
  switch (action.type) {
    default:
      return state
  }
}

const DogContext = createContext(null)

export function DogProvider({ children }) {
  const [state, dispatch] = useReducer(dogReducer, initialState)
  return (
    <DogContext.Provider value={{ state, dispatch }}>
      {children}
    </DogContext.Provider>
  )
}

export function useDogs() {
  return useContext(DogContext)
}

