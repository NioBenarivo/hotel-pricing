import { useSelector, useDispatch } from 'react-redux'

export const useHotelList = () => {
  const dispatch = useDispatch()
  const hotelList = useSelector((state) => state.hotelList)
  const priceList = useSelector((state) => state.priceList)
  const collatedData = useSelector((state) => state.collatedData)
  const selectedCurrency = useSelector((state) => state.selectedCurrency)
  const searchInput = useSelector((state) => state.searchInput)
  const setHotelList = list => {
    dispatch({
      type: 'SET_HOTEL_LIST',
      list
    })
  }

  const setPriceList = list => {
    dispatch({
      type: 'SET_PRICE_LIST',
      list
    })
  }

  const setCollatedData = data => {
    dispatch({
      type: 'SET_COLLATED_DATA',
      data
    })
  }

  const setSelectedCurrency = val => {
    dispatch({
      type: 'SET_SELECTED_CURRENCY',
      val
    })
  }

  const setSearchInput = val => {
    dispatch({
      type: 'SET_SEARCH_INPUT',
      val
    })
  }

  return { 
    hotelList,
    priceList,
    collatedData,
    selectedCurrency,
    searchInput,
    setHotelList,
    setPriceList,
    setCollatedData,
    setSelectedCurrency,
    setSearchInput
  }
}
