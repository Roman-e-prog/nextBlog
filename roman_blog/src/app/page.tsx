import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
        <div className={styles.frontImage}>
          <img src="/images/programming.jpg" alt="Computer mit Code" title='Programmierblog' className={styles.image}/>
        </div>
        <div className={styles.greeting}>
          <h1 className={styles.heading}>Programmieren für Ü 40</h1>
          <p className={styles.bloggerName}>Ein Blog von Roman Armin Rostock</p>
        </div>
    </main>
  )
}
