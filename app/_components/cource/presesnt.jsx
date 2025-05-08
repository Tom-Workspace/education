import React from "react";

const Present = () => {
  return (
    <>
      <div className="h-[100vh] flex items-center justify-center mt-20">
        <div className="bg-primSky-500 w-[98%] h-[88vh] flex justify-center flex-row-reverse relative  rounded-xl">
          <div
            style={{
              backgroundImage: 'url("/images/bg-watching.png")',
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
            className=" opacity-[.2] w-[100%] h-full "
          ></div>
          <div className=" w-[100%] h-full absolute right-0 top-0 z-0 gredient rounded-xl"></div>

          <div className=" z-30 w-[100%] h-full pt-[5%] pr-[2%] ">
            <div className="relative z-10 space-y-6 w-full h-full  ">
              <div className="flex flex-wrap">
                <div className="rounded-full font-small shadow-md flex overflow-hidden space-x-2 space-x-reverse shrink-0 bg-cyan-400 text-slate-900 ml-4 my-2">
                  <div className="flex flex-wrap flex-row lg:space-x-reverse md:space-x-reverse sm:space-x-reverse space-x-reverse px-4 py-px flex-center-both rounded-full bg-blue-900 space-x-2">
                    <span className="flex-center-both text-white transform -translate-y-0.5 text-xl">
                      +
                    </span>
                    <span className="text-xl font-bold text-white">22</span>
                    <span className="flex-center-both trasnform text-yellow-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true"
                        role="img"
                        className="iconify iconify--bxs"
                        width="1em"
                        height="1em"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M4 8H2v12a2 2 0 0 0 2 2h12v-2H4z"
                        ></path>
                        <path
                          fill="currentColor"
                          d="M20 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2m-9 12V6l7 4z"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <div className="flex flex-wrap flex-row lg:space-x-reverse md:space-x-reverse sm:space-x-reverse space-x-reverse pl-4 py-px flex-center-both space-x-2">
                    <span>فيديوهات</span>
                  </div>
                </div>

                <div className="rounded-full font-small shadow-md flex overflow-hidden space-x-2 space-x-reverse shrink-0 bg-yellow-300 text-slate-900 ml-4 my-2">
                  <div className="flex flex-wrap flex-row lg:space-x-reverse md:space-x-reverse sm:space-x-reverse space-x-reverse px-4 py-px flex-center-both rounded-full bg-blue-900 space-x-2">
                    <span className="flex-center-both text-white transform -translate-y-0.5 text-xl">
                      +
                    </span>
                    <span className="text-xl font-bold text-white">7</span>
                    <span className="flex-center-both trasnform text-yellow-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        aria-hidden="true"
                        role="img"
                        className="iconify iconify--healthicons"
                        width="1em"
                        height="1em"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 48 48"
                      >
                        <path
                          fill="currentColor"
                          stroke="currentColor"
                          stroke-linejoin="round"
                          strokeWidth="2"
                          d="M28.753 6.342A1 1 0 0 0 27 7v7a2 2 0 0 0 2 2h6a1 1 0 0 0 .753-1.658zM20.75 23h-1.5l.75-1.8zm6.808-18L37 15.387V40a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zm-5.712 10.23a2 2 0 0 0-3.692 0l-5 12a2 2 0 0 0 3.692 1.54l.737-1.77h4.834l.737 1.77a2 2 0 0 0 3.692-1.54l-.103-.246Q26.87 27 27 27h1v1a2 2 0 1 0 4 0v-1h1a2 2 0 1 0 0-4h-1v-1a2 2 0 1 0-4 0v1h-1c-.648 0-1.224.308-1.59.786zM15 31a2 2 0 1 0 0 4a2 2 0 1 0 0 4h12a2 2 0 0 0 .002-4H33a2 2 0 1 0 0-4z"
                        ></path>
                      </svg>
                    </span>
                  </div>
                  <div className="flex flex-wrap flex-row lg:space-x-reverse md:space-x-reverse sm:space-x-reverse space-x-reverse pl-4 py-px flex-center-both space-x-2">
                    <span>امتحانات</span>
                  </div>
                </div>
              </div>

              <div className="text-[2rem] font-bold text-white">
                كورس الشهر الثاني للصف الثالث الثانوي 2025
              </div>
              <div className="text-slate-100">
                <span>
                  المحتوى : 4 أسابيع
                  <br />
                </span>
                <span>
                  1 - &quot;الفصل الأول&quot; المحاضرة الخامسة: تجزئة التيار -
                  الدائرة الكاملة وجزء من دائرة - القدرة الكهربائية
                  <br />
                </span>
                <span>
                  2 - ورشة عمل الدرس الأول والثاني &quot;الفصل الأول&quot;
                  <br />
                </span>
                <span>
                  3 - &quot;الفصل الأول&quot; المحاضرة السادسة: قانون أوم
                  للدوائر المغلقة
                  <br />
                </span>
                <span>
                  4 - &quot;الفصل الأول&quot; المحاضرة السابعة: توصيل البطاريات
                  - أماكن الفولتميتر - أسئلة القرار
                  <br />
                </span>
              </div>

              <div className="flex flex-col sm:flex-row text-sm text-slate-100 sm:space-y-0 space-y-4 sm:space-x-8 sm:space-x-reverse">
                <div className="flex flex-wrap flex-row lg:space-x-reverse md:space-x-reverse sm:space-x-reverse space-x-reverse space-x-2">
                  <span className="flex-center-both trasnform text-cyan-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      className="iconify iconify--ic"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m11.17 8l-.59-.59L9.17 6H4v12h16V8zM14 10h2v2h2v2h-2v2h-2v-2h-2v-2h2z"
                        opacity=".3"
                      ></path>
                      <path
                        fill="currentColor"
                        d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2m0 12H4V6h5.17l1.41 1.41l.59.59H20zm-8-4h2v2h2v-2h2v-2h-2v-2h-2v2h-2z"
                      ></path>
                    </svg>
                  </span>
                  <span className="font-bold underline">
                    <span>تاريخ انشاء الكورس</span>{" "}
                  </span>
                  <span className="bg-cyan-300 px-3 rounded-full opacity-90 text-slate-800">
                    الخميس، ١٢ سبتمبر ٢٠٢٤
                  </span>
                </div>
                <div className="flex flex-wrap flex-row lg:space-x-reverse md:space-x-reverse sm:space-x-reverse space-x-reverse space-x-2">
                  <span className="flex-center-both trasnform text-yellow-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      className="iconify iconify--ion"
                      width="1em"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M32 64v384h448V64zm224 214.66L64.05 160h383.9zM80 368V174.59l144 91.05zm160 0v-70.53l32-20.22l32 20.22V368zm192 0h-144V265.64l144-91.05z"
                      ></path>
                    </svg>
                  </span>
                  <span className="font-bold underline">
                    <span>سعر الكورس</span>{" "}
                  </span>
                  <span className="bg-yellow-300 px-3 rounded-full opacity-90 text-slate-800">
                    مجانًا
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Present;
