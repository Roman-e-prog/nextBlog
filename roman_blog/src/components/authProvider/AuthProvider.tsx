"use client"
import React, { ReactNode } from 'react'
type Children = {
    children:ReactNode
}
import { SessionProvider } from "next-auth/react";
const AuthProvider:React.FC<Children> = ({children}) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider