"use client"
import React, {useState, useEffect} from 'react'
import styles from './page.module.css'
import { BibliothekDocument } from '@/models/Bibliothek';
import Spinner from '@/components/spinner/Spinner';
type SliderItem = {
  ressort:string,
  file:string,
  content:string,
}
const Bibliothek = () => {
  const [html, setHtml] = useState<any[]>([])
  const [css, setCss] = useState<any[]>([])
  const [javaScript, setJavaScript] = useState<any[]>([])
  useEffect(()=>{
    fetch('/api/bibliothek/')
    .then((res)=>res.json())
    .then((data)=>{
          data.forEach((item:BibliothekDocument) => {
            setHtml(item.videos.filter((video)=>video.ressort === 'HTML'))
            setCss(item.videos.filter((video)=>video.ressort === 'CSS'))
            setJavaScript(item.videos.filter((video)=>video.ressort === 'JavaScript'))
          });
    })
  }, [])
  //width
    const [innerWidth, setInnerWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(()=>{
      const handleResize = ()=>{
        setInnerWidth(window.innerWidth)
      }
      window.addEventListener('resize', handleResize);
      return ()=> window.removeEventListener('resize', handleResize)
    },[])
    let one = innerWidth;
    let two = innerWidth / 2;
    let three = innerWidth / 3;
    //slider
    const youtubeUrl = "https://www.youtube.com/embed/";

    const [htmlSlideIndex, setHtmlSlideIndex] = useState(0)
    const [cssSlideIndex, setCssSlideIndex] = useState(0)
    const [jsSlideIndex, setJsSlideIndex] = useState(0)

    const handleHTMLSlide = (direction:string)=>{
        if(direction === "left"){
          setHtmlSlideIndex(prevState=>prevState > 0 ? prevState -1 : 0)
        } 
        else if(direction === "right" && innerWidth > 780){
          setHtmlSlideIndex(prevState=>prevState < html.length - 3 ? prevState + 1 : html.length - 3)
        }
        else if(direction === "right" && innerWidth > 420){
          setHtmlSlideIndex(prevState=>prevState < html.length -2 ? prevState + 1 : html.length -2)
        }
        else if(direction === "right" && innerWidth < 420){
          setHtmlSlideIndex(prevState=>prevState < html.length -1 ? prevState + 1 : html.length - 1)
        }
    }
    const handleCssSlide = (direction:string)=>{
      if(direction === "left"){
        setCssSlideIndex(prevState=>prevState > 0 ? prevState - 1 : 0)
      } 
      else if(direction === "right" && innerWidth > 780){
        setCssSlideIndex(prevState=>prevState < css.length -3 ? prevState + 1: css.length -3)
      }
      else if(direction === "right" && innerWidth > 420){
        setCssSlideIndex(prevState=>prevState < css.length - 2 ? prevState + 1 : css.length - 2)
      }
      else if(direction === "right" && innerWidth < 420){
        setCssSlideIndex(prevState=>prevState < css.length - 1 ? prevState + 1 : css.length - 1)
      }
  }
    const handleJsSlide = (direction:string)=>{
      if(direction === "left"){
        setJsSlideIndex(prevState=>prevState > 0 ? prevState - 1 : 0)
      } 
      else if(direction === "right" && innerWidth > 780){
        setJsSlideIndex(prevState=>prevState < javaScript.length -3 ? prevState + 1: javaScript.length -3)
      }
      else if(direction === "right" && innerWidth > 420){
        setJsSlideIndex(prevState=>prevState < javaScript.length - 2 ? prevState + 1 : javaScript.length - 2)
      }
      else if(direction === "right" && innerWidth < 420){
        setJsSlideIndex(prevState=>prevState < javaScript.length - 1 ? prevState + 1 : javaScript.length - 1)
      }
  }
  return (
    <div className={styles.container}>
      <div className={styles.headlineWrapper}>
        <h1 className='headline'>Unsere Videos</h1>
      </div>
      <div className={styles.hmtlWrapper}>
        <div className={styles.headerWrapper}>
          <h2 className='headline'>HTML</h2>
        </div>
        <div className={styles.sliderWrapper}>
          <div className={styles.iconLeft}><span className='material-symbols-outlined' onClick={()=>handleHTMLSlide("left")} style={{fontSize:"40px"}}>Arrow_Circle_Left</span></div>
          {html ? html.map((item:SliderItem, index)=>(
            <div className='htmlItemWrapper' key={index}>
                <iframe src={youtubeUrl+item.file.split("=")[1]} className={styles.iframe} title={item.content}></iframe>
                <p className={styles.content}>{item.content}</p>
            </div>
          )):null}
          <div className={styles.iconRight}><span className='material-symbols-outlined' onClick={()=>handleHTMLSlide("right")} style={{fontSize:"40px"}}>Arrow_Circle_Right</span></div>
        </div>
      </div>
      <div className={styles.cssWrapper}>
        <div className={styles.headerWrapper}>
          <h2 className='headline'>CSS</h2>
        </div>
        <div className={styles.sliderWrapper}>
          <div className={styles.iconLeft}><span className='material-symbols-outlined' onClick={()=>handleCssSlide("left")} style={{fontSize:"40px"}}>Arrow_Circle_Left</span></div>
          {css ? css.map((item:SliderItem, index)=>(
            <div className='cssItemWrapper' key={index}>
                <iframe src={youtubeUrl+item.file.split("=")[1]} className={styles.iframe} title={item.content}></iframe>
                <p className={styles.content}>{item.content}</p>
            </div>
          )):null}
          <div className={styles.iconRight}><span className='material-symbols-outlined' onClick={()=>handleCssSlide("right")} style={{fontSize:"40px"}}>Arrow_Circle_Right</span></div>
        </div>
      </div>
      <div className={styles.jsWrapper}>
        <div className={styles.headerWrapper}>
          <h2 className='headline'>JavaScript</h2>
        </div>
        <div className={styles.sliderWrapper}>
          <div className={styles.iconLeft}><span className='material-symbols-outlined' onClick={()=>handleJsSlide("left")} style={{fontSize:"40px"}}>Arrow_Circle_Left</span></div>
          {javaScript ? javaScript.map((item:SliderItem, index)=>(
            <div className='jsItemWrapper' key={index}>
                <iframe src={youtubeUrl+item.file.split("=")[1]} className={styles.iframe} title={item.content}></iframe>
                <p className={styles.content}>{item.content}</p>
            </div>
          )):null}
          <div className={styles.iconRight}><span className='material-symbols-outlined' onClick={()=>handleJsSlide("right")} style={{fontSize:"40px"}}>Arrow_Circle_Right</span></div>
        </div>
      </div>
      <style>{`
              .htmlItemWrapper{
                display:flex;
                flex-direction:column;
                background:var(--secondBgColor);
                min-width:${three}px;
                transform: translateX(${htmlSlideIndex * - three}px);
              }
              @media screen and (max-width:780px){
                .htmlItemWrapper{
                  min-width:${two}px;
                  transform: translateX(${htmlSlideIndex * - two}px);
                }
              }
              @media screen and (max-width:420px){
                .htmlItemWrapper{
                  min-width:${one}px;
                  transform: translateX(${htmlSlideIndex * - one}px);
                }
              }
              .cssItemWrapper{
                display:flex;
                flex-direction:column;
                background:var(--secondBgColor);
                min-width:${three}px;
                transform: translateX(${cssSlideIndex * - three}px);
              }
              @media screen and (max-width:780px){
                .cssItemWrapper{
                  min-width:${two}px;
                  transform: translateX(${cssSlideIndex * - two}px);
                }
              }
              @media screen and (max-width:420px){
                .cssItemWrapper{
                  min-width:${one}px;
                  transform: translateX(${cssSlideIndex * - one}px);
                }
              }
              .jsItemWrapper{
                display:flex;
                flex-direction:column;
                background:var(--secondBgColor);
                min-width:${three}px;
                transform: translateX(${jsSlideIndex * - three}px);
              }
              @media screen and (max-width:780px){
                .jsItemWrapper{
                  min-width:${two}px;
                  transform: translateX(${jsSlideIndex * - two}px);
                }
              }
              @media screen and (max-width:420px){
                .jsItemWrapper{
                  min-width:${one}px;
                  transform: translateX(${jsSlideIndex * - one}px);
                }
              }
              
      `}</style>
    </div>
  )
}

export default Bibliothek