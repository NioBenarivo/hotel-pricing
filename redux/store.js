import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

let store

export const initialState = {
  hotelList: [],
  priceList: [],
  collatedData: [],
  searchInput: '',
  selectedCurrency: "USD"
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_HOTEL_LIST':
      return {
        ...state,
        hotelList: [
          ...action.list
        ]
      }
    case 'SET_PRICE_LIST':
      return {
        ...state,
        priceList: [
          ...action.list
        ]
      }
    case 'SET_COLLATED_DATA':
      return {
        ...state,
        collatedData: [
          ...action.data
        ]
      }
    case 'SET_SELECTED_CURRENCY':
      return {
        ...state,
        selectedCurrency: action.val
      }
    case 'SET_SEARCH_INPUT':
      return {
        ...state,
        searchInput: action.val
      }
    default:
      return state
  }
}

function initStore(preloadedState = initialState) {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  )
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState) {
  // const store = useMemo(() => initializeStore(initialState), [initialState])
  const store = initializeStore(initialState)
  return store
}