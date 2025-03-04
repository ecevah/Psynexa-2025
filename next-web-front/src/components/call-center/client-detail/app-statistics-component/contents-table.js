import React from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { selectContentsData } from "@/store/features/emotionTrackingSlice";

const ContentsTable = ({ searchQuery }) => {
  const t = useTranslations("AppStatistics");
  const { items } = useSelector(selectContentsData);

  const filteredItems = searchQuery
    ? items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-[#9D9D9D] text-[14px] font-medium leading-[24px] text-left py-[12px] px-[16px]">
            {t("title")}
          </th>
          <th className="text-[#9D9D9D] text-[14px] font-medium leading-[24px] text-left py-[12px] px-[16px]">
            {t("date")}
          </th>
          <th className="text-[#9D9D9D] text-[14px] font-medium leading-[24px] text-left py-[12px] px-[16px]">
            {t("duration")}
          </th>
          <th className="text-[#9D9D9D] text-[14px] font-medium leading-[24px] text-left py-[12px] px-[16px]">
            {t("type")}
          </th>
          <th className="text-[#9D9D9D] text-[14px] font-medium leading-[24px] text-left py-[12px] px-[16px]">
            {t("status")}
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredItems.map((item) => (
          <tr key={item.id}>
            <td className="text-[#313131] text-[14px] font-medium leading-[24px] py-[12px] px-[16px]">
              {item.title}
            </td>
            <td className="text-[#313131] text-[14px] font-medium leading-[24px] py-[12px] px-[16px]">
              {item.date}
            </td>
            <td className="text-[#313131] text-[14px] font-medium leading-[24px] py-[12px] px-[16px]">
              {item.duration}
            </td>
            <td className="text-[#313131] text-[14px] font-medium leading-[24px] py-[12px] px-[16px]">
              {t(item.type)}
            </td>
            <td className="text-[#313131] text-[14px] font-medium leading-[24px] py-[12px] px-[16px]">
              {t(item.status)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContentsTable;
