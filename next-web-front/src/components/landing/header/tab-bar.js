"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

const TabBar = () => {
  const t = useTranslations("HomePage");
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <div className="flex flex-row gap-[32px] p-[12px] border-[0.5px] border-solid border-[#f5f5f740] rounded-full backdrop:blur-[17.5px] relative">
        <div
          className="absolute transition-all duration-300 ease-in-out"
          id="floating-background"
          style={{
            width: "90px",
            height: "42px",
            borderRadius: "9999px",
            backgroundColor: "#ffffff1f",
            transform: `translateX(${activeTab * 122}px)`,
            left: 0,
            marginLeft: "12px",
          }}
        ></div>

        <div
          className={`w-[90px] h-[42px] rounded-full text-center leading-[26px] font-semibold text-[17px] text-white py-[8px] cursor-pointer relative z-10`}
          onClick={() => setActiveTab(0)}
        >
          {t("header.home")}
        </div>
        <div
          className={`w-[90px] h-[42px] rounded-full text-center leading-[26px] font-semibold text-[17px] text-white py-[8px] cursor-pointer relative z-10`}
          onClick={() => setActiveTab(1)}
        >
          {t("header.about")}
        </div>
        <div
          className={`w-[90px] h-[42px] rounded-full text-center leading-[26px] font-semibold text-[17px] text-white py-[8px] cursor-pointer relative z-10`}
          onClick={() => setActiveTab(2)}
        >
          {t("header.solutions")}
        </div>
        <div
          className={`w-[90px] h-[42px] rounded-full text-center leading-[26px] font-semibold text-[17px] text-white py-[8px] cursor-pointer relative z-10`}
          onClick={() => setActiveTab(3)}
        >
          {t("header.faq")}
        </div>
        <div
          className={`w-[90px] h-[42px] rounded-full text-center leading-[26px] font-semibold text-[17px] text-white py-[8px] cursor-pointer relative z-10`}
          onClick={() => setActiveTab(4)}
        >
          {t("header.contact")}
        </div>
      </div>
    </>
  );
};

export default TabBar;
