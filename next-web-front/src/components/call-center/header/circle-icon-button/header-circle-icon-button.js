"use client";
import React, { useState } from "react";
import Image from "next/image";

const HeaderCircleIconButton = ({
  icon,
  text,
  func,
  style,
  styleContainer,
  labelIsVisible = true,
  isBig = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={func}
      style={styleContainer}
    >
      <div
        className={
          isBig
            ? "flex items-center justify-center lg:w-[60px] lg:h-[60px] w-[40px] h-[40px] rounded-full bg-white hover:bg-gray-50"
            : "flex items-center justify-center lg:w-[48px] lg:h-[48px] w-[40px] h-[40px] rounded-full bg-white hover:bg-gray-50"
        }
        style={style}
      >
        <Image
          src={icon}
          alt={text}
          width={isBig ? 24 : 19.2}
          height={isBig ? 24 : 19.2}
          className={
            isBig
              ? "lg:max-w-[24px] lg:max-h-[24px] lg:min-w-[24px] lg:min-h-[24px] max-w-[19.2px] max-h-[19.2px] min-w-[19.2px] min-h-[19.2px]"
              : "lg:max-w-[19.2px] lg:max-h-[19.2px] lg:min-w-[19.2px] lg:min-h-[19.2px] max-w-[19.2px] max-h-[19.2px] min-w-[19.2px] min-h-[19.2px]"
          }
        />
      </div>
      {labelIsVisible && (
        <span
          className={`absolute transition-transform duration-300 -bottom-7 ${
            isHovered
              ? "translate-y-[-5px] opacity-100"
              : "translate-y-[0px] opacity-0"
          }`}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default HeaderCircleIconButton;
