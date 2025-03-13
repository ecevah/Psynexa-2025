import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const NexabotMiniLogo = () => {
  const t = useTranslations("HomePage.mockup-card");
  return (
    <>
      <div
        className="flex flex-col items-center w-fit absolute top-[30px] right-[100px]"
        data-aos="fade-down"
      >
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
        <p className="text-[14px] text-white text-center leading-[16px] mt-[9px] w-[200px]">
          <span className="font-black">{t("mini-nexabot-logo-bold")}</span>{" "}
          {t("mini-nexabot-logo-light")}
        </p>
      </div>
    </>
  );
};

export default NexabotMiniLogo;
