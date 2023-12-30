import React from 'react'
import styles from './spinner.module.css'
const Spinner = () => {
  return (
    <div className={styles.container}>
        <div className={styles.loadingSpinner} data-testid="spinner"></div>
    </div>
  )
}

export default Spinner