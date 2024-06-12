"use client"
import React, { useEffect, useState } from 'react'
import styles from './forumAdmin.module.css'
import {useForm} from 'react-hook-form';
import useSWR,{mutate} from 'swr';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { ForumDocument } from '@/models/Forum';
import { useSession } from 'next-auth/react';
import EditForumAdmin from '../editForumAdmin/EditForumAdmin';
// const fetcher = async (url: string) => {
//     const response = await fetch(url);
//     const data = await response.json();
//     return data;
//   }
type FormValues = {
    ressort:string,
    theme:string,
    question:string,
}
const ForumAdmin = () => {
    // const { data, error } = useSWR('/api/forum/', fetcher);
    const [data, setData] = useState([])
    useEffect(()=>{
        fetch('/api/forum/')
        .then((res)=>res.json())
        .then((data)=>{
            setData(data)
        })
    },[])
    const filteredAdmin = data.filter((item:ForumDocument)=>item.senderIsAdmin === true);
    
    const { data: session, status } = useSession();
    const user = session?.user;
   
    const {register, handleSubmit, formState, reset} = useForm<FormValues>({
        defaultValues:{
            ressort:"",
            theme:"",
            question:"",
        },
        mode:"onBlur",
    })
    const {errors, isDirty, isValid, isSubmitted, isSubmitting} = formState;
    const onSubmit = async (data:FormValues)=>{
        const forumAdminData = {
            senderId:user?._id,
            senderName:user?.username,
            senderIsAdmin:user?.isAdmin,
            senderProfilePicture:user?.profilePicture,
            ressort:data.ressort,
            theme:data.theme,
            question:data.question,
        }
        try{
            await fetch('/api/forum/',{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(forumAdminData)
            })
            await fetch('/api/forum/')
        } catch(error:any){
            toast.error(error)
        }
    }
    useEffect(()=>{
        if(isSubmitted){
            reset()
        }
    },[isSubmitted, reset])
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [editData, setEditData] = useState<ForumDocument | null>(null)
    const handleEdit = async (id:string)=>{
        await fetch(`/api/forum/${id}`)
        .then((res)=>res.json())
        .then((data)=>{
            setEditData(data)
        })
        setEditId(id);
        setEdit(true)
    }
    const handleDelete = async (id:string)=>{
        await fetch(`/api/forum/${id}`,{
            method:"DELETE",
        })
        await mutate('/api/forum/')
        toast.success("Beitrag wurde erfolgreich gelöscht.")
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.forumAdminWrapper}>
            <div className={styles.headingWrapper}>
                <h3 className={styles.headline}>Alle Admin Forumbeiträge</h3>
            </div>
            {filteredAdmin ? filteredAdmin.map((item:ForumDocument)=>(
                <div className={styles.fieldWrapper} key={item._id}>
                    <div className={styles.headlineWrapper}>
                        <div className={styles.headlineHolder}>
                        <h3 className={styles.headline}>{item.ressort}</h3>
                        </div>
                        <div className={styles.iconWrapper}>
                            <div className={styles.icons} onClick={()=>handleEdit(item._id)}><span className="material-symbols-outlined" style={{cursor:"pointer"}}>Edit</span></div>
                            <div className={styles.icons} onClick={()=>handleDelete(item._id)}><span className="material-symbols-outlined" style={{cursor:"pointer"}}>Delete</span></div>
                        </div>
                    </div>
                    <div className={styles.content}>
                    <h4 className={styles.subHeadline}>{item.theme}</h4>
                        <p className={styles.question}>{item.question}</p>
                    </div>
                    <div className={styles.date}>
                        <span>Am:</span>
                        <span>{new Date(item.createdAt).toLocaleDateString("de-De",{ day:"numeric", month:"short", year:"2-digit"})}</span>
                    </div>
                </div>
            )):null}
        </div>
        <div className={styles.formWrapper}>
            {edit ? <EditForumAdmin setEdit={setEdit} editId={editId} editData={editData} mutate={()=>mutate('/api/forum/')}/> :  <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label htmlFor="ressort" className={styles.label}>Ressort</label>
                    <input type="text"
                            id="ressort"
                            {...register('ressort',{
                                required:{
                                    value:true,
                                    message:"Ressort muss eingegeben werden"
                                }
                            })}
                            className={styles.input} />
                            <div>{errors.ressort?.message}</div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="theme" className={styles.label}>Thema</label>
                    <input type="text"
                            id="theme"
                            {...register('theme',{
                                required:{
                                    value:true,
                                    message:"Thema muss eingegeben werden"
                                }
                            })}
                            className={styles.input} />
                            <div>{errors.theme?.message}</div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="question" className={styles.label}>Inhalt</label>
                    <textarea
                            cols={10}
                            rows={10}
                            id="question"
                            {...register('question',{
                                required:{
                                    value:true,
                                    message:"Thema muss eingegeben werden"
                                }
                            })}
                            className={styles.input} />
                            <div>{errors.question?.message}</div>
                </div>
                <button type="submit" className={styles.sendBtn} disabled={!isDirty || !isValid || isSubmitting}>Absenden</button>
            </form>} 
        </div>
    </div>
  )
}

export default ForumAdmin