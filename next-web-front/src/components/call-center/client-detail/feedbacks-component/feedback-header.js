"use client";
import React, { useState } from "react";
import HeaderCircleIconButton from "../../header/circle-icon-button/header-circle-icon-button";
import HomeDropdown from "../../dropdown/home-dropdown";
import { useTranslations } from "next-intl";

const FeedbackHeader = ({ parameters, onChartToggle, isLineChart }) => {
  const tTemplate = useTranslations("Template");
  const tFeedback = useTranslations("Feedbacks");
  const [selectedOption, setSelectedOption] = useState(tTemplate("allTime"));
  const timeOptions = [
    { value: "thisMonth", label: tTemplate("allTime") },
    { value: "lastWeek", label: tTemplate("lastWeek") },
    { value: "lastMonth", label: tTemplate("lastMonth") },
    { value: "lastYear", label: tTemplate("lastYear") },
  ];
  return (
    <div className="flex flex-col sm:flex-row w-full justify-between items-center mb-6 relative z-10 gap-4">
      <div className="font-semibold text-lg leading-[28px]">
        {tFeedback("feedback")}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {Object.entries(parameters).map(([key, param]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: param.color }}
            />
            <span className="text-sm text-[#0B1215]">
              {param.name === "Negative"
                ? tFeedback("negative")
                : tFeedback("positive")}
            </span>
            <span className="text-sm font-semibold text-[#0B1215]">
              {param.total}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center gap-4">
        <HeaderCircleIconButton
          icon={
            isLineChart
              ? "/call-center/bar-chart.svg"
              : "/call-center/statistics.svg"
          }
          text={isLineChart ? "Bar Chart" : "Line Chart"}
          func={onChartToggle}
          style={{ backgroundColor: "#F7F7F7" }}
          isBig={false}
          labelIsVisible={false}
        />
        <HomeDropdown
          options={timeOptions}
          selected={selectedOption}
          onChange={(value) => setSelectedOption(value)}
          style={{ zIndex: 20 }}
        />
      </div>
    </div>
  );
};

export default FeedbackHeader;
