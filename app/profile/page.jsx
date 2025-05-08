import Image from 'next/image';
import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/lib/nextAuth';
import SignoutButton from '../_components/SignoutButton';
import NavBar from '../_components/NavBar';
import dbConnect from '@/app/lib/dbConnect';
import UserProgress from '@/app/models/UserProgress';
import QuizAttempt from '@/app/models/QuizAttempt';
// import Course from '@/app/models/Course';
// import Quiz from '@/app/models/Quiz';

const Profile = async () => {
    const session = await getServerSession(authOptions);
    
    // If no session, this will be handled by middleware redirecting to login
    if (!session) {
        return null;
    }
    
    // Connect to database
    await dbConnect();
    
    // Fetch user progress data
    const userProgress = await UserProgress.find({ userId: session.user.id }).populate('courseId');
    
    // Fetch user quiz attempts
    const quizAttempts = await QuizAttempt.find({ 
        userId: session.user.id,
        isCompleted: true
    }).populate(['quizId', 'courseId']);
    
    // Calculate overall quiz score
    const totalQuizzes = quizAttempts.length;
    const totalQuizScore = quizAttempts.reduce((total, attempt) => total + attempt.score, 0);
    const totalQuizQuestions = quizAttempts.reduce((total, attempt) => total + attempt.totalQuestions, 0);
    const overallQuizPercentage = totalQuizQuestions > 0 ? Math.round((totalQuizScore / totalQuizQuestions) * 100) : 0;
    
    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            
            <div className="container mx-auto px-4 py-[100px]">
                {/* User Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="mb-4 md:mb-0 md:mr-6">
                            {session.user?.image ? (
                                <Image 
                                    src={session.user.image} 
                                    alt="Profile image" 
                                    height={100} 
                                    width={100}
                                    className="rounded-full border-4 border-blue-100"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {session.user?.name?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                        
                        <div className="text-center md:text-right">
                            <h1 className="text-2xl font-bold text-gray-800">{session.user?.name}</h1>
                            <p className="text-gray-600">{session.user?.email}</p>
                            <div className=" mt-4 block z-10 pointer-events-auto">
                                <SignoutButton />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Overall Progress Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">الكورسات</h2>
                        <p className="text-4xl font-bold text-blue-600">{userProgress.length}</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">الاختبارات</h2>
                        <p className="text-4xl font-bold text-green-600">{totalQuizzes}</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                        <h2 className="text-lg font-semibold mb-2 text-gray-700">متوسط الدرجات</h2>
                        <p className="text-4xl font-bold text-yellow-600">{overallQuizPercentage}%</p>
                    </div>
                </div>
                
                {/* Course Progress */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 text-right">تقدم الكورسات</h2>
                    
                    {userProgress.length > 0 ? (
                        <div className="space-y-6">
                            {userProgress.map((progress) => (
                                <div key={progress._id} className="border-b pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold text-lg">{progress?.courseId?.title}</h3>
                                        <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
                                            {progress.progress}% مكتمل
                                        </span>
                                    </div>
                                    
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${progress.progress}%` }}
                                        ></div>
                                    </div>
                                    
                                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                                        <span>آخر نشاط: {new Date(progress.lastAccessedAt).toLocaleDateString('ar-EG')}</span>
                                        <span>{progress.completedVideos.length} فيديو مكتمل</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-4 text-gray-500">لم تبدأ أي كورسات بعد</p>
                    )}
                </div>
                
                {/* Quiz Results */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 text-right">نتائج الاختبارات</h2>
                    
                    {quizAttempts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الاختبار
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الكورس
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            النتيجة
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            تاريخ الإتمام
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {quizAttempts.map((attempt) => (
                                        <tr key={attempt._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {attempt.quizId?.title || 'غير متاح'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {attempt.courseId?.title || 'غير متاح'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-sm font-medium">
                                                        {attempt.score}/{attempt.totalQuestions}
                                                    </span>
                                                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        (attempt.score / attempt.totalQuestions) >= 0.7 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : (attempt.score / attempt.totalQuestions) >= 0.5
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(attempt.completedAt).toLocaleDateString('ar-EG')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center py-4 text-gray-500">لم تكمل أي اختبارات بعد</p>
                    )}
                </div>
                
                {/* Last Login Device */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 text-right">معلومات الأمان</h2>
                    
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-600">آخر تسجيل دخول</p>
                            <p className="font-semibold">{new Date().toLocaleDateString('ar-EG')}</p>
                        </div>
                        
                        <div className="text-right">
                            <p className="text-gray-600">جهاز آخر تسجيل دخول</p>
                            <p className="font-semibold">{session.user?.lastLoginDevice || 'غير متاح'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
