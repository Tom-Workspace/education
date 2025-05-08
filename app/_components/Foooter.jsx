import Link from "next/link";
import React from "react";

const Foooter = () => {
  return (
    <footer className=" w-full h-[450px] bg-[#334155] mt-56 overflow-hidden">
      <div className=" flex items-center justify-center flex-col h-full">
          <div className="flex items-end justify-center gap-3  h-[50%] pb-9  ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="60"
              height="60"
              viewBox="0 0 256 256"
              className=" w-12 sm:w-[60px] sm:h-[60px] h-12"
            >
              <g transform="translate(1.4 1.4) scale(2.81 2.81)">
                <circle
                  cx="45"
                  cy="45"
                  r="45"
                  style={{ fill: "rgb(60,90,153)" }}
                />
                <path
                  d="M38.633 37.184v9.136h-10.64v12.388h10.64v30.836C40.714 89.838 42.838 90 45 90c2.159 0 4.28-0.162 6.359-0.456V58.708h10.613l1.589-12.388H51.359v-7.909c0-3.587 0.991-6.031 6.107-6.031l6.525-0.003v-11.08c-1.128-0.151-5.002-0.488-9.508-0.488C45.074 20.81 38.633 26.582 38.633 37.184z"
                  style={{ fill: "rgb(255,255,255)" }}
                />
              </g>
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="60"
              height="60"
              viewBox="0 0 256 256"
              className=" w-12 sm:w-[60px] sm:h-[60px] h-12"

            >
              <g transform="translate(1.4 1.4) scale(2.81 2.81)">
                <path
                  d="M88.119 23.338c-1.035-3.872-4.085-6.922-7.957-7.957C73.144 13.5 45 13.5 45 13.5s-28.144 0-35.162 1.881c-3.872 1.035-6.922 4.085-7.957 7.957C0 30.356 0 45 0 45s0 14.644 1.881 21.662c1.035 3.872 4.085 6.922 7.957 7.957C16.856 76.5 45 76.5 45 76.5s28.144 0 35.162-1.881c3.872-1.035 6.922-4.085 7.957-7.957C90 59.644 90 45 90 45S90 30.356 88.119 23.338z"
                  style={{ fill: "rgb(255,0,0)" }}
                />
                <polygon
                  points="36,58.5 59.38,45 36,31.5"
                  style={{ fill: "rgb(255,255,255)" }}
                />
              </g>
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="60"
              height="60"
              viewBox="0 0 256 256"
              className=" w-12 sm:w-[60px] sm:h-[60px] h-12"

            >
              <g transform="translate(1.4 1.4) scale(2.81 2.81)">
                <path
                  d="M76.82 13.18C84.963 21.324 90 32.574 90 45c0 24.853-20.147 45-45 45-8.265 0-16.003-2.238-22.659-6.127L0 90C25.589 59.644 51.191 32.786 76.82 13.18z"
                  style={{ fill: "rgb(33,158,53)" }}
                />
                <path
                  d="M76.82 13.18C68.676 5.037 57.426 0 45 0 20.147 0 0 20.147 0 45c0 8.265 2.238 16.003 6.127 22.659L0 90l76.82-76.82z"
                  style={{ fill: "rgb(42,181,64)" }}
                />
                <path
                  d="M67.012 60.532c0.929-2.603 0.929-4.834 0.651-5.299-0.279-0.465-1.022-0.744-2.137-1.301-1.115-0.557-6.595-3.254-7.617-3.626-1.022-0.372-1.765-0.557-2.509 0.559-0.743 1.115-2.878 3.625-3.529 4.368-0.65 0.745-1.301 0.838-2.415 0.28-1.115-0.559-4.705-1.735-8.964-5.532-0.084-0.075-0.164-0.152-0.246-0.227-3.125 0.975-5.031 2.819-5.61 5.61 3.047 2.934 6.923 5.883 11.476 7.679 9.416 3.713 11.333 2.975 13.376 2.789C61.532 65.645 66.083 63.135 67.012 60.532z"
                  style={{ fill: "rgb(240,240,240)" }}
                />
                <path
                  d="M34.636 55.364l5.61-5.61c-3.177-2.912-5.321-6.404-5.955-7.492-0.65-1.115-0.069-1.718 0.49-2.274 0.501-0.499 1.115-1.302 1.673-1.952 0.556-0.651 0.742-1.116 1.113-1.859 0.372-0.744 0.186-1.395-0.093-1.953-0.279-0.558-2.445-6.07-3.436-8.274 0.001 0-0.835-1.856-1.714-1.894-2.508-1.926-2.136-0.026-2.972 1.394-1.022 1.116-3.902 3.812-3.902 9.296 0 5.485 3.995 10.784 4.551 11.529C27.404 46.662 30.1 50.996 34.636 55.364z"
                  style={{ fill: "rgb(255,255,255)" }}
                />
              </g>
            </svg>
          </div>
          <div className=" bg-[#1e293b] w-[43%] h-1 rounded-[50%] mb-6 sm:mb-8">
          </div>
        <div className="flex items-center justify-center flex-col gap-2 h-[50%] text-center px-1">
          <p className="text-[#D1d5db] text-base"> 
            <span className=" hidden sm:inline sm:text-3xl">💓</span> تم صنع هذه المنصة بهدف تهيئة الطالب لـ كامل جوانب
            الثانوية العامة و ما بعدها <span className=" hidden sm:inline sm:text-3xl">💓</span>
          </p>
          <p className=" text-[#D8b4fe] mb-12 text-[13px] sm:text-sm">
            <span className=" text-[#8333ea]">{"<"}</span> Developed By <span className=" text-[#8333ea]">{">"}</span>{" "}
            <Link className="text-white px-1 sm:px-3 text-base sm:text-lg" href="#">Ahmed</Link><span className=" text-[#8333ea] pr-1">{"<"}</span>All
            Copy Rights Reserved @2024 <span className=" text-[#8333ea]">{">"}</span>
          </p>

          <p className=" text-white text-sm">Powered by Tom</p>
        </div>
      </div>
    </footer>
  );
};

export default Foooter;
