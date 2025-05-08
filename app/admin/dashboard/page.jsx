"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import AdminLayout from "../_components/AdminLayout";
import Image from "next/image";

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // const [deleteError, setDeleteError] = useState(null);
  
  const handleDeleteCourse = async (courseId) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الكورس؟ هذا الإجراء لا يمكن التراجع عنه')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      await axios.delete(`/api/admin/courses/${courseId}`);
      
      // Update the courses list
      setCourses(courses.filter(course => course._id !== courseId));
      
      alert('تم حذف الكورس بنجاح');
    } catch (err) {
      console.error('Error deleting course:', err);
      setDeleteError('فشل في حذف الكورس. الرجاء المحاولة مرة أخرى.');
      alert('فشل في حذف الكورس. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch courses
        const coursesResponse = await axios.get('/api/admin/courses');
        setCourses(coursesResponse.data.courses);
        
        // Fetch users
        const usersResponse = await axios.get('/api/admin/users');
        setUsers(usersResponse.data.users);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="bg-red-100 p-4 rounded-md text-red-700">
            {error}
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      {/* Tabs */}
      <div className="bg-white dark:bg-midNight-900 rounded-lg shadow mb-8">
        <div className="flex border-b">
          <button 
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('courses')}
          >
            الكورسات
          </button>
          <button 
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('users')}
          >
            المستخدمين
          </button>
          <button 
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('stats')}
          >
            الإحصائيات
          </button>
        </div>
        
        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">إدارة الكورسات</h2>
              <Link 
                href="/admin/courses/new" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                إضافة كورس جديد
              </Link>
            </div>
            
            {courses.length === 0 ? (
              <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
                لا توجد كورسات. أضف كورسًا جديدًا للبدء.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-midNight-900 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-midNight-800">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الكورس</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الحالة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">السعر</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عدد الفيديوهات</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تاريخ الإنشاء</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-midNight-700">
                    {courses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-midNight-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                  src={course.thumbnailUrl || "/images/default-course.jpg"}
                                  alt={course.title}
                                  width={40}
                                  height={40} 
                                  className="h-10 w-10 rounded-full"
                                />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {course.isPublished ? 'منشور' : 'مسودة'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {course.isFree ? 'مجاني' : `$${course.price}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {course.totalVideos || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(course.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => router.push(`/admin/courses/${course._id}`)}
                            className="text-indigo-600 hover:text-indigo-900 ml-3"
                          >
                            عرض
                          </button>
                          <button
                            onClick={() => router.push(`/admin/courses/${course._id}/content`)}
                            className="text-blue-600 hover:text-blue-900 ml-3"
                          >
                            المحتوى
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-600 hover:text-red-900 ml-3"
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'جاري الحذف...' : 'حذف'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
            </div>
            
            {users.length === 0 ? (
              <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
                لا يوجد مستخدمون.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-midNight-900 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-midNight-800">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المستخدم</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">البريد الإلكتروني</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الدور</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تاريخ الانضمام</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-midNight-700">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-midNight-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                src={user.image || "/images/default-avatar.png"}
                                alt={user.name}
                                width={40}
                                height={40} 
                                className="h-10 w-10 rounded-full"
                              />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            عرض
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">الإحصائيات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-2 text-blue-700 dark:text-blue-400">إجمالي الكورسات</h3>
                <p className="text-3xl font-bold">{courses.length}</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-2 text-green-700 dark:text-green-400">إجمالي المستخدمين</h3>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-2 text-yellow-700 dark:text-yellow-400">إجمالي المحتوى</h3>
                <p className="text-3xl font-bold">
                  {courses.reduce((total, course) => total + (course.totalVideos || 0), 0)} فيديو
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;