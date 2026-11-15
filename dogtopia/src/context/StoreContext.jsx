import React, { createContext, useContext, useReducer } from 'react'

const initialState = { cart: [], isOpen: false }

function storeReducer(state, action) {
  switch (action.type) {
    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState)
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}

