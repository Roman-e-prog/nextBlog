"use client"
import React,{useState} from 'react'
import styles from './mobileNavbar.module.css'
import Image from 'next/image'
import {navLinks} from '@/data';
import Link from 'next/link';
import BackgroundToggle from '../backgroundToggle/BackgroundToggle';
import {useSession, signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
const MobileNavbar = () => {
    const session = useSession();
    const router = useRouter();
    const handleLogout = ()=>{
        signOut();
        router.push('/');
    }
    const [menueOpen, setMenueOpen] = useState(false);

    const handleMenue = ()=>{
        if(menueOpen){
            setMenueOpen(false)
        }
        else{
            setMenueOpen(true)
        }
    }
  return (
    <div className={styles.container}>
        <div className={styles.logo}>
            <Link href="/" className='link'>
            <Image src="/images/roman.jpg" alt="Roman Armin Rostock" title="Zurück zur Hauptseite" priority={false} width={110} height={120}/>
            </Link>
        </div>
        <div className={styles.mainNav}>
            <div className={styles.headWrapper}>
                <p className={styles.name}>Roman Armin Rostock</p>
                <BackgroundToggle/>
            </div>
            <hr className={styles.headline} />
            <nav className={styles.nav}>
                <div className={styles.hamburgerWrapper}>
                    <span className="material-symbols-outlined" onClick={handleMenue} style={{fontSize:"50px", cursor:"pointer"}} title="Menü">menu</span>
                </div>
                {menueOpen ?  <ul className={styles.linkList}>
                    {navLinks && navLinks.map((item)=>(
                        <li key={item.id} className={styles.lis}><Link href={item.url} className='link'>{item.text}</Link></li>
                    ))}
                     {session.status === "authenticated" ? <li onClick={handleLogout} className={styles.lis}>Logout</li> : null}
                </ul> : null}
               
            </nav>
        </div>
    </div>
  )
}

export default MobileNavbar