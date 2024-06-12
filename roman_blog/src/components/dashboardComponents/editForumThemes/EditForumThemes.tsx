"use client"
import { ForumThemesDocument } from '@/models/ForumThemes'
import React from 'react'
import styles from './editForumThemes.module.css'
import {useForm} from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

type FormValues = {
    theme:string,
    content:string,
}
const EditForumThemes = (props:{setEdit:React.Dispatch<React.SetStateAction<boolean>>, edit:boolean, editId:string, editData:ForumThemesDocument | null, mutate:any}) => {
    const data = props.editData;
    const id = props.editId;
    const setEdit = props.setEdit;
    const mutate = props.mutate
    console.log(mutate, 'here i am')
    const {register, handleSubmit, formState} = useForm<FormValues>({
        defaultValues:{
            theme:data!.theme,
            content:data!.content,
        }
    })
    const {errors, isValid, isDirty, isSubmitting} = formState;
    const onSubmit = async (data:FormValues)=>{
        try{
            const updateData = {
                theme:data.theme,
                content:data.content,
            }
            const response = await fetch(`/api/forumThemes/${id}`,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(updateData)
            })
            console.log(response, 'here response')
            await mutate('/api/forumThemes/')
                setEdit(false)
                if(props.edit === false){
                    toast.success("Update erfolgreich")
                }
        } catch(error:any){
            console.log(error, 'here is an error')
            toast.error(error)
        }
    }
  return (
    <div className={styles.container}>
        <ToastContainer aria-label="message"/>
        <div className={styles.headerWrapper}>
            <h3>Update des Forum Themas</h3>
            <div className={styles.close} onClick={()=>props.setEdit(false)} title="Schließen">X</div>
        </div>
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} data-testid="editForumThemesForm">
            <div className={styles.formGroup}>
                    <label htmlFor="theme" className={styles.label}>Thema</label>
                    <input 
                        type="text"
                        id="theme"
                        data-testid="editTheme"
                        className={styles.input}
                        {...register("theme",{
                            required:{
                            value:true,
                            message:"Wenn du den Text nicht verändern willst geh auf schließen"
                            }
                        })}
                        />
                        <div className="errors">{errors.theme?.message}</div>
                </div>
            <div className={styles.formGroup}>
                    <label htmlFor="content" className={styles.label}>Inhalt</label>
                    <input 
                        type="text"
                        id="content"
                        data-testid="editContent"
                        className={styles.input}
                        {...register("content",{
                            required:{
                            value:true,
                            message:"Wenn du den Inhalt nicht verändern willst geh auf schließen"
                            }
                        })}
                        />
                        <div className="errors">{errors.content?.message}</div>
                </div>
                <button className={styles.sendBtn} type="submit" disabled={!isValid || !isDirty || isSubmitting} data-testid="editForumBtn">Absenden</button>
            </form>
        </div>
    </div>
  )
}

export default EditForumThemes