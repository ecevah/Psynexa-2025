import Image from "next/image";
import React from "react";

const NexabotMiniLogoCard = () => {
  return (
    <div className="w-[310px] p-[12px] flex flex-col items-center bg-[#095c9c33] rounded-[24px] shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)]">
      <div className="w-[88px] h-[88px] rounded-full bg-[#BDDFFA40] flex items-center justify-center">
        <div className="w-[68px] h-[68px] rounded-full bg-[#BDDFFA66] flex items-center justify-center">
          <div className="w-[48px] h-[48px] rounded-full bg-[#0A6EBD] flex items-center justify-center">
            <Image
              src="/landing/mini-logo.svg"
              width={30}
              height={30}
              alt="mini-logo"
              className="max-w-[30px] min-w-[30px] max-h-[30px] min-h-[30px]"
            />
          </div>
        </div>
      </div>
      <p className="text-[14px] text-white text-center leading-[16px] mt-[9px]">
        <span className="font-black">Hi I’m Nexabot!</span> your personal <br />
        friend. How are you!
      </p>
    </div>
  );
};

export default NexabotMiniLogoCard;
