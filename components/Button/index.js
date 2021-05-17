import styles from './Button.module.css'

export default function Button(props) {
  const { children, primary, submit } = props;
  const primaryClass = primary ? styles.primary : '';

  return (
    <button 
      className={`${styles.btn} ${primaryClass}`} 
      type={submit ? 'submit' : 'button'}
    >
      {children}
    </button>
  )
}
