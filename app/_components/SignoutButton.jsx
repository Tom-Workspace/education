"use client";
import React from 'react';
import { signOut } from "next-auth/react";

const SignoutButton = () => {
  return (
    <div className="group w-fit z-10 pointer-events-auto">
      <button 
        className='bg-cyan-900 text-white px-4 py-2 my-2 z-20  rounded-md group-hover:bg-cyan-600 cursor-pointer w-full h-full pointer-events-auto' 
        type="button" 
        onClick={() => signOut()}
      >
        <p className=''>
          تسجيل الخروج
        </p>
      </button>
    </div>
  );
};

export default SignoutButton;
