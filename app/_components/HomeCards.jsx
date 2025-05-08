"use client";

import React, { useState, useEffect, useCallback } from 'react';
import CourseCard from './CourseCrard';
import axios from 'axios';

const RecentCards = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const limit = 6; // Number of courses per page

  // Use caching to avoid refetching data unnecessarily
  const cachedDataKey = 'cachedCourses';
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes in milliseconds

  const fetchCourses = useCallback(async (pageNum = 1, useCache = true) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }

      // Check if we have valid cached data for initial load
      if (pageNum === 1 && useCache) {
        const cachedData = localStorage.getItem(cachedDataKey);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > cacheExpiry;
          
          if (!isExpired && data.length > 0) {
            console.log('Using cached courses data');
            setCourses(data);
            setLoading(false);
            setInitialLoad(false);
            
            // Still fetch in background to update cache
            setTimeout(() => fetchCourses(1, false), 0);
            return;
          }
        }
      }

      // Build query with pagination
      const query = `/api/courses?page=${pageNum}&limit=${limit}`;
      console.log(`Fetching courses: ${query}`);
      
      const response = await axios.get(query);
      const newCourses = response.data.courses;
      
      if (pageNum === 1) {
        setCourses(newCourses);
        
        // Cache the first page results
        localStorage.setItem(
          cachedDataKey, 
          JSON.stringify({ 
            data: newCourses, 
            timestamp: Date.now() 
          })
        );
      } else {
        setCourses(prev => [...prev, ...newCourses]);
      }
      
      // Check if we have more courses to load
      setHasMore(newCourses.length === limit);
      
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('فشل في تحميل الكورسات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  // Initial load of courses
  useEffect(() => {    
    fetchCourses(1);
  }, [fetchCourses]);

  if (loading) {
    return (
      <div className='w-full md:w-[92%] mx-auto flex justify-center items-center h-40'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Olive-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full md:w-[92%] mx-auto'>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className='w-full md:w-[92%] mx-auto flex justify-center'>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>لا توجد كورسات متاحة حالياً.</p>
        </div>
      </div>
    );
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCourses(nextPage, false);
    }
  };

  return (
    <div className='w-full md:w-[92%] mx-auto'>
      <div className='flex items-start justify-center flex-wrap gap-10'>
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
      
      {hasMore && (
        <div className='mt-10 flex justify-center'>
          <button 
            onClick={loadMore} 
            disabled={loading}
            className={`px-6 py-2 rounded-full text-white font-bold ${loading ? 'bg-gray-400' : 'bg-Olive-600 hover:bg-Olive-700'} flex items-center gap-2 transition-colors duration-300`}
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
                جاري التحميل...
              </>
            ) : (
              'تحميل المزيد من الكورسات'
            )}
          </button>
        </div>
      )}
      
      {!initialLoad && courses.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center">
          <p>لا توجد كورسات متاحة حالياً.</p>
        </div>
      )}
    </div>
  );
};

export default RecentCards;