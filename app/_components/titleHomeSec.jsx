import React from "react";

const TitleHomeSec = ({Title, sty}) => {
  return (
    <div style={{ margin: `${sty.marginT}px 0 ${sty.marginB}px`, gap: `${sty.gap}px` }} className="w-full flex justify-center items-center flex-col">
      <h1 className="text-3xl lg:text-7xl vip text-center group text-[--secondary-color] group cursor-pointer transition-all duration-300">
        <span className="inline-block mx-2 group-hover:text-primSky-500 transition-all duration-300 ">
          {Title.title1}
        </span>
        <span className=" inline-block text-primSky-500 group-hover:text-inherit transition-all duration-300 ">
          {Title.title2}
        </span>
      </h1>
      <div class=" mx-auto w-1/2 md:w-3/4 h-full">
        <svg
          width="auto"
          height="18"
          viewBox="0 0 518 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.339746 9L9 17.6603L17.6603 9L9 0.339746L0.339746 9ZM517.66 9L509 0.339746L500.34 9L509 17.6603L517.66 9ZM9 10.5H509V7.5H9V10.5Z"
            fill="#064556"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default TitleHomeSec;
