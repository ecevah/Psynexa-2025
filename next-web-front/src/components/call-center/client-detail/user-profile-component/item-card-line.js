import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import ItemBarLine from "./item-bar-line";

const ItemCardLine = ({ title, icon, value, direction, percent, barData }) => {
  const t = useTranslations("Template");
  const [activeBarIndex, setActiveBarIndex] = useState(3); // 4. bar başlangıçta aktif

  return (
    <>
      <div className="min-w-[268px] w-full h-[200px] p-[20px] flex flex-col justify-between hover:bg-white bg-[#D0E8FC] rounded-[24px] shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)] relative overflow-hidden cursor-pointer group">
        <div className="absolute -left-[14px] -top-[25px] w-[119px] h-[119px] group-hover:bg-primary_color_font_palette-50 bg-science_blue-100 stroke-[0.5px] stroke-science_blue-100 rounded-full" />
        <div className="relative w-full flex flex-row items-center justify-between">
          <div className="w-[48px] h-[48px] group-hover:bg-icon_bg_new_kit-100 bg-white rounded-full flex justify-center items-center">
            <Image
              src={icon}
              alt={title}
              width={19.2}
              height={19.2}
              className="max-w-[19.2px] min-w-[19.2px] max-h-[19.2px] min-h-[19.2px]"
            />
          </div>
          <div className="text-aside_menu-menu_list_itemm text-[18px] font-medium leading-[32px]">
            {title}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between min-w-[130px]">
          <div className="flex flex-col h-fit w-full">
            <p
              className={`text-aside_menu-menu_list_itemm text-[28px] font-bold leading-[40px] ${
                !percent ? "mb-[24px]" : ""
              }`}
            >
              {value}
              <span className="text-[#B0B0B0] text-[14px] leading-[24px]">
                {" " + t("hours")}
              </span>
            </p>
            {percent && direction && (
              <div className="flex flex-row items-center">
                <Image
                  src={
                    direction === "up"
                      ? "/call-center/up-stroke.svg"
                      : "/call-center/down-stroke.svg"
                  }
                  alt="direction"
                  width={13}
                  height={7}
                  className="mr-[4px]"
                />
                <div className="text-aside_menu-menu_list_itemm text-[14px] font-normal leading-[24px] mr-[4px]">
                  {`${percent}% `}
                </div>
                <div className="text-[14px] leading-[24px] text-[#B0B0B0]">
                  {t("thisMonth")}
                </div>
              </div>
            )}
          </div>
          <div className="w-full h-full flex flex-row gap-[8px] items-end justify-end">
            {barData.map((bar, index) => (
              <ItemBarLine
                key={index}
                value={bar.value}
                isActive={index === activeBarIndex}
                onClick={() => setActiveBarIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemCardLine;
