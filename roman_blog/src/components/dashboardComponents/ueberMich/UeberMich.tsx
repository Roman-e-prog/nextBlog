"use client"
import React,{useEffect, useState} from 'react'
import styles from './ueberMich.module.css'
import useSWR,{useSWRConfig} from 'swr';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {useForm} from 'react-hook-form'
import { UeberMichDocument } from '@/models/UeberMich';
import EditUeberMich from '../editUeberMich/EditUeberMich';
import Spinner from '@/components/spinner/Spinner';
// Define the fetcher function
const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  type FormValues = {
    myPerson:string,
  }
const UeberMich = () => {
    const { data, error, isLoading} = useSWR('/api/ueberMich/', fetcher);
    useEffect(()=>{
        if(error){
            toast.error(error)
        }
    },[error])
    const {mutate} = useSWRConfig();
    const {register, handleSubmit, formState, reset} = useForm<FormValues>({
        defaultValues:{
            myPerson:"",
        },
        mode:"onBlur"
    })
    const {errors, isValid, isDirty, isSubmitting, isSubmitted} = formState;
    const onSubmit = async (data:FormValues)=>{
        const ueberMichData = {
            myPerson:data.myPerson,
        }
        try{
            await fetch('/api/ueberMich/',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(ueberMichData)
            })
            mutate('/api/ueberMich/')
        } catch(error:any){
            toast.error(error)
        }
    }
    useEffect(()=>{
        if(isSubmitted){
            reset()
        }
    }, [isSubmitted, reset])
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [editData, setEditData] = useState<UeberMichDocument | null>(null)
    const handleEdit = async (id:string)=>{
       const res = await fetch(`/api/ueberMich/${id}`);
       const data = await res.json();
       setEditId(id);
       setEditData(data);
       setEdit(true);
    }
    const handleDelete = async (id:string)=>{
        try{
            await fetch(`/api/ueberMich/${id}`,{
                method:"DELETE"
            })
        } catch(error:any){
            toast.error(error)
        }
        mutate('/api/ueberMich/')
    }
    if(isLoading){
        return <Spinner/>
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.ueberMichWrapper}>
            <div className={styles.headerWrapper}>
                <h3 className="headline">Über mich</h3>
            </div>
            {data && data.length ? data.map((item:UeberMichDocument)=>(
                <div className={styles.fieldWrapper} key={item._id}>
                    <p className={styles.content} data-testid="entrys">{item.myPerson}</p>
                    <div className={styles.iconWrapper}>
                        <div className={styles.icons} onClick={()=>handleEdit(item._id)} id="editUeberMich" data-testid="editUeberMich"><span className="material-symbols-outlined">Edit</span></div>
                        <div className={styles.icons} onClick={()=>handleDelete(item._id)} data-testid="deleteUeberMich"><span className="material-symbols-outlined" id="deleteUeberMich">Delete</span></div>
                    </div>
                </div>
            )):null}
        </div>
        <div className={styles.formWrapper}>
        <div className={styles.headerWrapper}>
                <h3 className={styles.headline}>Neues zu meiner Person hochladen</h3>
            </div>
            <div className={styles.formWrapper}>
                {edit ? <EditUeberMich setEdit={setEdit} editId={editId} editData={editData} mutate={()=>mutate(`/api/ueberMich/`)}/> :   <form className={styles.form} onSubmit={handleSubmit(onSubmit)} data-testid="ueberMichForm">
                <div className={styles.formGroup}>
                    <label htmlFor="myPerson" className={styles.label}>Zu meiner Person</label>
                    <textarea 
                        cols={10}
                        rows={10}
                        id="myPerson"
                        data-testid="myPerson"
                        className={styles.input}
                        {...register("myPerson",{
                            required:{
                            value:true,
                            message:"Ohne Text geht das nicht"
                            }
                        })}
                        />
                        <div className="errors">{errors.myPerson?.message}</div>
                </div>
                <button className={styles.sendBtn} type="submit" disabled={!isValid || !isDirty || isSubmitting} id="ueberMichSend" data-testid="ueberMichSend">Absenden</button>
                </form>}
            </div>
        </div>
    </div>
  )
}

export default UeberMich