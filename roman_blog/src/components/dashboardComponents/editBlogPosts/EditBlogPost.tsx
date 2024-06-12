"use client"
import React,{ChangeEvent, useState, useEffect} from 'react'
import styles from './editBlogpost.module.css'
import { BlogPostDocument } from '@/models/BlogPost';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {useForm} from 'react-hook-form';
type FormValues = {
    theme:string,
    author:string,
    description:string,
    content:string,
    images:string[],
}

const EditBlogPost = (props:{setEdit:React.Dispatch<React.SetStateAction<boolean>>, editId:string, editData:BlogPostDocument | null, mutate:Function}) => {
    const editData = props.editData;
    const id = props.editId;
    const mutate = props.mutate
    useEffect(()=>{
        console.log('page is rendered')
    console.log(mutate, 'here in blogPostEdit')
    },[mutate])
    
    const {register, handleSubmit, reset, formState, watch} = useForm<FormValues>({
        defaultValues:{
            theme:editData?.theme,
            author:editData?.author,
            description:editData?.description,
            content:editData?.content,
        }
    })
    const {errors, isValid, isSubmitting} = formState;
   const [filedata, setFiledata] = useState<{images:(string | File)[]}>({
        images:editData!.images,
   })
   const handleFileChange = (e:ChangeEvent<HTMLInputElement>, index:number)=>{
        const newImages = [...filedata.images];
        const file = e.target.files ? e.target.files[0] : null;
        if(!file){
            return
        }
        newImages[index] = file;
        setFiledata((prevState)=>({
            ...prevState,
            images: newImages
        }))
   }
   
    const onSubmit = async (data:FormValues)=>{
        if(!filedata.images || !filedata.images.length){
            const blogPostData = {
                theme:data.theme,
                author:data.author,
                description:data.description,
                content:data.content,
            }
            try{
                const response = await fetch(`/api/blogPosts/${id}`,{
                    method:"PUT",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(blogPostData)
                })
                const updatedData = await response.json();
                await mutate('/api/blogPosts/', updatedData, false)
                toast.success("Update erfolgreich")
                props.setEdit(false)
            } catch(error:any){
                toast.error(error.message)
            }
        } else{
            const formdata = new FormData();
            formdata.append('theme', data.theme);
            formdata.append('author', data.author);
            formdata.append('description', data.description);
            formdata.append('content', data.content)
            filedata.images.forEach((image: File | string, index: number) => {
                if(image instanceof File){
                    formdata.append( 'images', image);
                } else{
                    formdata.append("images", image)
                }
            });
            try{
                const response = await fetch(`/api/blogPosts/${id}`,{
                    method:"PUT",
                    body:formdata,
                })
                const updatedData = await response.json()
                await mutate('/api/blogPosts/', updatedData, false)
                toast.success("Update erfolgreich")
                props.setEdit(false)
            } catch(error:any){
                toast.error(error.message)
            }
        }
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.headerWrapper}>
            <h3 className={styles.headline}>Update Blog Posts</h3>
            <div className={styles.close} onClick={()=>props.setEdit(false)} title="Schließen">X</div>
        </div>
        <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} data-testid="editBlogpostForm">
                <div className={styles.formGroup}>
                    <label htmlFor="theme" className={styles.label}>Thema</label>
                    <input type="text"
                            id="theme"
                            className={styles.input}
                            data-testid="blogpostTheme"
                            {...register("theme",{
                                required:{
                                    value:true,
                                    message:"Thema ist ein Pflichtfeld"
                                }
                            })} />
                            <span className="errors">{errors.theme?.message}</span>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="author" className={styles.label}>Autor</label>
                    <input type="text"
                            id="author"
                            className={styles.input}
                            data-testid="blogpostAuthor"
                            {...register("author",{
                                required:{
                                    value:true,
                                    message:"Autor ist ein Pflichtfeld"
                                }
                            })} />
                            <span className="errors">{errors.author?.message}</span>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>Beschreibung</label>
                    <input type="text"
                            id="description"
                            className={styles.input}
                            data-testid="blogpostDescription"
                            {...register("description",{
                                required:{
                                    value:true,
                                    message:"Autor ist ein Pflichtfeld"
                                }
                            })} />
                            <span className="errors">{errors.description?.message}</span>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content" className={styles.label}>Inhalt</label>
                    <textarea
                            cols={50}
                            rows={50}
                            id="content"
                            data-testid="blogpostContent"
                            className={styles.input}
                            {...register("content",{
                                required:{
                                    value:true,
                                    message:"Inhalt ist ein Pflichtfeld"
                                }
                            })} />
                            <span className="errors">{errors.content?.message}</span>
                </div>
                {filedata!.images ? filedata?.images.map((image, index)=>(
                         <div className={styles.formGroup} key={index}>
                         <label htmlFor="images" className={styles.label}>{`Bild Nr.${index+1}`}</label>
                         <input type="file"
                                 id="images"
                                 className={styles.input}
                                 onChange={(e)=>handleFileChange(e, index)}
                                 />
                     </div>
                )):null}
                <button className={styles.sendBtn} type="submit" disabled={!isValid || isSubmitting} data-testid="editBlogpostBtn">Absenden</button>
            </form>
        </div>
    </div>
  )
}

export default EditBlogPost