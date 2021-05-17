import { useState } from 'react'
import { IoIosStar, IoIosInformationCircleOutline } from "react-icons/io"
import { FaDollarSign, FaWonSign, FaYenSign, } from "react-icons/fa";
import { IoCaretDownOutline } from "react-icons/io5";
import styles from './HotelCard.module.css'

export default function HotelCard(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [taxFeePopup, setTaxFeePopup] = useState(false);
  const { data } = props;
  const { 
    address,
    competitors, 
    description, 
    name, 
    photo, 
    price, 
    rating,
    selectedCurrency,
    stars, 
    taxes_and_fees
  } = data

  const getRatingStyle = rate => {
    if (rate < 7) {
        return 'secondary'
    } else if (rate < 4) {
      return 'alert'
    } else {
      return 'complimentary'
    }
  }

  const renderCurrencyIcon = currency => {
    const size = 12;
    switch (currency) {
      case 'USD':
        return <span><FaDollarSign size={size} /></span>
      case 'SGD':
        return <span>S<FaDollarSign size={size} /></span>
      case 'CNY':
        return <span><FaYenSign size={size} /></span>
      case 'KRW':
        return <span><FaWonSign size={size} /></span>
    }
  }

  const openMap = (e, addr) => {
    e.stopPropagation();
    window.open(`https://maps.google.com/?q=${addr}`, '_blank');
  }

  const handleOpenList = e => {
    e.stopPropagation();
    setOpenList(!openList)
  }

  const handleHover = () => {
    setTaxFeePopup(true)
  }

  const handleLeave = () => {
    setTaxFeePopup(false)
  }

  const renderStars = () => {
    let starsArr = [];
    for (let i = 0; i < stars; i++) {
      starsArr.push(<IoIosStar key={i} size={16} />);
    }

    return <div className="flex mb05">{starsArr}</div>
  }

  const calcDisc = (a, b) => {
    if (isNaN(a) || isNaN(b)){
       return;
    }
    return a-b === 0 ? 0 : Math.round(100 * Math.abs(( a - b ) / b)) || 'input error';
  }

  const saveRate = (compPrice) => {
    return calcDisc(price, compPrice)
  } 

  const renderCompetitors = () => {
    if (!competitors || Object.keys(competitors).length <= 0) return <p>No price to compare</p>;

    const newCompList = {
      ...competitors,
      ...price && { AscendaHotel: price}
    }

    const newCompValues = Object.values(newCompList);
    const newCompKeys = Object.keys(newCompList);
    const newCompKeysLength = newCompKeys.length;

    if (newCompKeysLength > 3) {
      return (
        <div className="relative">
          <span className={`flex items-center ${styles['competitor-dropdown']}`} onClick={e => handleOpenList(e)}>
            Compare {newCompKeysLength} prices
            <IoCaretDownOutline size={12} style={{marginTop: '0.2em'}} />
          </span>
          {
            openList ? 
            <ul className={styles['competitor-list']}>
              {
                newCompKeys
                  .sort((a,b) => newCompList[a] - newCompList[b])
                  .map((comp, index) => {
                  const highestRate =  Math.max(...newCompValues)
                  const strikeThroughClass = highestRate === newCompList[comp] ? styles.strikeThrough : ''
                  const saveRates = `(Save ${saveRate(newCompList[comp])}% with us!)`;
                  return (
                    <li
                      data-testid="priceItemList"
                      className={comp === 'AscendaHotel' ? styles.highlight : strikeThroughClass} 
                      key={index}
                    >
                      {comp}: {renderCurrencyIcon(selectedCurrency)}{newCompList[comp]}{' '}
                      {
                        comp !== 'AscendaHotel' && 
                        highestRate !== newCompList[comp] && 
                        price < newCompList[comp] &&
                        <span className={styles.disc} data-testid="saveRates">{saveRates}</span>
                      }
                    </li>
                  )})
              }
            </ul> : ''
          }
        </div>
      )
    } else {
      return (
        <div className="flex">
          {
            newCompKeys
              .sort((a,b) => newCompList[a] - newCompList[b])
              .map((comp, index) => {
              return <div className="pr1" key={index}>{comp}: <br />{renderCurrencyIcon(selectedCurrency)}{newCompList[comp]}</div>
            })
          }
        </div>
      ) 
    }
  }

  return (
    <div className={styles.container} onClick={() => setIsOpen(!isOpen)} data-testid="hotelContainer">
      <div className="flex">
        <div className={styles.imgContainer}>
          <img className={isOpen ? styles.expand : ''} src={photo} />
        </div>
        <div className={styles.body}>
          <h2>{name}</h2>
          {renderStars()}
          <p onClick={e => openMap(e, address)} className={styles.link}>{address}</p>
          {renderCompetitors()}
        </div>
        <div className={styles.rates}>
          <h3>Rating:</h3>
          <p className={`${styles.rating} ${getRatingStyle(rating)}`}>{rating}</p>
          <h3>Price:</h3>
          <div className="flex items-center">
            {
              price ? 
              <>
                {renderCurrencyIcon(selectedCurrency)}
                <span>{price}</span>
              </>
              :
              <span>Rates Unavailable</span>
            }
            {
              taxes_and_fees ? 
              <span className="relative">
                <span data-testid="taxInfo" onMouseOver={handleHover} onMouseLeave={handleLeave}>
                  <IoIosInformationCircleOutline size={12}/>
                </span>
                {
                  taxFeePopup ? 
                  <div className={styles.taxFee} data-testid="taxInfoDetail">
                    This price is tax-inclusive.<br />
                    Tax: {taxes_and_fees.tax}<br/>
                    Hotel Fees: {taxes_and_fees.hotel_fees}
                  </div> 
                  : ''
                }
              </span> : ''
            }
          </div>
        </div>
      </div>
      {
        isOpen ? 
        <div className={styles.details}>
          <h3>Overview</h3>
          <span dangerouslySetInnerHTML={{ __html: description }} />
        </div> : ''
      }
    </div>
  )
}
