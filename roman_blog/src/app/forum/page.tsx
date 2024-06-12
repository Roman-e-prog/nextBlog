import React from 'react'
import styles from './page.module.css'
import { ForumLinks } from '@/data';
import Link from 'next/link';
import { ForumThemesDocument } from '@/models/ForumThemes';
import { getServerSession } from "next-auth";
import { authOptions } from '@/utils/authoptions';
export const dynamic = "force-dynamic"; // this both was the solution for prerendering error on build command
export const fetchCache = "force-no-store";
async function getData(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forumThemes/`, {cache:'no-store'});

  if(!res.ok){
    throw new Error("Keine Antwort")
  }
  return res.json()
}
const Forum = async () => {
  const session = await getServerSession(authOptions);
  //@ts-ignore
    const user = session?.user;
  const data = await getData();
  return (
    <div className={styles.container}>
      <div className={styles.linklistWrapper}>
        <ul className={styles.linklist}>
          {ForumLinks ? ForumLinks.map((item)=>(
            <li className={styles.listPoints} key={item.id}><Link href={`/forum/${item.ressort}`} className='link'>{item.text}</Link></li>
          )):null}
           {user ? <li className={styles.accountLink} data-testid="accountLink"><Link href={`/account/${user._id}`} className='link' title="Zu Ihrem Account">{user.username}</Link></li>: null}
        </ul>
      </div>
      <div className={styles.forumThemesWrapper}>
        <div className={styles.headerWrapper}>
          <h1 className={styles.headline}>Unsere Themen</h1>
          <div className={styles.userLink}>
           {user ? <span className={styles.accountLink}><Link href={`/account/${user._id}`} className='link' title="Zu Ihrem Account">{user.username}</Link></span>:null}
          </div>
        </div>
        {data ? data.map((item:ForumThemesDocument)=>(
          <div className={styles.fieldWrapper} key={item._id}>
            <Link href={`/forum/${item.theme}`} className='link'>
            <h3 className={styles.theme}>{item.theme}</h3>
            <p className={styles.content}>{item.content}</p>
            </Link>
          </div>
        )):null}
      </div>
    </div>
  )
}

export default Forum