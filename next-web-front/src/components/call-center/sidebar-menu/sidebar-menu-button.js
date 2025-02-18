"use client";
import Image from "next/image";
import React from "react";

const SidebarMenuButton = ({
  icon,
  text,
  isActive,
  notification,
  func,
  isCollapsed,
}) => {
  return (
    <>
      <div
        className={`flex flex-row p-[12px] items-center cursor-pointer ${
          isActive ? "bg-primary_color_palette-50 rounded-[8px]" : ""
        }`}
        onClick={func}
      >
        <div className="flex flex-row items-center min-w-[24px]">
          <div className="relative">
            <Image
              src={icon}
              alt={text}
              width={24}
              height={24}
              className="max-w-[24px] max-h-[24px]"
            />
            {notification > 0 && isCollapsed && (
              <div className="absolute -top-1.5 -right-1.5 w-[14px] h-[14px] rounded-full bg-secondary_color_palette-100 flex items-center justify-center">
                <p className="text-[10px] font-medium text-primary_color_font_palette-600">
                  {notification}
                </p>
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <p
              className={`text-[18px] font-medium leading-[32px] ml-[12px] text-text_color_palette-950 whitespace-nowrap transition-all duration-300 ${
                isCollapsed
                  ? "translate-x-[-100%] opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              {text}
            </p>
          </div>
        </div>
        <div
          className={`ml-auto transition-all duration-300 overflow-hidden ${
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          {notification > 0 && (
            <div className="px-[12px] py-[6px] rounded-full bg-secondary_color_palette-100 text-primary_color_font_palette-600">
              <p className="text-[12px] font-medium whitespace-nowrap">
                {notification}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarMenuButton;
