"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-midNight-950">
      {/* Admin Header */}
      <header className="bg-white dark:bg-midNight-900 shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">لوحة التحكم</h1>
            <div className="flex items-center space-x-4 space-x-reverse rtl:space-x-reverse">
              <Link 
                href="/admin/dashboard"
                className="bg-Olive-600 text-white px-4 py-2 rounded-md hover:bg-Olive-700 transition-colors mr-2"
              >
                الرئيسية
              </Link>
              <button 
                onClick={() => router.push('/')}
                className="bg-gray-200 dark:bg-midNight-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-midNight-700 transition-colors"
              >
                العودة إلى الموقع
              </button>
              <button 
                onClick={() => router.push('/auth/logout')}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
