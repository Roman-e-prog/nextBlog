"use client"
import React,{useState, useEffect} from 'react'
import styles from './forumComment.module.css'
import { useUserSession } from "../sessionHook/SessionHook";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false });
import 'react-quill/dist/quill.snow.css';
type AnswerReply = {
    questionId: string,
    senderId: string,
    senderName:string,
    senderProfilePicture?:string,
    answerId:string,
    answererName:string,
    answer:string,
}
const ForumComment = (props:{questionId:string, answerReply:AnswerReply, setAnswerReply:React.Dispatch<React.SetStateAction<AnswerReply>>,setForumanswer:React.Dispatch<React.SetStateAction<boolean>>, mutate:Function}) => {
    const questionId = props.questionId;
    const answerReply = props.answerReply;
    const setAnswerReply = props.setAnswerReply;
    const setForumanswer = props.setForumanswer
    const { user, loading } = useUserSession();

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
        toolbar:toolbarOptions
      }
      const [value, setValue] = useState('');
      const onSubmit = async (e:any)=>{
        e.preventDefault();
        console.log("I am onSubmit")
        const userId = user!._id;
        const username = user!.username;
        const userProfilePicture = user!.profilePicture;
        const questionId = props.questionId;
        
        const forumCommentData = {
            questionId:questionId,
            senderName:username,
            senderId:userId,
            senderProfilePicture: userProfilePicture,
            answer:value.trim(),
        }
    try{
        await fetch('/api/forumComments/',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(forumCommentData)
        })
    } catch(error:any){
        toast.error(error.message)
    }
}
//answer on the answer
const answerReplyData = {...answerReply}
console. log(answerReplyData);
console.log(answerReply)
let answer = answerReplyData.answer;
useEffect(()=>{
    if(answerReplyData){
        answer = value;
    }
},[answerReplyData, value])
console.log(answerReplyData)
      const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
       
        const newAnswerData ={
            questionId: answerReplyData.questionId,
            senderId: answerReplyData.senderId,
            senderName:answerReplyData.senderName,
            senderProfilePicture:answerReplyData.senderProfilePicture,
            answerId:answerReplyData.answerId,
            answererName:answerReplyData.answererName,
            answer:value,
        }
        console.log(newAnswerData);
    try{
        await fetch('/api/forumComments/',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(newAnswerData)
        })
    } catch(error:any){
        toast.error(error.message)
    }
}

  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.headlineWrapper}>
            <h2>Deine Antwort</h2>
            <div className={styles.close}>
                <span className={styles.x} title="Schließen" onClick={()=>setForumanswer(false)}>X</span>
            </div>
        </div>
        <form className={styles.form} onSubmit={answerReplyData ? (e)=>handleSubmit(e) : (e)=>onSubmit(e)}>
            <ReactQuill theme="snow" modules={modules} value={value} onChange={setValue} />
            <button type="submit" className={styles.sendBtn}>Absenden</button>
        </form>
    </div>
  )
}

export default ForumComment