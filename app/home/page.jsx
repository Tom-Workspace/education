"use client";

import React from 'react';
import NavBar from '@/app/_components/NavBar';
import TitleHomeSec from '@/app/_components/titleHomeSec';
import RecentCards from '@/app/_components/HomeCards';
import SubscribedCourses from '@/app/_components/SubscribedCourses';

const Home = () => {
  return (
    <div className='min-h-screen pb-20'>
      <NavBar />
      <TitleHomeSec Title={{ title1: 'إشتراكاتك', title2: 'يا صديقي' }} sty={{ marginT: 150, marginB: 100, gap: 40 }} />
      <SubscribedCourses/>
      <TitleHomeSec Title={{ title1: 'احدث كورسات', title2: '" الصف الثالث الثانوي "' }} sty={{ marginT: 250, marginB: 100, gap: 20 }} />
      <RecentCards/>
    </div>
  )
}

export default Home
