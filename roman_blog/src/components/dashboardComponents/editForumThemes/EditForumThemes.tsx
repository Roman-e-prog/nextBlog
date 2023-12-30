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
const EditForumThemes = (props:{setEdit:React.Dispatch<React.SetStateAction<boolean>>, editId:string, editData:ForumThemesDocument | null, mutate:Function}) => {
    const data = props.editData;
    const id = props.editId;
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
            await fetch(`/api/forumThemes/${id}`,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(updateData)
            })
            props.mutate('/api/forumThemes')
            toast.success("Update erfolgreich")
        } catch(error:any){
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