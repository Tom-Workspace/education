import React from "react";

const PrettyTytle = ({ titleA, titleB }) => {
  return (
    <div className="flex flex-col items-center justify-center h-fit my-32">
      <div className="flex flex-col gap-5 justify-center items-center w-full max-w h-fit">
        <div className="font-w-bold vip text-4xl sm:text-5xl text-center dark:text-[--secondary-color]">
          {titleA} <span className="text-primSky-500">{titleB}</span>
        </div>
        <div className="underline-svg w-[340px] sm:w-[400px] inline-block">
          <svg
            className="w-full h-full"
            viewBox="0 0 407 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="path-vert"
              d="M1 48C30.5 5.5 261 -22.5 406 32.3365"
              stroke="#11BAF0"
              strokeWidth="3"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PrettyTytle;
