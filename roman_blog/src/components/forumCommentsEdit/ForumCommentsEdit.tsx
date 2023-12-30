"use client"
import { ForumCommentsDocument } from '@/models/ForumComments'
import React, {useState} from 'react'
import styles from './forumCommentsEdit.module.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false });
const ForumCommentsEdit = (props:{setEditAnswer: React.Dispatch<React.SetStateAction<boolean>>, editAnswerId:string, editAnswerData:ForumCommentsDocument | null, mutate:Function}) => {
    const setEditAnswer = props.setEditAnswer;
    const id = props.editAnswerId;
    const data = props.editAnswerData;
   
    const [value, setValue] = useState(data!.answer)
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
        const editForumCommentsData = {
            ...data,
            answer:value,
        }
        try{
            await fetch(`/api/forumComments/${id}`,{
                method:"PUT",
                headers:{
                    'Content-Type':'/application/json'
                },
                body:JSON.stringify(editForumCommentsData)
            })
            await props.mutate('/api/forumComments/')
            toast.success("Beitrag erfolgreich upgedated");
            setEditAnswer(false)
        } catch(error:any){
            toast.error(error.message)
        }
      }
  return (
    <div className={styles.container}>
         <ToastContainer/>
        <div className={styles.close}>
            <span className={styles.x} title="Schließen" onClick={()=>setEditAnswer(false)}>X</span>
        </div>
        <div className={styles.moduleWrapper}>
            <div className={styles.questionWrapper}>
                <form className={styles.form} onSubmit={onSubmit}>
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

export default ForumCommentsEdit