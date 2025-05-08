"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CourseCard({ course }) {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  if (!course) {
    return null;
  }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!session) {
      // Redirect to sign in if not logged in
      router.push('/api/auth/signin');
      return;
    }
    
    try {
      setIsSubscribing(true);
      setSubscriptionError(null);
      
      // Try to use courseNum first if available, then fall back to _id
      const courseId = course.courseNum || course._id;
      console.log('Subscribing to course:', courseId, 'Type:', typeof courseId);
      
      const response = await axios.post('/api/users/subscriptions-new', {
        courseId: courseId
      });
      
      console.log('Subscription response:', response.data);
      setSubscriptionSuccess(true);
      
      // After successful subscription, refresh the page to show updated subscribed courses
      setTimeout(() => {
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error('Error subscribing to course:', error);
      
      // More detailed error handling
      if (error.response) {
        console.log('Error response data:', error.response.data);
        if (error.response.data.message === 'Already subscribed to this course') {
          setSubscriptionError('أنت مشترك بالفعل في هذا الكورس');
        } else if (error.response.status === 404) {
          setSubscriptionError('الكورس غير موجود. يرجى تحديث الصفحة.');
        } else if (error.response.status === 401) {
          setSubscriptionError('يرجى تسجيل الدخول أولاً');
          setTimeout(() => router.push('/api/auth/signin'), 1500);
        } else {
          setSubscriptionError('فشل الاشتراك في الكورس. يرجى المحاولة مرة أخرى.');
        }
      } else {
        setSubscriptionError('حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.');
      }
    } finally {
      setIsSubscribing(false);
    }
  };
  return (
    <div className="relative group w-[90%] md:max-w-[412px] h-fit outline outline-offset-4 outline-Olive-600 dark:outline-midNight-900 hover:outline-offset-0 px-3 card-cover rounded-md pt-4 bg-Olive-50 dark:bg-[#111827] smooth">
      <div>
        <div className="group-hover:scale-105 smooth flex-center-both">
          <Image
            src={course.thumbnailUrl || "/images/default-course.jpg"}
            alt={course.title}
            width={412}
            height={400}
            className="undefined w-[90%] md:w-[80%] h-auto group-hover:w-[95%] group-hover:rounded-md smooth"
          />
        </div>
      </div>
      <div className="px-0 md:px-5 mt-5 relative z-10">
        <div className="w-full clr-text-primary px-4 py-2 smooth">
          <svg
            width="306"
            height="6"
            viewBox="0 0 306 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-midNight-800 mb-4 dark:fill-Olive-200 smooth w-[90%] md:w-full mx-auto"
          >
            <path d="M0.43099 3.29443C0.43099 4.76719 1.6249 5.9611 3.09766 5.9611C4.57042 5.9611 5.76432 4.76719 5.76432 3.29443C5.76432 1.82167 4.57042 0.627767 3.09766 0.627767C1.6249 0.627767 0.43099 1.82167 0.43099 3.29443ZM300.431 3.29443C300.431 4.76719 301.625 5.9611 303.098 5.9611C304.57 5.9611 305.764 4.76719 305.764 3.29443C305.764 1.82167 304.57 0.627767 303.098 0.627767C301.625 0.627767 300.431 1.82167 300.431 3.29443ZM3.09766 3.79443H303.098V2.79443H3.09766V3.79443Z" />
          </svg>
          <div className="flex flex-col space-y-6">
            <div className="flex-col flex space-y-3">
              <div className="w-full font-bold text-[.75rem] flex flex-col-reverse sm:flex-row space-y-4 space-y-reverse sm:space-y-0 sm:space-x-reverse sm:space-x-4 justify-between items-center">
                <div>
                  <div className="bg-midNight-950 text-midNight-100 dark:bg-Olive-500 dark:text-midNight-950 smooth rounded-lg py-1 px-3 space-x-2 space-x-reverse">
                    <span className="bg-[--primary-color] text-[--secondary-color] smooth px-2 py-px rounded-md ">
                      {course.price || 'مجاني'}
                    </span>
                    {course.price && <span>جنيهًا</span>}
                  </div>
                </div>
                <div className="flex sm:justify-end sm:items-start flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-1 items-center sm:space-x-reverse clr-text-secondary flex-wrap">
                  <div className="flex flex-col space-y-2 shrink-0">
                    <div className="flex justify-between space-x-1 space-x-reverse">
                      <span className="flex-center-both">
                        {new Date(course.createdAt).toLocaleDateString('ar-EG', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="font-normal flex-center-both transform -translate-y-px">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <svg
              width="306"
              height="6"
              viewBox="0 0 306 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-midNight-800 dark:fill-Olive-200 smooth w-[90%] md:w-full mx-auto"
            >
              <path d="M0.43099 3.29443C0.43099 4.76719 1.6249 5.9611 3.09766 5.9611C4.57042 5.9611 5.76432 4.76719 5.76432 3.29443C5.76432 1.82167 4.57042 0.627767 3.09766 0.627767C1.6249 0.627767 0.43099 1.82167 0.43099 3.29443ZM300.431 3.29443C300.431 4.76719 301.625 5.9611 303.098 5.9611C304.57 5.9611 305.764 4.76719 305.764 3.29443C305.764 1.82167 304.57 0.627767 303.098 0.627767C301.625 0.627767 300.431 1.82167 300.431 3.29443ZM3.09766 3.79443H303.098V2.79443H3.09766V3.79443Z" />
            </svg>
            <div className="flex items-center justify-center flex-col space-y-6 sm:space-y-10">
              <div className="flex-center-both flex-col space-y-4 w-full">
                <div className="font-bold text-[1.125rem] pr-3">
                  {course.title}
                </div>
                <div className="clr-text-secondary text-center">
                  <span>
                    {course.description || 'لا يوجد وصف متاح'}
                  </span>
                </div>
              </div>
              <div className="font-[.75rem] shrink-0 flex flex-col sm:flex-row space-y-5 sm:space-y-0 space-x-0 sm:space-x-reverse sm:space-x-6 pb-5">
                  <Link href={`/course/${course.courseNum || course._id}`} className="border-2 text-center border-teal-500 rounded-full px-3 py-1 hover:bg-teal-500 hover:text-white smooth text-[--secondary-color]">
                    الدخول للكورس
                  </Link>
                  
                  {subscriptionSuccess ? (
                    <div className="bg-green-500 min-w-[150px] text-white font-bold rounded-full px-3 py-2 sm:py-1 flex-center-both">
                      تم الاشتراك بنجاح!
                    </div>
                  ) : (
                    <button 
                      onClick={handleSubscribe} 
                      disabled={isSubscribing}
                      className={`${isSubscribing ? 'bg-gray-400' : 'bg-Olive-400'} min-w-[150px] text-midNight-950 font-bold rounded-full px-3 py-2 sm:py-1 flex-center-both`}
                    >
                      {isSubscribing ? 'جاري الاشتراك...' : 'اشترك الآن!'}
                    </button>
                  )}
              </div>
              
              {subscriptionError && (
                <div className="text-center text-red-500 text-sm mb-3">
                  {subscriptionError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
