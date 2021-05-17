import styles from './SearchInput.module.css'

export default function SearchInput(props) {
  const { children, className, placeholder, value, onChange } = props;

  return (
    <input
      className={`${styles.container} ${className} flex-grow`}
      placeholder={placeholder}
      onChange={e => onChange(e)}
      value={value}
      data-testid="inputSearch"
    >
      {children}
    </input>
  )
}
