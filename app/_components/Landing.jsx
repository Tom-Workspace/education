import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Landing = () => {
  return (
    <div className=' mt-[70px] min-h-screen md:min-h-[70vh]  xl:min-h-screen flex md:flex-row flex-col  justify-center w-full md:w-[--contain] mx-auto pt-[8%]'>
        <div className=' w-full md:w-[50%] flex flex-col items-center md:items-start px-[10%] md:px-0 text-center md:text-start mb-24 md:mb-0 md:pr-[6%] pt-3 '>
            <h1 className="font-bold text-3xl sm:text-4xl xl:text-5xl mb-8 ">
              <span className="relative z-10 text-[--secondary-color] dark:text-[--secondary-color]">منصة <span 
              className="text-primSky-500 vip font-bold text-5xl sm:text-7xl 
              ">احمد</span></span>
            </h1>
            <h2 className="font-medium text-xl sm:text-2xl xl:text-3xl  dark:text-[--secondary-color] mb-6">
                منصة متكاملة بها كل ما يحتاجه الطالب ليتفوق
            </h2>
            <div className=" w-60 h-1 bg-sky-300 dark:bg-sky-800 transition-colors duration-300 mx-auto sm:mx-0 mb-14"></div>

            <div className=" transform transition-transform hover:scale-110 duration-500">
              <Link
                className="text-xl font-bold sm:text-3xl px-[25px] sm:px-[50px] py-[15px] sm:py-[20px] rounded-xl sm:rounded-3xl bg-primSky-500"
                href="/register"
              >
                ابدأ رحلتك <span className="text-white">الأن</span>
              </Link>
            </div>

        </div>
        <div className='w-full md:w-[50%] lg:w-[60%] xl:w-[50%]  mb-32 md:mb-0 '>
            <div className=' w-full flex items-center justify-center overflow-hidden pl-2 lg:pr-0'>
                <Image
                    src="/images/present.svg" 
                    alt="profile-updated-svg" 
                    className="dark:opacity-90 transition-opacity duration-300 lg:w-full xl:w-[80%]"
                    width={10000}
                    height={10000}
                />
            </div>
        </div>
    </div>
  )
}

export default Landing