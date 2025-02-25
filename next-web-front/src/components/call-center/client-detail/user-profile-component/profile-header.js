import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const ProfileHeader = ({ profileData }) => {
  const t = useTranslations("UserProfile");
  const { name, image, age } = profileData;

  return (
    <div className="w-full p-[12px] flex flex-row items-center gap-[12px]">
      <Image
        src={image}
        alt={name}
        width={72}
        height={72}
        className="rounded-full w-[72px] h-[72px] max-w-[72px] max-h-[72px] min-w-[72px] min-h-[72px] object-cover"
      />
      <div className="flex flex-col">
        <span className="text-[18px] font-medium leading-[32px] text-aside_menu-menu_list_itemm">
          {name}
        </span>
        <span className="text-[14px] font-normal leading-[24px] text-[#B0B0B0] -mt-[6px]">
          {age} {t("yearsOld")}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
