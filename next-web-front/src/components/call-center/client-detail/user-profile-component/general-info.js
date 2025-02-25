import React from "react";
import { useTranslations } from "next-intl";

const GeneralInfo = ({ generalData }) => {
  const t = useTranslations("UserProfile");
  const { gender, dateOfBirth, location } = generalData;
  return (
    <div className="w-full h-fit p-[12px] pt-[0px] flex flex-col">
      <div className="text-[18px] font-semibold leading-[32px] text-aside_menu-menu_list_itemm">
        {t("generalInfo")}
      </div>
      <div className="w-full h-full flex flex-row gap-[20px] my-[16px]">
        <div className="w-full h-full flex flex-col">
          <div className="text-[16px] text-aside_menu-menu_list_itemm font-medium leading-[24px]">
            {t("gender")}
          </div>
          <div className="mt-[8px] p-[16px] rounded-[20px] bg-alabaster-50 text-aside_menu-menu_list_itemm text-[16px] leading-[24px]">
            {gender}
          </div>
        </div>
        <div className="w-full h-full flex flex-col">
          <div className="text-[16px] text-aside_menu-menu_list_itemm font-medium leading-[24px]">
            {t("dateOfBirth")}
          </div>
          <div className="mt-[8px] p-[16px] rounded-[20px] bg-alabaster-50 text-aside_menu-menu_list_itemm text-[16px] leading-[24px]">
            {dateOfBirth}
          </div>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col">
        <div className="text-[16px] text-aside_menu-menu_list_itemm font-medium leading-[24px]">
          {t("location")}
        </div>
        <div className="mt-[8px] p-[16px] rounded-[20px] bg-alabaster-50 text-aside_menu-menu_list_itemm text-[16px] leading-[24px]">
          {location}
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
