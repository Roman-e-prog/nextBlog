"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import styles from './page.module.css'
import {useForm} from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {useRouter, useSearchParams, usePathname} from 'next/navigation'

type FormValues = {
  password:string,
  passwordValidation:string,
}
const Token = () => {
  const router = useRouter();
  const params = useParams()
   const token = params.token;
  
  const {register, handleSubmit, formState, watch} = useForm<FormValues>({
    defaultValues:{
      password:"",
      passwordValidation:"",
    }
  })
  const {errors, isValid, isDirty, isSubmitting} = formState;
  const onSubmit = async (data:FormValues)=>{
    const resetData = {
      type:"reset",
      resetToken: token,
      password:data.password,
    }
    console.log(resetData);
    await fetch('/api/auth/forgotten/',{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(resetData)
    }).then((res)=>res.text()).then((text)=>{
      toast.error(text);
    })
    router.push('/authUser/login')
  }
  return (
    <div className={styles.container}>
      <ToastContainer/>
      <div className={styles.formWrapper}>
        <div className={styles.headerWrapper}>
          <h2>Neues Passwort</h2>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Passwort</label>
            <input type="password"
                  id="password"
                  className={styles.input}
                  {...register("password",{
                    required:{
                      value:true,
                      message:"Bitte geben Sie ein Passwort ein"
                    },
                    minLength:{
                      value:6,
                      message:"Das Passwort muss mindestends 6 Zeichen umfassen"
                    },
                  })}
                   />
                   <div className="errors">{errors.password?.message}</div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="passwordValidation" className={styles.label}>Passwort validieren</label>
            <input type="password"
                  id="passwordValidation"
                  className={styles.input}
                  {...register("passwordValidation",{
                    required:{
                      value:true,
                      message:"Bitte geben Sie das Passwort nochmal ein"
                    },
                    minLength:{
                      value:6,
                      message:"Das Passwort muss mindestends 6 Zeichen umfassen"
                    },
                    validate: (fieldValue)=>fieldValue === watch('password') || "Die Passwörter müssen übereinstimmen"
                  })}
                   />
                   <div className="errors">{errors.password?.message}</div>
          </div>
          <div className={styles.buttonWrapper}>
            <button className={styles.sendBtn} type="submit" disabled={!isDirty || !isValid || isSubmitting}>Password Reset</button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Token