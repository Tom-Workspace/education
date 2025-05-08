import React from "react";
import AdvCard from './advCard';
const AdvCards = () => {
  return (
    <div class=" w-full h-full flex justify-center items-center">
      <div class="w-full h-full flex flex-wrap justify-center gap-3">
            <AdvCard title="هـتشارك" des="مجموعات للمناقشة عشان تسأل وتشارك أفكارك مع زمايلك" />
            <AdvCard title="هـتشارك" des="مجموعات للمناقشة عشان تسأل وتشارك أفكارك مع زمايلك" />
            <AdvCard title="هـتشارك" des="مجموعات للمناقشة عشان تسأل وتشارك أفكارك مع زمايلك" />
            <AdvCard title="هـتشارك" des="مجموعات للمناقشة عشان تسأل وتشارك أفكارك مع زمايلك" />
      </div>
    </div>
  );
};

export default AdvCards;
