import React from 'react';
import NavRoot from './_components/NavRoot';
import Landing from './_components/Landing';
import Teacher from './_components/teachers';
import PrettyTytle from './_components/prettyTitle';
import AdvCards from './_components/advCards';
import ClassCards from './_components/ClassCards';
const RootPage = () => {
  return (
    <div className=' relative'>
      <NavRoot />
      <Landing />
      <Teacher />
      <PrettyTytle titleA="ازاي" titleB="احمد" />
      <AdvCards />
      <PrettyTytle titleA="المواد" titleB="الدراسية" />
      <ClassCards />

    </div>
  );
};

export default RootPage;
