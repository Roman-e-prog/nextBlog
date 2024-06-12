"use client"
import React, { useState } from 'react'
import styles from './editAdminMessages.module.css'
import { AdminMessageDocument } from '@/models/AdminMessage'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const EditAdminMessages = (props:{setEdit: React.Dispatch<React.SetStateAction<boolean>>, editId:string, editData:AdminMessageDocument | null, mutate:Function}) => {
    const setEdit = props.setEdit;
    const id = props.editId;
    const editData = props.editData;
    const [formdata, setFormdata] = useState({
        adminMessage:editData?.adminMessage
    })
    const {adminMessage} = formdata;
    const onSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        const editAdminMessage = {
            ...editData,
            adminMessage:adminMessage,
        }
        try{
            await fetch(`/api/adminMessages/${id}`,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(editAdminMessage)
            })
            await props.mutate('/api/adminMessages/')
            toast.success("Antwort erfolgreich upgedated")
            setEdit(false);
        } catch(error:any){
            toast.error(error.message)
        }
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.formWrapper}>
        <span className={styles.close} title="Schließen" onClick={()=>setEdit(false)}>X</span>
            <form className={styles.form} onSubmit={onSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="adminMessage">Anwortnachricht</label>
                    <textarea name="adminMessage" 
                                id="adminMessage" 
                                cols={20} 
                                rows={20}
                                required
                                defaultValue={adminMessage}
                                onChange={(e)=>setFormdata({...formdata, adminMessage:e.target.value})}
                                ></textarea>
                </div>
                <button type='submit' className={styles.sendBtn}>Absenden</button>
            </form>
        </div>
    </div>
  )
}

export default EditAdminMessages