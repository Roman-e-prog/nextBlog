import React, { useContext } from 'react'
import styles from './backgroundToggle.module.css'
import {ThemeContext} from '../context/ThemeContext'
import 'material-symbols';
const BackgroundToggle = () => {
    const context = useContext(ThemeContext)
    if (context === null) {
        // Handle the case where the context is not provided
        return null;
      }
        const {mode, toggle} = context
  return (
    <div className={styles.toggleContainer} onClick={toggle}>
        <div className={styles.icon}><span className='material-symbols-outlined' style={{color:"yellow", fontSize:"16px"}}>Light_Mode</span></div>
        <div className={styles.icon}><span className='material-symbols-outlined' style={{color:"blue", fontSize:"16px"}}>Dark_Mode</span></div>
        <div className={styles.toggleBtn} style={mode=== "dark" ?{left:"2px"}: {right:"2px"}}></div>
    </div>
  )
}

export default BackgroundToggle