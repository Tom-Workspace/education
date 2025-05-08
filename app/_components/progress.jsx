"use client"
import React, { useEffect, useRef } from 'react'
import { motion, useScroll } from "framer-motion";
const Progress = () => {
    
    const { scrollYProgress } = useScroll()
    const progressBackground = useRef(null)

    useEffect(() => {
      const handleScroll = () => {
        let scrollY = window.scrollY;
    
        if (scrollY > 1) {
          progressBackground?.current?.classList.remove("hidden");
        } else {
          progressBackground?.current?.classList.add("hidden");
        }
      };
    
      window.addEventListener("scroll", handleScroll);
    
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
    
    

    return <>
        <motion.div className="fixed left-0 right-0  h-1 bg-[rgb(3,105,161)] origin-left " style={{ scaleX: scrollYProgress,  }} />
        <span ref={progressBackground} className='fixed left-0 right-0  h-1 bg-[rgba(56,191,248,0.52)] origin-left w-full hidden z-50 '></span>
    </> 
}

export default Progress