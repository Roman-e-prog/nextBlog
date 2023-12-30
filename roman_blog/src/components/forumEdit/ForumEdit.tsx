"use client"
import React, { useState } from 'react'
import styles from './forumEdit.module.css'
import { ForumDocument } from '@/models/Forum'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false });
const ForumEdit = (props:{setEdit:React.Dispatch<React.SetStateAction<boolean>>, editId:string, editData:ForumDocument | null, mutate:Function}) => {
    const setEdit = props.setEdit;
    const id = props.editId;
    const data = props.editData;

    const [formdata, setFormdata] = useState({
        ressort:data!.ressort,
        theme:data!.theme,
    })
    const {ressort, theme} = formdata;
    const [value, setValue] = useState(data!.question)
    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                         // remove formatting button
      ];
      const modules = {
        toolbar: toolbarOptions
      };
      const onSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        const editForumData = {
            ...data,
            theme:theme,
            question:value,
        }
        try{
            await fetch(`/api/forum/${id}`,{
                method:"PUT",
                headers:{
                    'Content-Type':'/application/json'
                },
                body:JSON.stringify(editForumData)
            })
            await props.mutate('/api/forum/')
            toast.success("Beitrag erfolgreich upgedated");
            setEdit(false)
        } catch(error:any){
            toast.error(error.message)
        }
      }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.close}>
            <span className={styles.x} title="Schließen" onClick={()=>setEdit(false)}>X</span>
        </div>
        <div className={styles.moduleWrapper}>
            <div className={styles.questionWrapper}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <div className={styles.headerGroup}>
                        <div className={styles.formGroup}>
                            <input type="text"
                                id="forumTheme"
                                name="theme"
                                value={theme}
                                required
                                placeholder="Dein Thema"
                                className={styles.input}
                                onChange={(e)=>setFormdata({...formdata, theme:e.target.value})}
                            />
                            <input type="text"
                                id="ressort"
                                name="ressort"
                                className={styles.input}
                                defaultValue={ressort}/>
                            </div>
                    </div>
                    <ReactQuill theme="snow" modules={modules} defaultValue={value} onChange={setValue}/>
                    <div className={styles.buttonWrapper}>
                        <button type="submit" className={styles.sendBtn}>Absenden</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default ForumEdit