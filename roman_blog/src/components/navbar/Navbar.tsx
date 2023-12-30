"use client"
import React from 'react'
import styles from './navbar.module.css'
import Image from 'next/image'
import {navLinks} from '@/data';
import Link from 'next/link';
import BackgroundToggle from '../backgroundToggle/BackgroundToggle';
import {useSession, signOut} from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
const Navbar = () => {
    const session = useSession();
    const handleLogout = async ()=>{
        await signOut();
        toast.success('Sie wurden erfolgreich ausgeloggt');
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.logo} data-testid="logo">
            <Link href="/" className='link'>
            <Image src="/images/roman.jpg" alt="Roman Armin Rostock" title="Zurück zur Hauptseite" priority={false} width={110} height={120}/>
            </Link>
        </div>
        <div className={styles.mainNav} data-testid="mainNav">
            <div className={styles.headWrapper}>
                <p className={styles.name}>Roman Armin Rostock</p>
                <BackgroundToggle/>
            </div>
            <hr className={styles.headline} />
            <nav className={styles.nav}>
                <ul className={styles.linkList} data-testid="linkList">
                    {navLinks && navLinks.map((item)=>(
                        <li key={item.id} className={styles.lis}><Link href={item.url} className='link'>{item.text}</Link></li>
                    ))}
                     {session.status === "authenticated" ? <li><button className={styles.logoutBtn} type="button" onClick={handleLogout}>Logout</button></li> : null}
                </ul>
            </nav>
        </div>
    </div>
  )
}

export default Navbar