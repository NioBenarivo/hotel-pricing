import { useState } from 'react'
import styles from './Dropdown.module.css'
import { IoIosArrowDropdown } from "react-icons/io"

export default function Dropdown(props) {
  const { children, className, selectedCurrency, onSelect } = props;
  const [isOpen, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!isOpen);
  const handleClick = val => {
    onSelect(val)
    setOpen(!isOpen)
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header} onClick={toggleDropdown}>
        {selectedCurrency ? children.find(child => child === selectedCurrency) : "Select your currency"}
        <IoIosArrowDropdown size={16} style={{ transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: '0.2s ease-in-out'}} />
      </div>
      {
        isOpen ? 
        <div className={styles.body}>
          {children.map((child, index) => (
            <div key={index} className={`${styles.item}`} onClick={() => handleClick(child)}>
              {child}
            </div>
          ))}
        </div> : ''
      }
    </div>
  )
}
