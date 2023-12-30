"use client"
import React,{useState} from 'react'
import styles from './page.module.css';
import useSWR,{useSWRConfig} from 'swr';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ForumComment from '@/components/forumComment/ForumComment';
import { ForumCommentsDocument } from '@/models/ForumComments';
import parse from 'html-react-parser';
import { ForumDocument } from '@/models/Forum';
import ForumEdit from '@/components/forumEdit/ForumEdit';
import ForumCommentsEdit from '@/components/forumCommentsEdit/ForumCommentsEdit';
import { useSession } from 'next-auth/react';
const fetcher = async (url:string)=>{
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object
    //@ts-ignore
    error.info = await response.text();
    //@ts-ignore
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data;
}
//For reanswers
type AnswerReply = {
  questionId: string,
  senderId: string,
  senderName:string,
  senderProfilePicture?:string,
  answerId:string,
  answererName:string,
  answer:string,
}
const SingleTheme = () => {
  const {id} = useParams();
  const {data: question} = useSWR(`/api/forum/${id}`, fetcher, { revalidateOnMount: true });
  const {data: comment} = useSWR('/api/forumComments/', fetcher, { revalidateOnMount: true });
  const { data:session } = useSession();
  const user = session?.user;
  const {mutate} = useSWRConfig();
  const filteredComments = comment?.filter((item:ForumCommentsDocument)=>item.questionId === id);
  //likes and other functions on questions
  const handleLikes = async (id:string)=>{
    if(!user || user?._id === question.senderId || question.likeUserId.includes(user?._id)){
      return;
    }
    else{
      const likeData = {
        id,
        likeUserId:user?._id,
        type:"likes"
      }
      try{
        await fetch('/api/forum/likes',{
          method:"POST",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(likeData),
        })
        mutate('/api/forum/')
      } catch(error:any){
        toast.error(error.message)
      }
    }
  }
  const handleDisLikes = async (id:string)=>{
    if(!user || user?._id === question.senderId || question.likeUserId.includes(user?._id) || question.dislikeUserId.includes(user?._id)){
      return;
    }
    else{
      const disLikeData = {
        id,
        likeUserId:user?._id,
        type:"dislikes"
      }
      try{
        await fetch('/api/forum/likes',{
          method:"POST",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(disLikeData),
        })
        mutate('/api/forum/')
      } catch(error:any){
        console.log(error);
      }
    }
  }
  //answers
  const [forumanswer, setForumanswer] = useState(false)
  const [questionId, setQuestionId] = useState("");
  const handleReply = async (id:string)=>{
    if(!user){
      toast.error("Sie müssen eingeloggt sein, um eine Antwort zu geben")
    }
    else{
      setQuestionId(id);
      setForumanswer(true);
    }
  }
  //this answer is correct
  const handleSolved = async (id:string)=>{
    if(!user || question.senderId !== user!._id){
      return;
    }
    else{
      const solvedData = {
        id:id,
        type:"solved",
        questionId:question._id
      }
      try{
        await fetch('/api/forumComments/likes',{
          method:"POST",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(solvedData),
        })
        } catch(error){
        console.log(error)
      }
    }
  }
  const handleAnswerLikes = async (id:string)=>{
    if(!user || filteredComments.some((item:ForumCommentsDocument)=>item.senderId === user!._id) || filteredComments.some((item:ForumCommentsDocument)=>item.likeUserId.includes(user!._id)) || filteredComments.some((item:ForumCommentsDocument)=>item.dislikeUserId.includes(user!._id))){
      return;
    }
    else{
      const likesData = {
        id:id,
        likeUserId:user?._id,
        type:"likes",
      }
      try{
        await fetch('/api/forumComments/likes',{
          method:"POST",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(likesData),
        })
        mutate(`/api/forumComments/${id}`)
        } catch(error){
        console.log(error)
      }
    }
  }
  const handleAnswerDislikes = async (id:string)=>{
    if(!user || filteredComments.some((item:ForumCommentsDocument)=>item.senderId === user!._id) || filteredComments.some((item:ForumCommentsDocument)=>item.likeUserId.includes(user!._id)) || filteredComments.some((item:ForumCommentsDocument)=>item.dislikeUserId.includes(user!._id))){
      return;
    }
    else{
      const dislikesData = {
        id:id,
        likeUserId:user?._id,
        type:"dislikes",
      }
      try{
        await fetch('/api/forumComments/likes',{
          method:"POST",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(dislikesData),
        })
        } catch(error){
        console.log(error)
      }
    }
  }
  //answer on answer
  const [answerReply , setAnswerReply] = useState<AnswerReply>({
    questionId:"",
    senderId: "",
    senderName:"",
    senderProfilePicture:"",
    answerId:"",
    answererName:"",
    answer:"",
  })
  const handleAnswerReply = (id:string, senderName:string)=>{
    if(user && user._id){
      setAnswerReply({
        questionId: question._id,
        senderId:user._id,
        senderName:user.username,
        senderProfilePicture:user.profilePicture,
        answerId:id,
        answererName:senderName,
        answer:"",

      })
    }
    setForumanswer(true);
  }
  //admin Edit and delete
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState("")
    const [editData, setEditData] = useState<ForumDocument | null>(null)
  const handleEdit = async (id:string)=>{
    await fetch(`/api/forum/${id}`)
    .then((res)=>res.json())
    .then((data)=>setEditData(data))
    setEditId(id)
    setEdit(true)
  }
  const handleDelete = async (id:string)=>{
    await fetch(`/api/forum/${id}`,{
      method:"DELETE",
    })
    await mutate('/api/forum/')
  }
  //answerEdit and Delete
  const [editAnswer, setEditAnswer] = useState(false);
  const [editAnswerId, setEditAnswerId] = useState("")
  const [editAnswerData, setEditAnswerData] = useState<ForumCommentsDocument | null>(null)
  const handleAnswerEdit = async (id:string)=>{
    await fetch(`/api/forumComments/${id}`)
    .then((res)=>res.json())
    .then((data)=>setEditAnswerData(data))
    setEditAnswerId(id)
    setEditAnswer(true)
  }
  const handleAnswerDelete = async (id:string)=>{
    await fetch(`/api/forumComments/${id}`,{
      method:"DELETE",
    })
    await mutate('/api/forumComments/')
  }
  return (
    <div className={styles.container}>
       <ToastContainer/>
      <div className={styles.headlineWrapper}>
        <h1 className='headline'>Ihr Thema</h1>
        <p>Sofern Sie eine Frage gestellt haben. Klicken Sie bitte auf den Haken bei der Antwort, die Ihre Frage gelöst hat</p>
      </div>
      {question ? <div className={styles.fieldWrapper}>
        <div className={styles.headerWrapper}>
          <h2>{question.theme}</h2>
          <span>{question.senderName}</span>
          <Image src={question.senderProfilePicture ? question.senderProfilePicture : '/images/placeholderprofile.jpg'} alt={question.senderName} width={40} height={40}/>
          {user?.isAdmin ? <div className={styles.functionsWrapper}>
                                    <div className={styles.icons}>
                                        <span className='material-symbols-outlined' onClick={()=>handleEdit(question._id)} style={{fontSize:"25px"}}>edit</span>
                                    </div>
                                    <div className={styles.icons}>
                                        <span className='material-symbols-outlined' onClick={()=>handleDelete(question._id)} style={{fontSize:"25px"}}>delete</span>
                                    </div>
                                </div>:null}
        </div>
        <div className={styles.questionWrapper}>
        {parse(`<p className={styles.question}>${question.question}</p>`)}
        </div>
        <div className={styles.likesWrapper}>
          <div className={styles.icons}>
              <span className='material-symbols-outlined' title="Wurde gelöst" style={question.solved ? {color:"yellow"}: {color:"inherit"}}>done</span>
          </div>
          <div className={styles.icons}>
              <span>{question.likes > 0 ? question.likes : null}</span>
              <span className='material-symbols-outlined' onClick={()=>handleLikes(question._id)} style={question.likeUserId.includes(user?._id) ? {color:"yellow"} :{cursor:"pointer", fontSize:"20px"}} title="like">Thumb_up</span>
          </div>
          <div className={styles.icons}>
              <span>{question.dislikes > 0 ? question.dislikes : null}</span>
              <span className='material-symbols-outlined' onClick={()=>handleDisLikes(question._id)} style={question.likeUserId.includes(user?._id) ? {color:"yellow"} :{cursor:"pointer", fontSize:"20px"}} title="dislike">Thumb_down</span>
          </div>
          <div className={styles.icons}>
              <span className='material-symbols-outlined' onClick={()=>handleReply(question._id)} style={{cursor:"pointer", fontSize:"20px"}}>reply</span>
          </div>
        </div>
      </div> : null}
      <div className={styles.commentWrapper}>
        {/* answers */}
        {forumanswer ? <div className={styles.answerWrapper}>
          <ForumComment questionId={questionId} answerReply={answerReply} setAnswerReply={setAnswerReply} setForumanswer={setForumanswer} mutate={()=>mutate(`/api/forum/${id}`)}/>
        </div>: null}
      </div>
      <div className={styles.answerWrapper}>
        {filteredComments ? filteredComments.map((item:ForumCommentsDocument)=>(
          <div className={styles.fieldWrapper} key={item._id}>
            <div className={styles.headerWrapper}>
                <p>{item.senderName}</p>
                <Image src={item.senderProfilePicture ? item.senderProfilePicture : '/images/placeholderprofile.jpg'} alt={item.senderName} width={40} height={40}/>
            </div>
            <div className={styles.forumCommentWrapper}>
            {parse(`<p>${item.answererName ? '@' + item.answererName + ' ' : ''} ${item.answer}</p>`)}
            </div>
            <div className={styles.likesWrapper}>
              <div className={styles.icons}>
                  <span className='material-symbols-outlined' title="Diese Anwort hat geholfen" onClick={()=>handleSolved(item._id)} style={{cursor:"pointer"}}>done</span>
              </div>
              <div className={styles.icons}>
                  <span>{item.likes > 0 ? item.likes : null}</span>
                  <span className='material-symbols-outlined' onClick={()=>handleAnswerLikes(item._id)} style={filteredComments.some((item:ForumCommentsDocument)=>item.likeUserId.includes(user!._id)) ? {color:"yellow", fontSize:"20px"}:{cursor:"pointer", fontSize:"20px"}} title="like">Thumb_up</span>
              </div>
              <div className={styles.icons}>
                  <span>{item.dislikes > 0 ? item.dislikes : null}</span>
                  <span className='material-symbols-outlined' onClick={()=>handleAnswerDislikes(item._id)} style={filteredComments.some((item:ForumCommentsDocument)=>item.dislikeUserId.includes(user!._id)) ? {color:"yellow", fontSize:"20px"}:{cursor:"pointer", fontSize:"20px"}} title="dislike">Thumb_down</span>
              </div>
              <div className={styles.icons}>
                  <span className='material-symbols-outlined' onClick={()=>handleAnswerReply(item._id, item.senderName)} style={{cursor:"pointer", fontSize:"20px"}}>reply</span>
              </div>
              {user?.isAdmin || user?._id === item.senderId ?
              <>
              <div className={styles.icons}>
                  <span className='material-symbols-outlined' onClick={()=>handleAnswerEdit(item._id)}>edit</span>
              </div>
              <div className={styles.icons}>
                  <span className='material-symbols-outlined' onClick={()=>handleAnswerDelete(item._id)}>delete</span>
              </div>
              </> 
              :null}
            </div>
          </div>
        )):null}
      </div>
      {edit ? <ForumEdit setEdit={setEdit} editId={editId} editData={editData} mutate={()=>mutate('/api/forum/')}/> : null}
      {editAnswer ? <ForumCommentsEdit  setEditAnswer={setEditAnswer} editAnswerId={editAnswerId} editAnswerData={editAnswerData} mutate={()=>mutate('/api/forumComments/')}/> : null}
    </div>
  )
}

export default SingleTheme