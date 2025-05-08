"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import CourseCard from "./CourseCrard";

const SubscribedCourses = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        if (!session) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get('/api/users/subscriptions-new');
        
        if (response.data.subscriptions) {
          // Transform the data to match what CourseCard expects
          const courseSubscriptions = response.data.subscriptions.map(sub => {
            return {
              ...sub.courseId,
              subscribedAt: sub.subscribedAt
            };
          });
          
          setSubscriptions(courseSubscriptions);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setError('حدث خطأ في تحميل الكورسات المشترك بها');
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [session]);

  if (loading) {
    return (
      <div className="w-full md:w-[92%] mx-auto flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Olive-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-[92%] mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full md:w-[92%] mx-auto flex items-start justify-center flex-wrap gap-10">
        <span className="flex-center-both space-x-3 space-x-reverse text-2xl text-[--secondary-color] ">
          <span className="flex-center-both text-Olive-500 dark:text-Olive-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c0-.001-.001-.004-.001-.004 0-.003-.002-.008-.006-.016a5.116 5.116 0 0 0-.19-.454c-.18-.427-.47-.982-.904-1.467C11.233 10.1 10.177 9.5 8 9.5c-2.196 0-3.26.606-3.903 1.559a5.102 5.102 0 0 0-.19.454.103.103 0 0 0-.006.016c0 .002-.001.003-.001.004a.016.016 0 0 0 0 .003v.001z"/>
            </svg>
          </span>
          <span>قم بتسجيل الدخول لعرض الكورسات الخاصة بك</span>
        </span>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="w-full md:w-[92%] mx-auto flex items-start justify-center flex-wrap gap-10">
        <span className="flex-center-both space-x-3 space-x-reverse text-2xl text-[--secondary-color] ">
          <span className="flex-center-both text-Olive-500 dark:text-Olive-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              className="iconify iconify--carbon"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 32 32"
            >
              <circle cx="11" cy="8" r="1" fill="currentColor"></circle>
              <circle cx="11" cy="16" r="1" fill="currentColor"></circle>
              <circle cx="11" cy="24" r="1" fill="currentColor"></circle>
              <path
                fill="currentColor"
                d="M24 3H8a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2h10v-2H8v-6h18V5a2 2 0 0 0-2-2m0 16H8v-6h16Zm0-8H8V5h16Z"
              ></path>
              <path
                fill="currentColor"
                d="M29 24.415L27.586 23L25 25.587L22.414 23L21 24.415L23.586 27L21 29.586L22.414 31L25 28.414L27.586 31L29 29.586L26.414 27z"
              ></path>
            </svg>
          </span>
          <span>انت غير مشترك بأي كورس حتى الآن!</span>
        </span>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[92%] mx-auto flex items-start justify-center flex-wrap gap-10">
      {subscriptions.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default SubscribedCourses;
