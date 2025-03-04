import React from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { selectTestTableData } from "@/store/features/emotionTrackingSlice";
import HeaderCircleIconButton from "../../header/circle-icon-button/header-circle-icon-button";

const TestTable = () => {
  const t = useTranslations("AppStatistics");
  const { items } = useSelector(selectTestTableData);

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#F5F6FA]">
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              {t("testName")}
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              {t("date")}
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              {t("score")}
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              {t("status")}
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              {t("detail")}
            </th>
            <th className="py-4 px-4 text-left text-[14px] font-medium text-[#9D9D9D]">
              {t("download")}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[#F5F6FA]">
              <td className="py-4 px-4 text-[14px] font-medium text-[#0B1215]">
                {item.testName}
              </td>
              <td className="py-4 px-4 text-[14px] font-medium text-[#0B1215]">
                {item.date}
              </td>
              <td className="py-4 px-4 text-[14px] font-medium text-[#0B1215]">
                {item.score}
              </td>
              <td className="py-4 px-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8F5E9] text-[#43A047] text-[12px] font-medium">
                  {t(item.status)}
                </div>
              </td>
              <td className="py-4 px-4">
                <HeaderCircleIconButton
                  icon="/call-center/document.svg"
                  text={t("detail")}
                  func={() => {}}
                  className="!bg-[#E3F2FD] !hover:bg-[#BBDEFB]"
                  style={{ backgroundColor: "#E0F1FE" }}
                />
              </td>
              <td className="py-4 px-4">
                <HeaderCircleIconButton
                  icon="/call-center/download.svg"
                  text={t("download")}
                  func={() => {}}
                  className="!bg-[#E3F2FD] !hover:bg-[#BBDEFB]"
                  style={{ backgroundColor: "#E0F1FE" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestTable;
