"use client"
import React,{useState, createContext,ReactNode} from 'react'
interface ColorTheme{
    mode:string,
    toggle?:()=>void,
} 
interface ProviderProps{
    children:ReactNode,
}
export const ThemeContext = createContext<ColorTheme | null>(null);
export const ThemeProvider = ({children}:ProviderProps) => {
    const [mode, setMode] = useState("dark")
    const toggle = ()=>{
        setMode((prev)=>prev === "dark" ? "light": "dark")
    }
  return (
    <ThemeContext.Provider value={{mode, toggle}}>
<div className={`theme ${mode}`}>{children}</div>
    </ThemeContext.Provider>
  )
}

