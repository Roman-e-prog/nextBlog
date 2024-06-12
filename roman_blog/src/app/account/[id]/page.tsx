"use client"
import React, {useEffect, useCallback, useState} from 'react';
import styles from './page.module.css';
import useSWR,{mutate} from 'swr';
import { useParams } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {useForm} from 'react-hook-form';
import {useDropzone} from 'react-dropzone'
import { ForumDocument } from '@/models/Forum';
import Link from 'next/link';
import parse from 'html-react-parser';
import { useRouter } from 'next/navigation';
import ForumEdit from '@/components/forumEdit/ForumEdit';
import { AdminMessageDocument } from '@/models/AdminMessage';
import { UserDocument } from '@/models/User';
// const fetcher = async (url:string)=>{
//   const response = await fetch(url);
//   const data = await response.json();
//   return data;
// }
type FormValues = {
  vorname:string
  nachname:string
}

const Account = () => {
  const {id} = useParams();
  const router = useRouter();
  // const {data:userdata, error:usererror} = useSWR(`/api/user/${id}`, fetcher, {revalidateOnFocus:false});
  // const {data:forumdata, error:forumerror} = useSWR(userdata && '/api/forum/', fetcher, {revalidateOnFocus:false});
  // const {data:adminMessages, error:adminMessageserror} = useSWR(userdata && '/api/adminMessages/', fetcher);
  // console.log(adminMessages);
 
  const [userdata, setUserdata] = useState({
    vorname:"",
    nachname:"",
    username:"",
  })
  const {vorname, nachname, username} = userdata;
 
  const [forumdata, setForumdata] = useState<ForumDocument[]>([])
  const [adminMessages, setAdminMessages] = useState<AdminMessageDocument[]>([])
useEffect(()=>{
  fetch(`/api/user/${id}`)
  .then((res)=>res.json())
  .then((data)=>{
    setUserdata({...data})
  })
},[id])
useEffect(()=>{
  fetch('/api/forum/')
  .then((res)=>res.json())
  .then((data)=>{
    setForumdata(data)
  })
},[])
useEffect(()=>{
  fetch('/api/adminMessages/')
  .then((res)=>res.json())
  .then((data)=>{
    setAdminMessages(data)
  })
},[])

  const filteredForumdata = forumdata.filter((item:ForumDocument)=>item.senderId === id);
  const filteredAdminMessages = adminMessages.filter((item:AdminMessageDocument)=>item.senderId === id);
  const {register, handleSubmit, formState, reset} = useForm<FormValues>()
  useEffect(() => {
    if (userdata) {
      reset({
        vorname: userdata.vorname,
        nachname: userdata.nachname,
      });
    }
  }, [userdata, reset]);
  const {errors, isSubmitting} = formState;
  //files
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("")
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setPreview(URL.createObjectURL(acceptedFiles[0]))
  }, []);
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const onSubmit = async (data:FormValues)=>{
      if(!file){
        const updateData = {
          vorname:data.vorname,
          nachname:data.nachname,
        }
        try{
          await fetch(`/api/user/${id}`,{
            method:"PUT",
            headers:{
              'Content-Type': 'application/json'
            },
            body:JSON.stringify(updateData)
          })
        }catch(error:any){
          toast.error(error.message)
        }
      } else{
        const formdata = new FormData();
        formdata.append('vorname', data.vorname)
        formdata.append('nachname', data.nachname)
        formdata.append('profilePicture', file);
          try{
            await fetch(`/api/user/${id}`,{
              method:"PUT",
              body:formdata,
            })
          } catch(error:any){
            toast.error(error.message)
          }
      }
  }
  const [warning, setWarning] = useState(false)
  const handleWarn = ()=>{
    setWarning(true);
  }
  const [message, setMessage] = useState(false)
  const handleMessage = ()=>{
    setMessage(true);
  }
const [messageFormdata, setMessageFormdata] = useState({
  userMessage:"",
})
const {userMessage} = messageFormdata;
const handleMessageSend = async (e:React.FormEvent)=>{
  e.preventDefault();
  if(userMessage === ""){
    toast.error("Wenn du mir eine Nachricht senden willst, musst du auch etwas eingeben")
  } else{
    const userMessagedata = {
      senderId: id,
      senderName:userdata!.username,
      userMessage,
    }
    try{
      const res = await fetch('/api/userMessages',{
        method:"POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(userMessagedata)
      })
        setMessage(false)
        setWarning(false)
      
    } catch(error:any){
      toast.error(error.message)
    }
  }
}
const handleDeleteAccount = async ()=>{
  await fetch(`/api/user/${id}`,{
    method:"DELETE"
  })
  router.push('/')
}
//edit and delete question
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

  return (
    <div className={styles.container}>
      <ToastContainer/>
      <div className={styles.headerWrapper}>
        <h1 className={styles.headline}>Dein Account:</h1>
        <div className={styles.deleteWrapper} data-testid="deleteWrapper">
          {warning ? <div className={styles.warningModule}>
            <h4 className={styles.warnHeadline} data-testid="warnHeadline">Willst du wirklich deinen Account löschen</h4>
            <div className={styles.btnWrapper}>
              <button type="button" onClick={()=>setWarning(false)} className={styles.no}>Nein, auf keinen Fall</button>
              <button type="button" onClick={handleMessage} className={styles.messageBtn}>Möchtest, du mir eine Nachricht senden</button>
              <button type="button" onClick={handleDeleteAccount} className={styles.yes}>Ja, auf jeden Fall</button>
            </div>
          </div> : <button type="button" onClick={handleWarn} className={styles.warn} data-testid="warn">Account Delete</button>}
          {message ? <div className={styles.messageModule}>
              <form className={styles.messageForm} onSubmit={(e)=>handleMessageSend(e)}>
                <textarea name="userMessage" 
                            id="userMessage" 
                            cols={10} 
                            rows={10}
                            placeholder="Deine Nachricht"
                            value={userMessage}
                            onChange={(e)=>setMessageFormdata({...messageFormdata, userMessage:e.target.value})}
                            >
                            </textarea>
                            <button type="submit" className={styles.sendBtn}>Absenden</button>
                            <button type="button" onClick={()=>setMessage(false)}>Schließen</button>
              </form>
            </div> : null}
        </div>
      </div>
      <div className={styles.answerWrapper}>
        {filteredAdminMessages ? filteredAdminMessages.map((item:AdminMessageDocument)=>(
          <div className={styles.adminMessageField} key={item._id}>
            <h5 className='headline'>Hallo {item.senderName}, danke für deine Frage</h5>
            <p className={styles.answer}>{item.adminMessage}</p>
            <p className={styles.greeting}>Gruß {item.adminname}</p>
          </div>
        )):null}
      </div>
      <div className={styles.formWrapper} data-testid="fotoWrapper">
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.imageDrop}>
            <div {...getRootProps()} className={styles.inputfileContainer}>
              <input {...getInputProps()} className={styles.inputFile}/>
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  file ? <p>{file.name}</p> : <p>Drag and drop some files here, or click to select files</p>
              }
              {preview ? <img src={preview} alt="preview"/> : null}
            </div>
          </div>
        <div className={styles.userupdate} data-testid="userUpdate">
          <h3 className={styles.updateHeadline}>username und email müssen gleichbleiben.</h3>
          <h3 className={styles.updateHeadline}> Das Passwort kann mit der Passwort vergessen im Login verändert werden.</h3>
        <div className={styles.formGroup}>
            <label htmlFor="vorname" className={styles.label}>Vorname:</label>
            <input type="text"
                  id="vorname"
                  className={styles.input}
                  {...register("vorname",{
                    required:{
                      value:true,
                      message:"Der Vorname ist ein Pflichtfeld"
                    }
                  })}
                   />
                   <div className="errors">{errors.vorname?.message}</div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="nachname" className={styles.label}>Nachname:</label>
            <input type="text"
                  id="nachname"
                  className={styles.input}
                  {...register("nachname",{
                    required:{
                      value:true,
                      message:"Der Nachname ist ein Pflichtfeld"
                    }
                  })}
                   />
                   <div className="errors">{errors.nachname?.message}</div>
          </div>
        </div>
        <button type="submit" className={styles.sendBtn} disabled={isSubmitting}>Absenden</button>
        </form>
      </div>
      <div className={styles.userQuestions} data-testid="userQuestions">
        <div className={styles.headerWrapper}>
          <h3 className={styles.headline}>Deine Beiträge</h3>
        </div>
          {filteredForumdata ? filteredForumdata.map((item:ForumDocument)=>(
            <Link href={`/forum/${item.ressort}/${item._id}`} className='link' key={item._id}>
              <div className={styles.fieldWrapper}>
                <h4 className={styles.headline}>{item.ressort}</h4>
                  <div className={styles.theme}>
                      <h5 className={styles.headline}>{item.theme}</h5>
                      <div className={styles.icons}>
                        <span className='material-symbols-outlined' onClick={()=>handleEdit(item._id)}>edit</span>
                    </div>
                    <div className={styles.icons}>
                        <span className='material-symbols-outlined'  onClick={()=>handleDelete(item._id)}>delete</span>
                    </div>
                  </div>
                  {parse(`<p>${item.question}</p>`)}
              </div>
            </Link>
          )):null}
      </div>
      {edit ? <ForumEdit setEdit={setEdit} editId={editId} editData={editData} mutate={()=>mutate('/api/forum/')}/> : null}
    </div>
  )
}

export default Account