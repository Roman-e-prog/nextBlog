import React from 'react'
import styles from './footer.module.css'
const Footer = () => {
  return (
    <div className={styles.container} data-testid="footer">
        <p className={styles.copyRight}>Copyright 2023 Roman Armin Rostock</p>
    </div>
  )
}

export default Footer