"use client"
import React,{useEffect, useState} from 'react'
import styles from './page.module.css'
import useSWR, {useSWRConfig} from 'swr';
import {useParams} from 'next/navigation'
import { ForumDocument } from '@/models/Forum';
import Link from 'next/link';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {useSession} from 'next-auth/react';
import ForumQuestion from '@/components/forumQuestion/ForumQuestion';
import parse from 'html-react-parser';
const fetcher = async (url:string)=>{
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

const Ressort = () => {
    const {data} = useSWR('/api/forum/', fetcher);
    const {ressort} = useParams();
    const session = useSession()
    const {mutate} = useSWRConfig();
    const [forumContent, setForumContent] = useState<ForumDocument[]>([])
    useEffect(()=>{
        if(data){
            if(ressort === "HTML"){
                setForumContent(data.filter((item:ForumDocument)=>item.ressort === "HTML"))
            }
            if(ressort === "CSS"){
                setForumContent(data.filter((item:ForumDocument)=>item.ressort === "CSS"))
            }
            if(ressort === "JavaScript"){
                setForumContent(data.filter((item:ForumDocument)=>item.ressort === "JavaScript"))
            }
        }
    },[data, ressort]);
    const adminTheme = forumContent.filter((item:ForumDocument)=>item.senderIsAdmin === true);
    const userTheme = forumContent.filter((item:ForumDocument)=>item.senderIsAdmin === false);
    function timeSince(date:Date) {
        var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      
        var interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours";
        }
      
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes";
        }
      
        return Math.floor(seconds) + " seconds";
      }
      const [question, setQuestion] = useState(false)
      const handleQuestion = ()=>{
        if(session.status === "unauthenticated"){
            toast.error("Wenn Sie ein Thema einstellen möchten, müssen Sie sich einloggen!")
        }
        else{
            setQuestion(true);
        } 
      }
      const handleViews = async (id:string)=>{
        const viewData = {
            id,
            type:"views"
        }
        try{
            await fetch('/api/forum/likes',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(viewData)
            })
            mutate('/api/forum/')
        } catch(error:any){
            toast.error(error.message)
        }
      }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.headerWrapper}>
            <h1>{ressort}</h1>
        </div>
        <div className={styles.topicWrapper}>
            {question ? <ForumQuestion ressort={ressort} mutate={()=>mutate('/api/forum')} setQuestion={setQuestion}/> : <button type="button" className={styles.topicBtn} onClick={handleQuestion}>Neues Thema</button>}
        </div>
        <div className={styles.contentWrapper}>
            {adminTheme ? adminTheme.map((item:ForumDocument)=>(
                <div className={styles.fieldWrapper} key={item._id} onClick={()=>handleViews(item._id)}>
                    <Link href={`/forum/${ressort}/${item._id}`} className='link' data-testid={item._id}>
                        <div className={styles.headingWrapper}>
                            <h4>{item.ressort}</h4>
                            <p>{item.senderName}</p>
                           <Image src={item.senderProfilePicture ? item.senderProfilePicture : '/images/placeholderprofile.jpg'} alt={item.senderName} title={item.senderName} width={40} height={40} priority={false}/> 
                        </div>
                        <div className={styles.themeWrapper}>
                            <div className={styles.themeHolder}>
                                <p className={styles.theme}>{item.theme}</p>
                            </div>
                            <div className={styles.viewsWrapper}>
                                <p>Gesehen:</p>
                                <span>{item.views}</span>
                            </div>
                        </div>
                        <div className={styles.questionWrapper}>
                            <p className={styles.question}>{item.question}</p>
                        </div>
                        <div className={styles.likeWrapper}>
                            <div className={styles.solved}>
                                <div className={styles.icons}>
                                    <span>{item.likes > 0 ? item.likes : null}</span>
                                    <span className='material-symbols-outlined'>Thumb_Up</span>
                                </div>
                                <div className={styles.icons}>
                                    <span>{item.dislikes > 0 ? item.dislikes : null}</span>
                                    <span className='material-symbols-outlined'>Thumb_Down</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )):null}
        </div>
        <div className={styles.contentWrapper}>
            {userTheme ? userTheme.map((item:ForumDocument)=>(
                <div className={styles.fieldWrapper} key={item._id}  onClick={()=>handleViews(item._id)}>
                    <Link href={`/forum/${ressort}/${item._id}`} className='link' data-testid={item._id}>
                        <div className={styles.headingWrapper}>
                            <h4>{item.ressort}</h4>
                            <p>{item.senderName}</p>
                           <Image src={item.senderProfilePicture ? item.senderProfilePicture : '/images/placeholderprofile.jpg'} alt={item.senderName} title={item.senderName} width={40} height={40} priority={false}/> 
                        </div>
                        <div className={styles.themeWrapper}>
                            <div className={styles.themeHolder}>
                                <p className={styles.theme}>{item.theme}</p>
                            </div>
                            <div className={styles.viewsWrapper}>
                                <p>Gesehen:</p>
                                <span>{item.views}</span>
                            </div>
                        </div>
                        <div className={styles.questionWrapper}>
                        {parse(`<p className={styles.question}>${item.question}</p>`)}
                        </div>
                        <div className={styles.likeWrapper}>
                            <div className={styles.solved}>
                                <div className={styles.icons}>
                                    <span className='material-symbols-outlined'>done</span>
                                </div>
                                <div className={styles.icons}>
                                    <span>{item.likes > 0 ? item.likes : null}</span>
                                    <span className='material-symbols-outlined'>Thumb_up</span>
                                </div>
                                <div className={styles.icons}>
                                    <span>{item.dislikes > 0 ? item.dislikes : null}</span>
                                    <span className='material-symbols-outlined'>Thumb_down</span>
                                </div>
                                <div className={styles.time}>
                                    <p>Gepostet vor:</p>
                                    <span className={styles.since}>{timeSince(new Date(item.createdAt))}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )):null}
        </div>
    </div>
  )
}

export default Ressort