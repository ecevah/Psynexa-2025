import Image from "next/image";
import React from "react";

const TodayItem = ({ image, title, time, id }) => {
  return (
    <>
      <div className="rounded-[20px] bg-white shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)] px-[12px] py-[10px] flex flex-row items-center justify-between cursor-pointer hover:bg-gray-100 mt-[5px]">
        <div className="flex flex-row items-center ">
          <Image
            src={image}
            alt="text"
            width={48}
            height={48}
            className="rounded-[12px] max-w-[48px] max-h-[48px] min-w-[48px] min-h-[48px]"
          />
          <div className="flex flex-col ml-[8px]">
            <div className="text-aside_menu-menu_list_itemm text-[14px] font-medium leading-[24px] overflow-hidden whitespace-nowrap text-ellipsis">
              {title}
            </div>
            <div className="text-[#B0B0B0] text-[14px] leading-[24px]">
              {time}
            </div>
          </div>
        </div>
        <Image
          src="/call-center/arrow-down.svg"
          alt="text"
          width={24}
          height={24}
          className="max-w-[24px] max-h-[24px] -rotate-90"
        />
      </div>
    </>
  );
};

export default TodayItem;
