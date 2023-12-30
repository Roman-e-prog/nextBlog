"use client"
import React,{useEffect, useState} from 'react'
import useSWR,{useSWRConfig} from 'swr';
import {useFieldArray, useForm} from 'react-hook-form';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { BibliothekDocument } from '@/models/Bibliothek';
import styles from './bibliothek.module.css'
import EditBibliothek from '../editBibliothek/EditBibliothek';
import Spinner from '@/components/spinner/Spinner';
const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  type FormValues = {
    videos:
        {
            ressort:string,
            file:string,
            content:string,
        }[],
    
  }
const Bibliothek = () => {
    const { data, error, isLoading} = useSWR('/api/bibliothek/', fetcher);
    useEffect(()=>{
        if(error){
            toast.error(error)
        }
    },[error])
    const {mutate} = useSWRConfig();
    const {register, handleSubmit, watch, formState, reset, control} = useForm<FormValues>({
        defaultValues:{
            videos:[{
                ressort:"",
                file:"",
                content:"",
            }]
        },
        mode:"onBlur",
    })
    const {fields, append, remove} = useFieldArray({
        name:"videos",
        control,
    })
    const {errors, isValid, isDirty, isSubmitting, isSubmitted} = formState;
    const onSubmit = async (data:FormValues)=>{
        const bibliothekdata = {
            videos:data.videos
        }
        try{
            await fetch('/api/bibliothek',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(bibliothekdata)
            })
            mutate('/api/bibliothek')
        } catch(error:any){
            toast.error(error)
        }
    }
    useEffect(()=>{
        if(isSubmitted){
            reset()
        }
    },[isSubmitted])
    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState<BibliothekDocument | null>(null);
    const [editId, setEditId] = useState("");
    const handleEdit = async (id:string)=>{
        const res = await fetch(`/api/bibliothek/${id}`);
        const data = await res.json();
        setEditData(data);
        setEditId(id);
        setEdit(true);
    }
    const [warning, setWarning] = useState(false)
    const handleDelete = ()=>{
        setWarning(true);
    }
    const deleteAll = async (id:string)=>{
        await fetch(`/api/bibliothek/${id}`)
        toast.success("Du hast tatsächlich gerade die gesamte Blog-Bibliothek gelöscht.")
    }
    const youtubeUrl = "https://www.youtube.com/embed/";
    if(isLoading){
        return <Spinner/>
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.headerWrapper}>
                <h3 className={styles.headline}>Alle Videos aus dieser Bibliothek</h3>
            </div>
        <div className={styles.bibliothekWrapper}>
            {data ? data.map((item:BibliothekDocument)=>(
                <div className={styles.fieldWrapper} key={item._id} data-testid="bibliothekField">
                    {item.videos ? item.videos.map((video, index)=>(
                        <div className={styles.videoWrapper} key={index}>
                             <div className={styles.headingWrapper}>
                             <div className={styles.icons} onClick={()=>handleEdit(item._id)} data-testid="editTheBibliothek"><span className="material-symbols-outlined" style={{cursor:"pointer"}}>Edit</span></div>
                            </div>
                            <h4>{video.ressort}</h4>
                            <iframe src={youtubeUrl+video.file.split("=")[1]} title={`Video Nr:${index+1}`}></iframe>
                            <p>{video.content}</p>
                        </div>
                    )):null}
                </div>
            )):null}
        </div>
        <div className={styles.deleteWrapper}>
                        <div className={styles.icons} onClick={handleDelete}><button className={styles.deleteBtn}>Gesamte Bibliothek löschen</button></div>
                            {warning ? <div className={styles.warningModule}>
                                <h3>Willst du wirklich die gesamte Bibliothek löschen?</h3>
                                <p>Wenn du nur einen Beitrag löschen willst, schließe diese Warnung und klicke bitte auf den obigen Bleistift</p>
                                <div className={styles.warningButtonWrapper}>
                                    <button type="button" className={styles.warningClose} onClick={()=>setWarning(false)}>Zurück</button>
                                    <button type="button" className={styles.deleteAll} onClick={()=>deleteAll(data.map((item:BibliothekDocument)=>item._id))}>Alle Löschen</button>
                                </div>
                            </div> : null}
                    </div>
        <div className={styles.formWrapper}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.headline}>Neue Bibliothek - Videos nachpflegen oder löschen über den Bleistift in der obigen Anzeige.</h3>
            </div>
            <div className={styles.formWrapper}>
                {edit ? <EditBibliothek setEdit={setEdit} editId={editId} editData={editData} mutate={()=>mutate('/api/bibliothek')}/> :  <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                {fields && fields.map((field, index)=>(
                    <div className={styles.formGroup} key={field.id}>
                        <input type="text" 
                                {...register(`videos.${index}.ressort`,{
                                    required:{
                                        value:true,
                                        message:"Ressort ist ein Pflichtfeld"
                                    }
                                })} 
                                placeholder='ressort' 
                                data-testid="ressort"
                                className={styles.input}/>
                                <span className='errors'>{errors?.videos?.[index]?.ressort?.message}</span>
                        <input type="text" 
                                {...register(`videos.${index}.file`,{
                                    required:{
                                        value:true,
                                        message:"Die youtube url muss eingegeben werden"
                                    }
                                })}
                                placeholder='youtube url'
                                data-testid="file" 
                                className={styles.input}/>
                                <span>{errors?.videos?.[index]?.file?.message}</span>
                        <input type="text" 
                            {...register(`videos.${index}.content`,{
                                required:{
                                    value:true,
                                    message:"Der Inhalt des Videos muss eingegeben werden"
                                }
                            })}
                                placeholder='content' 
                                data-testid="content" 
                                className={styles.input}/>
                                <span className='errors'>{errors?.videos?.[index]?.content?.message}</span>
                                <button type="button" onClick={() => remove(index)} className={styles.removeBtn}>
                                Video entfernen
                                </button>
                    </div>
                ))}
                    <div className={styles.buttonWrapper}>
                        <button type="button" onClick={() => append({ ressort: "", file: "", content: "" })} className={styles.addBtn}>
                        Video hinzufügen
                        </button>
                        <button className={styles.sendBtn} type="submit" disabled={!isValid || !isDirty || isSubmitting} data-testid="bibliothekSendBtn">Absenden</button>
                    </div>
                </form>}    
            </div>
        </div>
    </div>
  )
}

export default Bibliothek