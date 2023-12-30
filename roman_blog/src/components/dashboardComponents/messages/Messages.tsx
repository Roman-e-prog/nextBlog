"use client"
import React,{useState, useEffect} from 'react'
import styles from './messages.module.css'
import useSWR, {useSWRConfig} from 'swr';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { UserMessagesDocument } from '@/models/UserMessages';
import { useUserSession } from '@/components/sessionHook/SessionHook';
import { AdminMessageDocument } from '@/models/AdminMessage';
import Spinner from '@/components/spinner/Spinner';
import EditAdminMessages from '../editAdminMessages/EditAdminMessages';
const fetcher = async (url:string)=>{
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
const Messages = () => {
    const {data:userMessagedata, error:userMessageError, isLoading} = useSWR('/api/userMessages/', fetcher,{revalidateOnFocus:false});
    const {data:adminMessagesdata, error: adminMessagesError} = useSWR('/api/adminMessages/', fetcher,{revalidateOnFocus:false})
    const {mutate} = useSWRConfig();
    
    //errorHandling
    useEffect(()=>{
        if(userMessageError){
            console.log(userMessageError)
            toast.error(userMessageError)
        } 
        else if(adminMessagesError){
            console.log(adminMessagesError)
            toast.error(adminMessagesError)
        }
    },[userMessageError, adminMessagesError])
    const {user} = useUserSession();
    const [messageFormdata, setMessageFormdata] = useState({
        adminMessage:"",
    })
    //answers
    const {adminMessage} = messageFormdata;
    const [answer, setAnswer] = useState(false);
        const [questionId, setQuestionId] = useState("");
        const [senderId, setSenderId] = useState("");
        const [senderName, setSenderName] = useState("");
    const handleAnswer = (id:string, senderId:string, senderName:string)=>{
        setAnswer(true);
        setQuestionId(id);
        setSenderId(senderId);
        setSenderName(senderName);
        console.log(id, senderId, senderName)
    }
    const onSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        if(adminMessage === ""){
            toast.error("Wolltest du jetzt mit einer leeren Nachricht antworten?")
        } 
        else{
            const adminMessageData = {
                questionId:questionId,
                adminId: user?._id,
                adminname: user?.username,
                senderId: senderId,
                senderName: senderName,
                adminMessage,
            }
            try{
                const res = await fetch('/api/adminMessages/',{
                    method:"POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(adminMessageData)
                })
                if(res.status === 201){
                    setAnswer(false);
                    toast.success("Antwort wurde gesendet");
                    await mutate("/api/userMessages/");
                    await mutate("/api/adminMessages/");
                }
            } catch(error:any){
                toast.error(error.message)
            }
        }
    }
    //adminMessage sort
    const sortedAdminMessages = adminMessagesdata && adminMessagesdata.sort((a:AdminMessageDocument, b:AdminMessageDocument)=> a.createdAt < b.createdAt ? 1 : -1)
    //search
    const [searchValue, setSearchValue] = useState("")
   
    const filteredAnswers = searchValue && adminMessagesdata.filter((item:AdminMessageDocument)=>{
        return Object.values(item).join().toLowerCase().includes(searchValue.toLowerCase());
    })
 
    //edit and delete
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState("")
    const [editData, setEditData] = useState<AdminMessageDocument | null>(null)
    const handleEdit = async (id:string)=>{
        await fetch(`/api/adminMessages/${id}`)
        .then((res)=>res.json())
        .then((data)=>setEditData(data));
        setEditId(id);
        setEdit(true);
    }
    const handleDelete = async (id:string)=>{
        await fetch(`/api/adminMessages/${id}`,{
            method:"DELETE",
        })
        await mutate('api/adminMessages/')
    }
    if(isLoading){
        return <Spinner data-testid="spinner"/>
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.userMessageWrapper}>
            {userMessagedata ? userMessagedata.map((item:UserMessagesDocument)=>(
                <div className={styles.fieldWrapper} key={item._id}>
                    <h3 className={styles.userName}>{item.senderName}</h3>
                    <span className={styles.id}> Frage Nr: {item._id}</span>
                    <p className={styles.userMessage}>{item.userMessage}</p>
                    <span className={styles.created}>{new Date(item.createdAt).toLocaleString("de-De")}</span>
                    {item.isAnswered ? <span className='material-symbols-outlined' style={{color:"green"}}>check</span> :null}
                    <button type="button" onClick={()=>handleAnswer(item._id, item.senderId, item.senderName)} className={styles.sendBtn}>Antworten</button>
                </div>
            )):null}
        </div>
        <div className={styles.answerWrapper}>
        {answer ? <div className={styles.formWrapper}>
        <span className={styles.close} title="Schließen" onClick={()=>setAnswer(false)}>X</span>
            <form className={styles.form} onSubmit={onSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="adminMessage">Anwortnachricht</label>
                    <textarea name="adminMessage" 
                                id="adminMessage" 
                                cols={20} 
                                rows={20}
                                required
                                value={adminMessage}
                                onChange={(e)=>setMessageFormdata({...messageFormdata, adminMessage:e.target.value})}
                                ></textarea>
                </div>
                <button type='submit' className={styles.sendBtn}>Absenden</button>
            </form>
        </div> : null}
        {edit ? <EditAdminMessages setEdit={setEdit} editId={editId} editData={editData} mutate={()=>mutate('/api/adminMessages')}/> : null}
            <div className={styles.searchWrapper}>
                <form className={styles.searchForm}>
                    <input type="text"
                            name="searchValue"
                            id="searchValue"
                            className={styles.input}
                            placeholder="Antwort suchen"
                            onChange={(e)=>setSearchValue(e.target.value)} />
                </form>
                <div className={styles.searchResult}>
                    {filteredAnswers ? filteredAnswers.map((item:AdminMessageDocument)=>(
                            <div className={styles.fieldWrapper} key={item._id}>
                            <h4>{item.adminname} an:</h4>
                            <h5>{item.senderName}</h5>
                            <span>Frage Nr: {item.questionId}</span>
                            <p>{item.adminMessage}</p>
                            <div className={styles.functions}>
                                <span>{new Date(item.createdAt).toLocaleString("de-De")}</span>
                                <div className={styles.icons}>
                                    <div className={styles.icon}>
                                        <span className='material-symbols-outlined' onClick={()=>handleEdit(item._id)}>edit</span>
                                    </div>
                                    <div className={styles.icon}>
                                        <span className='material-symbols-outlined'  onClick={()=>handleDelete(item._id)}>delete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )):null}
                </div>
            </div>
            <div className={styles.allAnswers}>
                {!searchValue && sortedAdminMessages ? sortedAdminMessages.map((item:AdminMessageDocument)=>(
                    <div className={styles.fieldWrapper} key={item._id}>
                        <h4>{item.adminname} an:</h4>
                        <h5>{item.senderName}</h5>
                        <span>Frage Nr: {item.questionId}</span>
                        <p>{item.adminMessage}</p>
                        <div className={styles.functions}>
                                <span>{new Date(item.createdAt).toLocaleString("de-De")}</span>
                                <div className={styles.icons}>
                                    <div className={styles.icon}>
                                        <span className='material-symbols-outlined' onClick={()=>handleEdit(item._id)}>edit</span>
                                    </div>
                                    <div className={styles.icon}>
                                        <span className='material-symbols-outlined'  onClick={()=>handleDelete(item._id)}>delete</span>
                                    </div>
                                </div>
                            </div>
                    </div>
                )):null}
            </div>
        </div>
    </div>
  )
}

export default Messages