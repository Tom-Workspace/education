import React from "react";
import ClassCard from "./ClassCard";
const ClassCards = () => {
  return (
    <div className="flex justify-center items-center w-[92%] mx-auto overflow-hidden">
      <div className="relative mb-20 overflow-hidden" id="courses">
        <div className="px-2 lg:px-4 sm:px-10 space-y-10 py-8">
          <div className=" smooth clr-text-primary drk:bg-teal-800 bg-opacity-50 dark:bg-opacity-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <ClassCard classC="الاول" photo="/images/year1.png" />
            <ClassCard classC="الثاني" photo="/images/year2.png" />
            <ClassCard classC="الثالث" photo="/images/year3.jpeg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCards;
