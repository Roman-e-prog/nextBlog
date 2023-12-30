"use client"
import React,{useState, useEffect} from 'react'
import styles from './forumQuestion.module.css'
import useSWR from 'swr';
import {useSession} from 'next-auth/react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import parse from 'html-react-parser';
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { ForumDocument } from '@/models/Forum';
import Link from 'next/link';
const fetcher = async (url:string)=>{
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
const ForumQuestion = (props:{ressort:string | string[], mutate:Function, setQuestion:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const {data} = useSWR('/api/forum/', fetcher);
    const {data:session} = useSession();
    const user = session!.user;
    const ressort = props.ressort;
    const mutate = props.mutate;
    const setQuestion = props.setQuestion;
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
      const [value, setValue] = useState('');
      const [formdata, setFormdata] = useState({
        theme:"",
        ressort:ressort,
      })
      const {theme} = formdata;
      console.log(theme)
      //suche
      const [filteredForum, setFilteredForum] = useState<ForumDocument[]>([]);
      useEffect(()=>{
            if(theme !== "" && theme.length > 10){
                setFilteredForum(data.filter((item:ForumDocument)=>{
                    return Object.values(item).join().toLowerCase().includes(theme.toLowerCase())
                }))
            }
      },[theme])
      const onSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        const forumData = {
            ressort,
            theme,
            senderId:user._id,
            senderName:user.username,
            senderProfilePicture:user.profilePicture,
            question:value.trim(),
        }
        try{
            await fetch('/api/forum/',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(forumData),
            })
            mutate('/api/forum')
            toast.success("Beitrag gepostet");
        } catch(error){
            toast.error("Derzeit nicht möglich. Versuchen Sie es bitte später nochmal")
        }
      }
  return (
    <div className={styles.childContainer}>
        <ToastContainer/>
        <div className={styles.close}>
            <span className={styles.x} title="Schließen" onClick={()=>setQuestion(false)}>X</span>
        </div>
        <div className={styles.moduleWrapper}>
            <div className={styles.questionWrapper} style={filteredForum.length > 0 ? {width:"50%"}: {width:"100%"}}>
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
                    <ReactQuill theme="snow" modules={modules} value={value} onChange={setValue}/>
                    <div className={styles.buttonWrapper}>
                        <button type="submit" className={styles.sendBtn}>Absenden</button>
                    </div>
                </form>
            </div>
            {filteredForum ? filteredForum.map((item:ForumDocument)=>(
                <div className={styles.filteredWrapper} key={item._id}>
                    <Link className='link' href={`/api/forum/${ressort}/${item._id}`}></Link>
                    <div className={styles.header}>
                        <h5 className="headline" style={{fontSize:"20px"}}>{item.theme}</h5>
                        {parse(`<p className={styles.question}>${item.question}</p>`)}
                    </div>
                </div>
            )) : null}
        </div>
    </div>
  )
}

export default ForumQuestion