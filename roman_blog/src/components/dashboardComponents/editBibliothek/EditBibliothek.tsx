"use client"
import React from 'react'
import styles from './editBibliothek.module.css'
import {useFieldArray, useForm} from 'react-hook-form';
import { BibliothekDocument } from '@/models/Bibliothek';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
type FormValues = {
    videos:{
        ressort:string,
        file:string,
        content:string
    }[]
}
const EditBibliothek = (props:{setEdit:React.Dispatch<React.SetStateAction<boolean>>, editId:string, editData:BibliothekDocument | null, mutate:Function}) => {
    const id = props.editId;
    const {register, handleSubmit, formState, control, reset} = useForm<FormValues>({
        defaultValues:props.editData!,
        mode:"onBlur",
    })
    const {fields, append, remove} = useFieldArray({
        name:"videos",
        control,
    })

    const {errors, isValid, isDirty, isSubmitting} = formState;
    const onSubmit = async (data: FormValues) => {
        try {
          await fetch(`/api/bibliothek/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          toast.success("Update erfolgreich");
          await props.mutate('/api/bibliothek/');
          props.setEdit(false)
        } catch (error: any) {
          toast.error(error.message);
        }
      };
    
    const onCancel = () => {
        reset(props.editData!);
        props.setEdit(false);
      };
      const youtubeUrl = "https://www.youtube.com/embed/";
  return (
    <div className={styles.container}>
        <ToastContainer/>
        {/* <div data-testid="fieldArrayLength">{fields.length}</div> */}
        <div className={styles.headerWrapper}>
            <h3>Update oder Löschen der Bibliothek Videos</h3>
            <div className={styles.close} onClick={()=>props.setEdit(false)} title="Schließen">X</div>
        </div>
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} data-testid="editBibliothekForm">
                {fields.map((field, index)=>(
                    <div className={styles.formGroup} key={field.id}>
                        <label htmlFor={`videos.${index}.ressort`} className={styles.label}>Ressort</label>
                        <input
                        id={`videos.${index}.ressort`}
                        type="text"
                        data-testid="ressort"
                        className={styles.input}
                        {...register(`videos.${index}.ressort`, {required: true})}
                        />
                            {errors.videos?.[index]?.ressort && (
                        <span className={styles.error}>Ressort ist Pflicht</span>
                            )}
                        <label htmlFor={`videos.${index}.file`} className={styles.label}>Youtube Url</label>
                        <input
                        id={`videos.${index}.file`}
                        type="text"
                        data-testid="file"
                        className={styles.input}
                        {...register(`videos.${index}.file`, {required: true})}
                        />
                        <iframe src={props.editData?.videos[index]?.file ? youtubeUrl+props.editData?.videos[index].file.split("=")[1] : ""}></iframe>
                            {errors.videos?.[index]?.file && (
                        <span className={styles.error}>Eine Youtube Url muss vergeben sein</span>
                            )}
                        <label htmlFor={`videos.${index}.content`} className={styles.label}>Inhalt</label>
                        <input
                        id={`videos.${index}.content`}
                        type="text"
                        data-testid="content"
                        className={styles.input}
                        {...register(`videos.${index}.content`, {required: true})}
                        />
                            {errors.videos?.[index]?.content && (
                        <span className={styles.error}>Inhalt ist Pflicht</span>
                            )}
                             <button type="button" onClick={() => remove(index)} className={styles.removeBtn} data-testid="remove">
                                Video löschen
                                </button>
                    </div>
                ))}
                        <div className={styles.btnWrapper}>
                            <button type="button" onClick={() => append({ressort: "", file: "", content: ""})} className={styles.addBtn} data-testid="add">
                            Video hinzufügen
                            </button>
                            <button type="submit" disabled={!isDirty || isSubmitting} className={styles.sendBtn} data-testid="submit">
                                Absenden
                            </button>
                            <button type="button" onClick={onCancel} className={styles.cancelBtn}>
                                Abbrechen
                            </button>
                        </div>
            </form>
        </div>
    </div>
  )
}

export default EditBibliothek