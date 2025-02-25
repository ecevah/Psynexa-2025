import React from "react";
import { useTranslations } from "next-intl";

const ContactInfo = ({ contactData }) => {
  const t = useTranslations("UserProfile");
  const { phone, email, about } = contactData;
  return (
    <div className="w-full h-full p-[12px] flex flex-col">
      <div className="text-[18px] font-semibold leading-[32px] text-aside_menu-menu_list_itemm">
        {t("contactInfo")}
      </div>
      <div className="w-full h-fit flex flex-col mt-[12px]">
        <div className="text-[16px] text-aside_menu-menu_list_itemm font-medium leading-[24px]">
          {t("phone")}
        </div>
        <div className="mt-[8px] p-[16px] rounded-[20px] bg-alabaster-50 text-aside_menu-menu_list_itemm text-[16px] leading-[24px]">
          {phone}
        </div>
      </div>
      <div className="w-full h-fit flex flex-col mt-[16px]">
        <div className="text-[16px] text-aside_menu-menu_list_itemm font-medium leading-[24px]">
          {t("email")}
        </div>
        <div className="mt-[8px] p-[16px] rounded-[20px] bg-alabaster-50 text-aside_menu-menu_list_itemm text-[16px] leading-[24px]">
          {email}
        </div>
      </div>
      <div className="w-full h-full flex flex-col mt-[12px]">
        <div className="text-[16px] text-aside_menu-menu_list_itemm font-medium leading-[24px]">
          {t("about")}
        </div>
        <div className="mt-[8px] p-[16px] h-full rounded-[20px] bg-alabaster-50 text-aside_menu-menu_list_itemm text-[16px] leading-[24px]">
          {about}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
