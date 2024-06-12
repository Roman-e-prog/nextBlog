import React from 'react'
import styles from './page.module.css'
import { UeberMichDocument } from '@/models/UeberMich'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const getData = async()=>{
   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ueberMich/`, {cache:'no-store'})
   if(!res.ok){
    throw new Error("Keine Daten")
   }
   return res.json();
}
const Uebermich = async () => {
  const data = await getData();
  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h1 className={styles.headline}>Zu meiner Person</h1>
      </div>
      <div className={styles.ueberMichWrapper}>
        {data ? data.map((item:UeberMichDocument)=>(
          <div className={styles.contentWrapper} key={item._id}>
          <p className={styles.content}>{item.myPerson}</p>
          </div>
        )):null}
      </div>
    </div>
  )
}

export default Uebermich