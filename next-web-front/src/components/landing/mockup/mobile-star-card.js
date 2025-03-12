import Image from "next/image";
import React from "react";

const MobileStarCard = ({ title, description }) => {
  return (
    <>
      <div className="w-full min-[740px]:max-w-[450px] px-[24px] py-[40px] flex flex-col min-[390px]:gap-[40px] gap-[20px] bg-[rgba(0,84,133,0.30)] rounded-[24px] backdrop-blur-[100px]">
        <div className="min-[390px]:w-[96px] min-[390px]:h-[96px] w-[60px] h-[60px] rounded-full white-to-blue-gradient flex items-center justify-center my-auto">
          <Image
            src="/landing/star.svg"
            width={22}
            height={22}
            alt="star"
            className="min-w-[22px] min-h-[22px] max-w-[22px] max-h-[22px]"
          />
        </div>
        <div className="flex flex-col gap-[7px] min-[390px]:w-[300px] ">
          <p className="min-[390px]:text-[24px] text-[18px] text-white font-bold leading-[32px]">
            {title}
          </p>
          <p className="min-[390px]:text-[18px] text-[14px] text-white leading-[24px]">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};

export default MobileStarCard;
