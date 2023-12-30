"use client"
import React,{useEffect, useState} from 'react'
import styles from './forumThemes.module.css'
import useSWR,{useSWRConfig} from 'swr';
import { ForumThemesDocument } from '@/models/ForumThemes';
import Spinner from '@/components/spinner/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {useForm} from 'react-hook-form'
import EditForumThemes from '../editForumThemes/EditForumThemes';
// Define the fetcher function
const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  type FormValues = {
    theme:string,
    content:string,
  }
const ForumThemes = () => {
    const { data, error, isLoading } = useSWR('/api/forumThemes/', fetcher);
    useEffect(()=>{
        if(error){
            toast.error(error)
        }
    },[])
    const {mutate} = useSWRConfig();
    const {register, handleSubmit, formState, reset} = useForm<FormValues>({
        defaultValues:{
            theme:"",
            content:"",
        },
        mode:"onBlur",
    })
    const {errors, isDirty, isValid, isSubmitting, isSubmitted} = formState;
    const onSubmit = async (data:FormValues)=>{
        const forumThemeData = {
            theme:data.theme,
            content:data.content
        }
        try{
            await fetch('/api/forumThemes/',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(forumThemeData)
            })
            await mutate('/api/forumThemes/')
        } catch(error){
            console.log(error)
        }
    }
    useEffect(()=>{
        if(isSubmitted){
            reset();
        }
    },[])
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [editData, setEditData] = useState<ForumThemesDocument | null>(null)
    const handleEdit = async (id:string)=>{
       const res = await fetch(`/api/forumThemes/${id}`);
       const data = await res.json();
       setEditId(id);
       setEditData(data);
       setEdit(true);
    }
    const handleDelete = async (id:string)=>{
        try{
            await fetch(`/api/forumThemes/${id}`,{
                method:"DELETE"
            })
        } catch(error:any){
            toast.error(error)
        }
        mutate('/api/forumThemes')
    }
    if(isLoading){
        return <Spinner data-testid="spinner"/>
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.themesWrapper}>
            {data ? data.map((item:ForumThemesDocument)=>(
                <div className={styles.fieldWrapper} key={item._id}>
                    <div className={styles.themeWrapper}>
                        <div className={styles.headingWrapper}>
                            <h3>{item.theme}</h3>
                            <div className={styles.icons} onClick={()=>handleEdit(item._id)}><span className="material-symbols-outlined" style={{cursor:"pointer"}} data-testid="editForumThemes">Edit</span></div>
                            <div className={styles.icons} onClick={()=>handleDelete(item._id)}><span className="material-symbols-outlined" style={{cursor:"pointer"}} data-testid="deleteForumThemes">Delete</span></div>
                        </div>
                        <p>{item.content}</p>
                    </div>
                </div>
            )):null}
        </div>
        <div className={styles.formWrapper}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.headline}>Neues Thema hochladen</h3>
            </div>
            <div className={styles.formWrapper}>
                {edit ? <EditForumThemes setEdit={setEdit} editId={editId} editData={editData} mutate={()=>mutate('/api/forumThemes')}/> :   
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formGroup}>
                    <label htmlFor="theme" className={styles.label}>Thema</label>
                    <input type="text"
                        id="theme"
                        className={styles.input}
                        {...register("theme",{
                            required:{
                            value:true,
                            message:"Thema ist ein Pflichtfeld"
                            }
                        })}
                        />
                        <div className="errors">{errors.theme?.message}</div>
                </div>
                    <div className={styles.formGroup}>
                    <label htmlFor="content" className={styles.label}>Inhalt</label>
                    <input type="text"
                        id="content"
                        className={styles.input}
                        {...register("content",{
                            required:{
                            value:true,
                            message:"Inhalt ist ein Pflichtfeld"
                            }
                        })}
                        />
                        <div className="errors">{errors.content?.message}</div>
                </div>
                <button className={styles.sendBtn} type="submit" disabled={!isValid || !isDirty || isSubmitting} data-testid="forumthemesBtn">Absenden</button>
                </form>}
            </div>
        </div>
    </div>
  )
}

export default ForumThemes