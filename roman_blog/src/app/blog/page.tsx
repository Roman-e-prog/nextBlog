import React from 'react'
import styles from './page.module.css'
import { BlogPostDocument } from '@/models/BlogPost';
import Image from 'next/image';
import Link from 'next/link';
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const getData = async ()=>{
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogPosts/`, {cache:'no-store'});
  if(!response.ok){
    throw new Error("Derzeit keine Einträge")
  }
  return await response.json();
}
const Blog = async () => {
    const data = await getData();
  return (
    <div className={styles.container}>
      <div className={styles.headlineWrapper}>
          <h1 className='headline'>Aktuelle Blogthemen</h1>
        </div>
      <div className={styles.blogWrapper}>
        {data ? data.map((item:BlogPostDocument)=>(
          <Link href={`/blog/${item._id}`} key={item._id} title={item.description} className={styles.blogLink} data-testid={item._id}>
            <div className={styles.fieldWrapper} key={item._id}>
              <div className={styles.contentWrapper}>
                <h3 className='headline'>{item.theme}</h3>
                <p className={styles.desc}>{item.description}</p>
                <p className={styles.author}>{item.author}</p>
              </div>
              <div className={styles.imageWrapper}>
                {/*@ts-ignore*/}
                {item.images.length ? <Image src={item.images[0]} title={item.theme} alt={item.theme} width={100} height={100}/>:null}
              </div>
            </div>
          </Link>
        )):null}
      </div>
    </div>
  )
}

export default Blog