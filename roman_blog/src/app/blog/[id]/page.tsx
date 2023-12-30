import React from 'react'
import styles from './page.module.css'
import { BlogPostDocument } from '@/models/BlogPost';
import Image from 'next/image';
const getData = async (id:string | string[])=>{
    const response = await fetch(`http://localhost:3000/api/blogPosts/${id}`,{cache: 'no-store'});
    if(!response.ok){
        throw new Error("Kein Eintrag")
    }
    return response.json();
}
const SingleBlogPost = async ({params}:any) => {
    const id = params.id
    const data:BlogPostDocument = await getData(id);
  return (
    <div className={styles.container}>
        <div className={styles.formular}>
            <div className={styles.topContent}>
                <div className={styles.elements}>
                    <div className={styles.textElements}>
                        <h1 className='headline'>{data.theme}</h1>
                        <p className={styles.desc}>{data.description}</p>
                        <p className={styles.author}>{data.author}</p>
                    </div>
                    <div className={styles.imageElement}>
                        {/* @ts-ignore */}
                        {data.images.length > 0 ? <Image src={data.images[0]} alt={data.theme}  title={data.theme} width={200} height={200} priority={false} className={styles.images}/> : null}
                    </div>
                </div>
            </div>
            <hr className={styles.headRow}/>
            <article className={styles.article}>
                <h2 className='headline'>Mein Beitrag zum Thema: {data.theme}</h2>
                <section>{data.content}</section>
                <div className={styles.imagesWrapper}>
                    {data.images.length > 1 ? data.images.map((item:string, index)=>(
                        <img src={item} alt="Bilder zum Beitrag" key={index} className={styles.images}/>
                    )):null}
                </div>
            </article>
        </div>
    </div>
  )
}

export default SingleBlogPost