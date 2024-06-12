"use client"
import React from 'react'
import styles from './editForumAdmin.module.css'
import { ForumDocument } from '@/models/Forum'
import {useForm} from 'react-hook-form';
import { useUserSession } from '@/components/sessionHook/SessionHook';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
type FormValues = {
    ressort:string,
    theme:string,
    question:string,
}
const EditForumAdmin = (props:{setEdit:React.Dispatch<React.SetStateAction<boolean>>, editId:string, editData:ForumDocument | null, mutate:Function}) => {
    const id = props.editId
    const data = props.editData
    const setEdit = props.setEdit
    const mutate = props.mutate
    const {user} = useUserSession();
    const {register, handleSubmit, formState} = useForm<FormValues>({
        defaultValues:{
            ressort:data!.ressort,
            theme:data!.theme,
            question:data!.question,
        },
        mode:"onBlur",
    })
    const {errors, isValid, isSubmitting} = formState;
    const onSubmit = async (data:FormValues)=>{
        const forumAdminEditData = {
            ressort:data.ressort,
            senderId:user?._id,
            senderName:user?.username,
            senderIsAdmin:user?.isAdmin,
            senderProfilePicture:user?.profilePicture,
            theme:data.theme,
            question:data.question,
        }
        try{
            const res = await fetch(`/api/forum/${id}`,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(forumAdminEditData)
            })
            if(res.ok){
                await mutate('/api/forum/')
                toast.success("Beitrag erfolgreich upgedated")
                setEdit(false)
            }
        } catch(error:any){
            toast.error(error.message)
        }
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.headerWrapper}>
            <h3 className='headline'>Update Adminbeiträge</h3>
            <span className={styles.close} title="Schließen" onClick={()=>setEdit(false)}>X</span>
        </div>
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label htmlFor="ressort">Ressort</label>
                    <input type="text"
                            id="ressort"
                            className={styles.input}
                            {...register("ressort",{
                                required:{
                                    value:true,
                                    message:"Ressort ist ein Pflichtfeld"
                                }
                            })} />
                            <div className="errors">{errors.ressort?.message}</div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="theme">Thema</label>
                    <input type="text"
                            id="theme"
                            className={styles.input}
                            {...register("theme",{
                                required:{
                                    value:true,
                                    message:"Thema ist ein Pflichtfeld"
                                }
                            })} />
                            <div className="errors">{errors.theme?.message}</div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="question">Inhalt</label>
                    <textarea
                            cols={10}
                            rows={10}
                            id="question"
                            className={styles.input}
                            {...register("question",{
                                required:{
                                    value:true,
                                    message:"Inhalt ist ein Pflichtfeld"
                                }
                            })} />
                            <div className="errors">{errors.question?.message}</div>
                </div>
                <button type="submit" className={styles.sendBtn} disabled={!isValid || isSubmitting}>Absenden</button>
            </form>
        </div>
    </div>
  )
}

export default EditForumAdmin