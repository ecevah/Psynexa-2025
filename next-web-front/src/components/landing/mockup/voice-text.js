import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const VoiceText = () => {
  const t = useTranslations("HomePage.mockup-card");
  return (
    <>
      <div
        className="pl-[24px] py-[16px] pr-[100px] rounded-[24px] bg-[rgba(0,84,133,0.30)] backdrop:blur-[100px] flex flex-row absolute bottom-[240px] -left-[350px] gap-[40px] overflow-hidden w-fit"
        data-aos="fade-right"
      >
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          style={{
            border: "1px solid transparent",
            background:
              "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0)) border-box",
            WebkitMask:
              "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
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
            {t("voice-text-card-title")}
          </p>
          <p className="text-[18px] text-white leading-[24px]">
            {t("voice-text-card-description")}
          </p>
        </div>
      </div>
    </>
  );
};

export default VoiceText;
