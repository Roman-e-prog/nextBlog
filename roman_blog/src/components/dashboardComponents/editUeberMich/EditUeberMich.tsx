"use client"
import React from 'react'
import styles from './editUeberMich.module.css'
import { UeberMichDocument } from '@/models/UeberMich'
import {useForm} from 'react-hook-form';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
type FormValues = {
    myPerson:string
}
const EditUeberMich = (props:{setEdit:React.Dispatch<React.SetStateAction<boolean>>, editId:string, editData:UeberMichDocument | null, mutate:Function}) => {
    const data = props.editData;
    const id = props.editId;
    const {register, handleSubmit, formState} = useForm<FormValues>({
        defaultValues:{
            myPerson:data!.myPerson
        }
    })
    const {errors, isValid, isDirty, isSubmitting} = formState;
    const onSubmit = async (data:FormValues)=>{
        try{
            const updateData = {
                myPerson:data.myPerson
            }
            await fetch(`/api/ueberMich/${id}`,{
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(updateData)
            })
            await props.mutate('/api/ueberMich/')
            props.setEdit(false)
            toast.success("Update erfolgreich")
            
        } catch(error:any){
            toast.error(error)
        }
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.headerWrapper}>
            <h3 className='headline'>Update meiner Personenbeschreibung</h3>
            <div className={styles.close} onClick={()=>props.setEdit(false)} title="Schließen">X</div>
        </div>
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} data-testid="editUeberMichForm">
            <div className={styles.formGroup}>
                    <label htmlFor="myPerson" className={styles.label}>Zu meiner Person</label>
                    <textarea 
                        cols={10}
                        rows={10}
                        id="myPerson"
                        className={styles.input}
                        data-testid="editUeberMichText"
                        {...register("myPerson",{
                            required:{
                            value:true,
                            message:"Ohne Text geht das nicht"
                            }
                        })}
                        />
                        <div className="errors">{errors.myPerson?.message}</div>
                </div>
                <button className={styles.sendBtn} type="submit" disabled={!isValid || !isDirty || isSubmitting} data-testid="editUeberMichSubmit">Absenden</button>
            </form>
        </div>
    </div>
  )
}

export default EditUeberMich