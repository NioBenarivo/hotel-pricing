import { useEffect, useState } from 'react'
import Head from 'next/head'
import Button from '@components/Button'
import SearchInput from '@components/SearchInput'
import Dropdown from '@components/Dropdown'
import HotelCard from '@components/HotelCard'
import styles from '../styles/Home.module.css'
import { useHotelList } from '../redux/action'

const currencies = ["USD", "SGD", "CNY", "KRW"]
const domain = 'https://5df9cc6ce9f79e0014b6b3dc.mockapi.io/hotels'

export default function Home() {
  const { 
    hotelList,
    collatedData,
    selectedCurrency,
    searchInput,
    setHotelList, 
    setPriceList,
    setCollatedData,
    setSelectedCurrency,
    setSearchInput,
  } = useHotelList()
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSelectCurrency = val => {
    setSelectedCurrency(val);
  }

  const handleSearchInput = e => {
    setSearchInput(e.target.value);
  }

  const getFetchData = async url => {
    if (searchInput && searchInput.length > 0 && selectedCurrency) {
      try {
        setLoading(true)
        const res = await fetch(url)
        if (res.status && res.status >= 400) {
          setLoading(false)
          setErrorMsg('Search Not Found. Please try again.')
          setCollatedData([])
          return
        }

        if (res.status && res.status === 200) {
          setLoading(false)
          setErrorMsg(null)
          const json = await res.json()
          return json
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (errorMsg !== null) setErrorMsg(null)
    }, 3000)

    return () => {
      clearTimeout(timeout);
    }
  }, [errorMsg])

  useEffect(async () => {
    const newPrices = await getFetchData(`${domain}/${searchInput}/1/${selectedCurrency}`)
    if (newPrices === undefined) return;
    if (hotelList && newPrices !== undefined && hotelList.length > 0 && newPrices.length > 0) {
      let merged = [];

      for (let i = 0; i < hotelList.length; i++) {
        merged.push({
          ...hotelList[i], 
          ...(newPrices.find((price) => price.id === hotelList[i].id))}
        );
      }

      const mergedList = merged.sort((a, b) => a.price - b.price)
      setCollatedData(mergedList)
    }
  }, [selectedCurrency])

  const btnProps = {
    submit: true,
    primary: true,
  }

  const searchProps = {
    placeholder: 'Search Hotel here',
    className: 'mr1',
    value: searchInput,
    onChange: handleSearchInput
  }

  const dropdownProps = {
    selectedCurrency,
    children: currencies,
    className: 'mr1',
    onSelect: handleSelectCurrency
  }

  const handleSubmit = async e => {
    e.preventDefault();
  
    const hotels = await getFetchData(`${domain}/${searchInput}`)
    const prices = await getFetchData(`${domain}/${searchInput}/1/${selectedCurrency}`)

    if (hotels && Array.isArray(prices) && hotels.length > 0 && prices.length > 0) {
      let merged = [];

      for (let i = 0; i < hotels.length; i++) {
        merged.push({
          ...hotels[i], 
          ...(prices.find((price) => price.id === hotels[i].id))}
        );
      }

      const mergedList = merged.sort((a, b) => a.price - b.price)
      setHotelList(hotels)
      setPriceList(prices)
      setCollatedData(mergedList)
    }
  }
  
  const renderHotelCards = () => {
    if (loading) {
      return <div>Loading...</div>
    }

    return collatedData.length > 0 && collatedData.map((hotel, index) => {
      const cardProps = {
        ...hotel,
        selectedCurrency
      }

      return (
        <HotelCard key={index} data={cardProps} />
      )
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Hotel currency and price competitive test</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <SearchInput {...searchProps} />
        <Dropdown {...dropdownProps} />
        <Button {...btnProps}>Search</Button>
      </form>
      <div className={`${styles.errorBox} ${errorMsg ? styles.show : styles.hide}`}>
        {errorMsg}
      </div>
      <div>{renderHotelCards()}</div>
    </div>
  )
}
