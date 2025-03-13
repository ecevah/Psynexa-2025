import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const MeditationBlog = () => {
  const t = useTranslations("HomePage.mockup-card");
  return (
    <>
      <div
        className="py-[16px] pr-[24px] pl-[74px] flex flex-row gap-[40px] rounded-[24px] bg-[rgba(0,84,133,0.30)] w-fit absolute bottom-[200px] -right-[380px]"
        data-aos="fade-left"
      >
        <div className="w-[96px] h-[96px] rounded-full white-to-blue-gradient flex items-center justify-center my-auto">
          <Image
            src="/landing/star.svg"
            width={22}
            height={22}
            alt="star"
            className="min-w-[22px] min-h-[22px] max-w-[22px] max-h-[22px]"
          />
        </div>
        <div className="flex flex-col gap-[7px] w-[271px]">
          <p className="text-[24px] text-white font-bold leading-[32px]">
            {t("meditation-card-title")}
          </p>
          <p className="text-[18px] text-white leading-[24px]">
            {t("meditation-card-description")}
          </p>
        </div>
      </div>
    </>
  );
};

export default MeditationBlog;
