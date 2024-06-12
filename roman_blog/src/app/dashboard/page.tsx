"use client"
import React,{useEffect} from 'react'
import styles from './page.module.css'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/navigation'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ForumThemes from '@/components/dashboardComponents/forumThemes/ForumThemes'
import UeberMich from '@/components/dashboardComponents/ueberMich/UeberMich'
import BlogPost from '@/components/dashboardComponents/blogPosts/BlogPost'
import Bibliothek from '@/components/dashboardComponents/bibliothek/Bibliothek'
import ForumAdmin from '@/components/dashboardComponents/forumAdmin/ForumAdmin'
import Messages from '@/components/dashboardComponents/messages/Messages'

const Dashboard = () => {
    const {data:session} = useSession();
    const router = useRouter();
    useEffect(() => {
      if(session){
        if (!session?.user.isAdmin) {
          router.push('/');
          toast.warning('Sie haben keine Berechtigung für diese Seite');
        }
    }
    }, [session, router]);
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <UeberMich/>
        <BlogPost/>
        <ForumThemes/>
        <Bibliothek/>
        <ForumAdmin/>
        <Messages/>
    </div>
  )
}

export default Dashboard