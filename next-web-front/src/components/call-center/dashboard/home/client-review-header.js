import React, { useState } from "react";
import HomeDropdown from "@/components/call-center/dropdown/home-dropdown";
import { useTranslations } from "next-intl";

const ClientReviewHeader = () => {
  const t = useTranslations("DashboardPage");
  const tTemplate = useTranslations("Template");
  const [selectedOption, setSelectedOption] = useState(tTemplate("allTime"));
  return (
    <>
      <div className="flex flex-row justify-between px-[8px]">
        <div className="text-aside_menu-menu_list_itemm text-[20px] font-semibold leading-[40px]">
          {t("clientReviewNeeds")}
        </div>
        <div className="relative">
          <HomeDropdown
            options={[
              { value: "thisMonth", label: tTemplate("allTime") },
              { value: "lastWeek", label: tTemplate("lastWeek") },
              { value: "lastMonth", label: tTemplate("lastMonth") },
              { value: "lastYear", label: tTemplate("lastYear") },
            ]}
            selected={selectedOption}
            onChange={(value) => setSelectedOption(value)}
          />
        </div>
      </div>
    </>
  );
};

export default ClientReviewHeader;
