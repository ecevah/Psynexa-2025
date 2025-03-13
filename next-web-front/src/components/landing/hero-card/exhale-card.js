import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

const ExhaleCard = () => {
  const t = useTranslations("HomePage");
  return (
    <>
      <div
        className="w-[320px] px-[16px] py-[24px] flex flex-col relative rounded-[24px] bg-[#095c9c33] gap-[12px] shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)]"
        data-aos="fade-right"
      >
        <div className="absolute -top-[50px] -right-[50px]">
          <div className="relative">
            <Image
              src="/landing/5-hold.svg"
              width={120}
              height={120}
              alt="5hold"
              className="w-[120px] h-[120px] max-w-[120px] max-h-[120px] min-w-[120px] min-h-[120px]"
            />
            <p className="absolute top-[40px] right-[40px] text-[12px] font-medium leading-[12px] text-white text-center lowercase">
              <span className="text-white text-[24px] font-bold leading-[26px]">
                05
              </span>{" "}
              <br />
              {t("exhale_card.hold")}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-[8px] items-center">
          <div className="w-[36px] h-[36px] rounded-full bg-[#E0F1FE] items-center justify-center flex">
            <Image
              src="/landing/arcticons_breathly.svg"
              width={24}
              height={24}
              alt="breathly"
              className="max-w-[24px] min-w-[24px] max-h-[24px] min-h-[24px]"
            />
          </div>
          <p className="text-white text-[14px] font-semibold leading-[16px]">
            {t("exhale_card.increase")}
          </p>
        </div>
        <div className="text-[11px] font-light text-white leading-[15px]">
          {t("exhale_card.calmness")}
        </div>
        <div className="flex flex-row gap-[24px]">
          <div className="flex flex-col">
            <Image
              src="/landing/solar_wind.svg"
              width={16}
              height={16}
              alt="solar_wind"
              className="max-w-[16px] min-w-[16px] max-h-[16px] min-h-[16px]"
            />
            <p className="text-white text-[14px] leading-[17px] mt-[8px] mb-[4px]">
              {t("exhale_card.breathly")}
            </p>
            <p className="text-white text-[11px] leading-[13px]">
              4 {t("exhale_card.seconds")}
            </p>
          </div>
          <div className="flex flex-col">
            <Image
              src="/landing/quill.svg"
              width={16}
              height={16}
              alt="quill1"
              className="max-w-[16px] min-w-[16px] max-h-[16px] min-h-[16px]"
            />
            <p className="text-white text-[14px] leading-[17px] mt-[8px] mb-[4px]">
              {t("exhale_card.hold")}
            </p>
            <p className="text-white text-[11px] leading-[13px]">
              4 {t("exhale_card.seconds")}
            </p>
          </div>
          <div className="flex flex-col">
            <Image
              src="/landing/solar_wind.svg"
              width={16}
              height={16}
              alt="solar_wind"
              className="max-w-[16px] min-w-[16px] max-h-[16px] min-h-[16px]"
            />
            <p className="text-white text-[14px] leading-[17px] mt-[8px] mb-[4px]">
              {t("exhale_card.exhale")}
            </p>
            <p className="text-white text-[11px] leading-[13px]">
              4 {t("exhale_card.seconds")}
            </p>
          </div>
          <div className="flex flex-col">
            <Image
              src="/landing/quill.svg"
              width={16}
              height={16}
              alt="quill2"
              className="max-w-[16px] min-w-[16px] max-h-[16px] min-h-[16px]"
            />
            <p className="text-white text-[14px] leading-[17px] mt-[8px] mb-[4px]">
              {t("exhale_card.hold")}
            </p>
            <p className="text-white text-[11px] leading-[13px]">
              4 {t("exhale_card.seconds")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExhaleCard;
