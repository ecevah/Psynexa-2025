import Image from "next/image";
import React from "react";

const NexabotCard = () => {
  return (
    <>
      <div className="pl-[24px] py-[24px] pr-[150px] rounded-[24px] bg-[rgba(0,84,133,0.30)] backdrop:blur-[100px] flex flex-row absolute top-[100px] -left-[400px] gap-[40px]">
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
            Nexabot
          </p>
          <p className="text-[18px] text-white leading-[24px]">
            Nexabot analyzes your emotions, offers empathetic support, and
            provides personalized suggestions to help you navigate your day.
          </p>
        </div>
      </div>
    </>
  );
};

export default NexabotCard;
