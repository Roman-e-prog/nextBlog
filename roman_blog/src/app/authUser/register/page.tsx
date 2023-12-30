"use client"
import React, { useEffect } from 'react'
import styles from './page.module.css'
import {useForm} from "react-hook-form"
import {useRouter} from 'next/navigation';
import Link from 'next/link'
import debounce from 'lodash.debounce';
type FormValues = {
  vorname: string
  nachname: string
  username:string
  email: string
  password:string
  passwordValidation:string
}
const Register = () => {
  const router = useRouter();
  const {register, handleSubmit, formState, watch, reset} = useForm({
    defaultValues:{
      vorname:"",
      nachname:"",
      username:"",
      email:"",
      password:"",
      passwordValidation:"",
    }, 
    mode:"onBlur"
  })
  const {errors, isDirty, isValid, isSubmitting, isSubmitted} = formState
  useEffect(()=>{
    if(isSubmitted){
      reset()
    }
  },[isSubmitted])
  const onSubmit = async (data:FormValues)=>{
    const registerData = {
      vorname:data.vorname,
      nachname:data.nachname,
      username:data.username,
      email:data.email,
      password: data.password,
    }
    try{
      const res = await fetch('/api/auth/register/',{
        method:"POST",
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(registerData)
      })
      res.status === 201 && router.push("/authUser/login?success=Account has been created");
    } catch(error){
      console.log(error)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.headerWrapper}>
          <h1 className={styles.heading}>Registrierung</h1>
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} data-testid="register-form">
          <div className={styles.formGroup}>
            <label htmlFor="vorname" className={styles.label}>Vorname</label>
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
            <label htmlFor="nachname" className={styles.label}>Nachname</label>
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
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input type="text"
                  id="username"
                  className={styles.input}
                  {...register("username",{
                    required:{
                      value:true,
                      message:"Der username ist ein Pflichtfeld"
                    },
                    validate: debounce(async (fieldValue)=>{
                      const username = {
                        type:"username",
                        username:fieldValue,
                      }
                      console.log(username)
                      const res = await fetch('/api/auth/unique',{
                        method:"POST",
                        headers:{
                          'Content-Type':'application/json'
                        },
                        body:JSON.stringify(username)
                        })
                        const data = await res.json();
                        return data == null || "Der Username ist bereits vergeben. Bitte wählen Sie einen neuen."
                      }, 500)
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
                      message:"Die Email ist ein Pflichtfeld"
                    },
                    pattern:{
                      value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                      message:"Die Email ist nicht valide"
                    },
                    validate: debounce(async (fieldValue)=>{
                      const email ={
                        type:"email",
                        email:fieldValue,
                      }
                      const res = await fetch('/api/auth/unique',{
                        method:"POST",
                        headers:{
                          'Content-Type':'application/json'
                        },
                        body:JSON.stringify(email)
                      })
                      const data = await res.json();
                      return data == null || "Die Email ist bereits vergeben. Ihre Emailadresse muss eindeutig sein."
                    }, 500)
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
            <button className={styles.sendBtn} type="submit" disabled={!isDirty || !isValid || isSubmitting} data-testid = "registerBtn" id="sendBtn">Registrieren</button>
            <Link href="/authUser/login" style={{color:"var(--elementColor)", margin:"5px 0"}} title="Hier zum login">Sie haben bereits einen Account? Dann klicken Sie hier</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register