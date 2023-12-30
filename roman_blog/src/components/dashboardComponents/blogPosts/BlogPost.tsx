"use client"
import React,{useEffect, useRef, useState} from 'react'
import styles from './blogPost.module.css'
import useSWR,{useSWRConfig} from 'swr';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {useForm} from 'react-hook-form'
import { BlogPostDocument } from '@/models/BlogPost';
import Image from 'next/image';
import EditBlogPost from '../editBlogPosts/EditBlogPost';
import Spinner from '@/components/spinner/Spinner';
// Define the fetcher function
const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  type FormValues = {
    theme:string,
    author:string,
    description:string,
    content:string,
    images:File[],
  }
const BlogPost = () => {
    const { data, error, isLoading} = useSWR('/api/blogPosts/', fetcher);
    useEffect(()=>{
        if(error){
            toast.error(error)
        }
    },[error])
    const {mutate} = useSWRConfig();
    const {register, handleSubmit, formState, watch, reset} = useForm<FormValues>({
        defaultValues:{
            theme:"",
            author:"",
            description:"",
            content:"",
            images:[]
        },
        mode:"onBlur"
    })
    const {errors, isValid, isSubmitting, isSubmitted} = formState;
    let files = watch('images');

     const [preview, setPreview] = useState<string[] | null>([]);
     useEffect(() => {
        if (files && files.length > 0) {
            const filesArray = Array.from(files); // Convert FileList to Array
            const newPreview: string[] = [];
    
            filesArray.forEach((file: any) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    newPreview.push(reader.result as string);
                    if (newPreview.length === filesArray.length) {
                        setPreview(newPreview);
                    }
                };
            });
        }
    }, [files]);
    useEffect(()=>{
        if(isSubmitted){
            reset();
        }
    },[isSubmitted])
    const onSubmit = async (data:FormValues)=>{
        if(!data.images.length){
            const blogPostData = {
                theme:data.theme,
                author:data.author,
                description:data.description,
                content:data.content,
            }
            try{
                await fetch('/api/blogPosts',{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(blogPostData)
                })
                mutate('/api/blogPosts')
            } catch(error:any){
                toast.error(error.message)
            }
        } 
        else{
            const formData = new FormData();
            Object.entries(data).forEach(([key, value])=>{
                if (key === 'images' && value.length) {
                    for (let i = 0; i < value.length; i++) {
                        formData.append(key, value[i]);
                    }
                } else {
                    formData.append(key, value as string);
                }
            })
            try{
                await fetch('/api/blogPosts/',{
                    method:"POST",
                    body:formData
                })
                mutate('/api/blogPosts')
            } catch(error:any){
                toast.error(error)
            }
        } 
    }
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState("");
    const [editData, setEditData] = useState<BlogPostDocument | null>(null)
    const handleEdit = async (id:string)=>{
        const res = await fetch(`/api/blogPosts/${id}`)
        const data = await res.json();
        setEditData(data);
        setEditId(id);
        setEdit(true);
    }
    const handleDelete = async (id:string)=>{
        try{
            await fetch(`/api/blogPosts/${id}`,{
                method:"DELETE"
            })
            await mutate(`/api/blogPosts/`)
            toast.success("Blog Post gelöscht")
        } catch(error:any){
            toast.error(error.message)
        }
    }
    if(isLoading){
        return <Spinner/>
    }
  return (
    <div className={styles.container}>
        <ToastContainer/>
        <div className={styles.blogPostsWrapper}>
        <div className={styles.headerWrapper}>
                <h3 className={styles.headline}>Alle Blog Posts</h3>
                </div>
            {data ? data.map((item:BlogPostDocument)=>(
                <div className={styles.fieldWrapper} key={item._id} data-testid="blogPostField">
                    <div className={styles.textWrapper}>
                        <h3>{item.theme}</h3>
                        <h4>{item.author}</h4>
                        <p>{item.description}</p>
                        <p>{item.content}</p>
                    </div>
                    <div className={styles.imageWrapper}>
                        {item.images.length > 0 ? item.images.map((image:string, index:number)=>(
                            <div className={styles.singleImage} key={index}>
                                <Image src={image} alt={`Bild Nr: ${index + 1}`} title={`Bild Nr: ${index + 1}`} width={150} height={150} className={styles.blogImage}/>
                            </div>
                        )):null}
                    </div>
                    <div className={styles.iconWrapper}>
                        <div className={styles.icons} onClick={()=>handleEdit(item._id)}><span className="material-symbols-outlined" data-testid="editblogposts">Edit</span></div>
                        <div className={styles.icons} onClick={()=>handleDelete(item._id)} data-testid="deleteblogposts"><span className="material-symbols-outlined">Delete</span></div>
                    </div>
                </div>
            )):null}
        </div>
        <div className={styles.formWrapper}>
            <div className={styles.headerWrapper}>
                <h3 className={styles.headline}>Neuer Blog Post</h3>
                </div>
            <div className={styles.formWrapper}>
                {edit ? <EditBlogPost setEdit={setEdit} editId={editId} editData={editData} mutate={()=>mutate('/api/blogPosts')}/> :  <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup} data-testid="blogPostForm">
                    <label htmlFor="theme" className={styles.label}>Thema</label>
                    <input type="text"
                        id="theme"
                        className={styles.input}
                        data-testid="blogPostTheme"
                        {...register("theme",{
                            required:{
                            value:true,
                            message:"Bitte das Thema eingeben"
                            }
                        })}
                        />
                        <div className="errors">{errors.theme?.message}</div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="author" className={styles.label}>Autor</label>
                    <input type="text"
                        id="author"
                        className={styles.input}
                        {...register("author",{
                            required:{
                            value:true,
                            message:"Bitte den Autor eingeben"
                            }
                        })}
                        />
                        <div className="errors">{errors.author?.message}</div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>Beschreibung</label>
                    <input type="text"
                        id="description"
                        className={styles.input}
                        {...register("description",{
                            required:{
                            value:true,
                            message:"Bitte den Autor eingeben"
                            }
                        })}
                        />
                        <div className="errors">{errors.description?.message}</div>
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
                            message:"Bitte den Autor eingeben"
                            }
                        })}
                        />
                        <div className="errors">{errors.content?.message}</div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="images" className={styles.label}>Bilder</label>
                    <input type="file"
                        {...register("images")}
                        id="images"
                        multiple
                        className={styles.input}
                        />
                        <div className={styles.previewWrapper}>
                            {preview ? preview.map((file, index)=>(
                                <Image src={file} alt={`Bild Nr. ${index+1}`} title={`Bild Nr. ${index+1}`} width={100} height={100} style={{marginRight:"5px"}} key={index}/>
                            )):null}
                        </div>
                </div>
                <button className={styles.sendBtn} type="submit" disabled={!isValid || isSubmitting} data-testid="blogPostSubmit">Absenden</button>
                </form>}
            </div>
        </div>
    </div>
  )
}

export default BlogPost