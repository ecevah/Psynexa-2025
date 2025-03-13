import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const MeditationCard = () => {
  const t = useTranslations("HomePage");
  return (
    <div
      className="flex flex-col items-center px-[24px] py-[12px] rounded-[24px] bg-[#095c9c33] w-[286px] shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)]"
      data-aos="fade-left"
    >
      <Image
        src="/landing/meditation.jpeg"
        width={92}
        height={79}
        alt="meditation"
        className="min-w-[92px] max-w-[92px] min-h-[79px] max-h-[79px] rounded-[20px]"
      />
      <div className="text-center text-[12px] font-bold leading-[20px] text-white mt-[5px] mb-[-4px]">
        {t("meditation_card.title")}
      </div>
      <div className="text-center text-[10px] font-normal leading-[16px] text-white opacity-80">
        Psynexa
      </div>
      <div className="w-full h-[8px] relative mt-[10px]">
        <div className="w-full h-[2px] rounded-full bg-white absolute top-[3px]"></div>
        <div className="w-[56%] h-[2px] rounded-full bg-science_blue-600 absolute top-[3px]"></div>
        <div className="w-[8px] h-[8px] rounded-full bg-science_blue-600 absolute left-[55%]"></div>
      </div>
      <div className="w-full flex flex-row items-center justify-between opacity-70">
        <div className="text-[12px] leading-[20px] text-white">01:45</div>
        <div className="text-[12px] leading-[20px] text-white">-14:24</div>
      </div>
      <div className="w-full flex flex-row items-center justify-between px-[20px]">
        <Image
          src="/landing/1.0x.svg"
          width={20}
          height={20}
          className="max-w-[20px] min-w-[20px] max-h-[20px] min-h-[20px]"
          alt="1.0x"
        />
        <Image
          src="/landing/back-15.svg"
          width={30}
          height={30}
          className="max-w-[30px] min-w-[30px] max-h-[30px] min-h-[30px]"
          alt="back-15"
        />
        <Image
          src="/landing/play.svg"
          width={31}
          height={31}
          className="max-w-[31px] min-w-[31px] max-h-[31px] min-h-[31px]"
          alt="play"
        />
        <Image
          src="/landing/forward-15.svg"
          width={30}
          height={30}
          className="max-w-[30px] min-w-[30px] max-h-[30px] min-h-[30px]"
          alt="forward-15"
        />
        <Image
          src="/landing/cc.svg"
          width={15}
          height={15}
          className="max-w-[15px] min-w-[15px] max-h-[15px] min-h-[15px]"
          alt="cc"
        />
      </div>
    </div>
  );
};

export default MeditationCard;
