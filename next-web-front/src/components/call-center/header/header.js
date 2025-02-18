"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CircleIconButtons from "./circle-icon-button/circle-icon-buttons";

const Header = () => {
  const t = useTranslations("DashboardPage");
  const [isHovered, setIsHovered] = useState(false);
  const [greeting, setGreeting] = useState("");
  const { firstName, lastName, imageUrl } = useSelector((state) => state.user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return t.raw("header.morning");
    } else if (hour >= 12 && hour < 18) {
      return t.raw("header.afternoon");
    } else {
      return t.raw("header.evening");
    }
  };

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="flex lg:flex-row flex-col-reverse items-end justify-between w-full">
        <p className="lg:text-[28px] text-[20px] font-semibold leading-[40px] cursor-default">
          {`${greeting}, ${firstName} ${lastName}!`}
        </p>
        <div className="flex flex-row">
          <CircleIconButtons />
          <div
            className="relative cursor-pointer ml-4 w-fit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              alert("Profile");
            }}
          >
            <Image
              alt="user-image"
              src={imageUrl}
              width={60}
              height={60}
              className="rounded-full lg:min-w-[60px] lg:min-h-[60px] lg:max-w-[60px] lg:max-h-[60px] min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]"
            />
            <span
              className={`absolute transition-transform duration-300 -bottom-7 left-1/2 transform -translate-x-1/2 ${
                isHovered
                  ? "translate-y-[-5px] opacity-100"
                  : "translate-y-[0px] opacity-0"
              }`}
            >
              {t.raw("header.profile")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
