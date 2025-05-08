import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ClassCard = ({classC, photo}) => {
  return (

    <div className="group">
        <div className="rounded-md overflow-hidden w-full">
        <Image src={photo} alt="course" width={1000} height={1000} className="w-full transform text-center group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-150 smooth"  />
        </div>
        <div className="px-5 -mt-10 relative z-10">
        <Link href="/years/1">
            <div className="rounded-md w-full bg-[#f3f4f6] text-[#111827] px-4 py-6 shadow-large--oblique hover:scale-105 group-hover:scale-105 smooth border border-slate-300 dark:border-slate-800">
            <div className="flex flex-col space-y-6">
                <div className="flex flex-row items-center justify-between space-x-4 space-x-reverse">
                <div className="flex flex-col space-y-4 w-full">
                    <div className="font-bold text-lg pr-3">الصف {classC} الثانوي</div>
                    <div className="divider-2 rounded-lg smooth bg-pistachio-400 dark:bg-pistachio-600"></div>
                    <div className="clr-text-secondary">
                    <span>جميع كورسات الصف {classC} الثانوي<br /></span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </Link>
        </div>
    </div>
  )
}

export default ClassCard