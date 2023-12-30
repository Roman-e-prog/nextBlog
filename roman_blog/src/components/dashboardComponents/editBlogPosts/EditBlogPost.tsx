"use client"
import React,{ChangeEvent, useState} from 'react'
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
   console.log("Hier Images",filedata.images);
    const onSubmit = async (data:FormValues)=>{
        if(!filedata.images.length){
            const blogPostData = {
                theme:data.theme,
                author:data.author,
                description:data.description,
                content:data.content,
            }
            try{
                await fetch(`/api/blogPosts/${id}`,{
                    method:"PUT",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(blogPostData)
                })
                props.mutate('api/blogPosts')
                toast.success("Update erfolgreich")
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
                const res = await fetch(`/api/blogPosts/${id}`,{
                    method:"PUT",
                    body:formdata,
                })
                console.log(res)
                props.mutate('/api/blogPosts')
                toast.success("Update erfolgreich")
                props.setEdit(false)
            } catch(error:any){
                console.log(error)
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