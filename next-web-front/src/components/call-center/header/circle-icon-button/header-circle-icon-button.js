"use client";
import React, { useState } from "react";
import Image from "next/image";

const HeaderCircleIconButton = ({ icon, text, func }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={func}
    >
      <div className="flex items-center justify-center lg:w-[60px] lg:h-[60px] w-[40px] h-[40px] rounded-full bg-white hover:bg-gray-50">
        <Image
          src={icon}
          alt={text}
          width={24}
          height={24}
          className="lg:max-w-[24px] lg:max-h-[24px] lg:min-w-[24px] lg:min-h-[24px] max-w-[16px] max-h-[16px] min-w-[16px] min-h-[16px]"
        />
      </div>
      <span
        className={`absolute transition-transform duration-300 -bottom-7 ${
          isHovered
            ? "translate-y-[-5px] opacity-100"
            : "translate-y-[0px] opacity-0"
        }`}
      >
        {text}
      </span>
    </div>
  );
};

export default HeaderCircleIconButton;
