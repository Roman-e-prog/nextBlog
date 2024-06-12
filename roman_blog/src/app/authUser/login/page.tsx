"use client"
import React, { useEffect } from 'react'
import styles from './page.module.css'
import {useForm} from 'react-hook-form'
import { useSession, signIn } from "next-auth/react"
import {useRouter} from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
type FormValues = {
    username:string,
    email:string,
    password:string,
}
const Login = () => {
  const {data:session} = useSession();
  const router = useRouter();
  useEffect(()=>{
    if(session){
      if(session.user.isAdmin){
        router.push('/dashboard')
      }
      else{
        router.push('/')
      }
    }
  },[session, router])
    const {register, handleSubmit, formState, reset, watch} = useForm<FormValues>({
        defaultValues:{
            username:"",
            email:"",
            password:"",
        }
    })
    const {errors, isDirty, isValid, isSubmitting, isSubmitted} = formState;
    const forgottenEmail = watch("email");
    const handleForgotten = async ()=>{
      if(forgottenEmail === ""){
        toast.error("Sie müssen Ihre Email eingeben, um Ihr Passwort zurückzusetzen")
      }
      else{
        const forgottenData = {
          type:"forgotten",
          email:forgottenEmail,
        }
        const res = await fetch('/api/auth/forgotten',{
          method:"POST",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(forgottenData)
  
        }).then((res)=>res.text()).then((text)=>{
          toast.error(text)
        })
      }
    }

    useEffect(()=>{
        if(isSubmitted){
            reset();
        }
    },[isSubmitted, reset])
    const onSubmit = (data:FormValues)=>{
      signIn("credentials", {
        username:data.username,
        email:data.email,
        password:data.password,
      });
    }
  return (
    <div className={styles.container}>
      <ToastContainer aria-label="message"/>
        <div className={styles.formWrapper}>
        <div className={styles.headerWrapper}>
          <h1 className={styles.heading}>Login</h1>
        </div>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} data-testid="loginForm">
            <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input type="text"
                  id="username"
                  className={styles.input}
                  {...register("username",{
                    required:{
                      value:true,
                      message:"Der Username ist ein Pflichtfeld"
                    }
                  })}
                   />
                   <div className="errors">{errors.username?.message}</div>
          </div>
            <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input type="email"
                  id="email"
                  className={styles.input}
                  {...register("email",{
                    required:{
                      value:true,
                      message:"Email ist ein Pflichtfeld"
                    }
                  })}
                   />
                   <div className="errors">{errors.email?.message}</div>
          </div>
            <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Passwort</label>
            <input type="password"
                  id="password"
                  className={styles.input}
                  {...register("password",{
                    required:{
                      value:true,
                      message:"Das Passwort ist ein Pflichtfeld"
                    }
                  })}
                   />
                   <div className="errors">{errors.password?.message}</div>
          </div>
          <div className={styles.buttonWrapper}>
          <button className={styles.sendBtn} type="submit" disabled={!isValid || !isDirty || isSubmitting} id="loginBtn" data-testid="loginBtn">Absenden</button>
          </div>
            </form>
            <button className={styles.forgottenButton} type="button" onClick={handleForgotten} id="forgottenBtn">Passwort vergessen</button>
        </div>
    </div>
  )
}

export default Login