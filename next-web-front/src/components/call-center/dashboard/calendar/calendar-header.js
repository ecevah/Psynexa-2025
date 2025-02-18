"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CalendarHeader({
  date,
  showMonthSelector,
  setShowMonthSelector,
  months,
  handleMonthSelect,
  formatMonthYear,
}) {
  const t = useTranslations("Calendar");

  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-[#0B1215] text-lg font-medium">{t("mySchedule")}</h2>
      <div className="flex items-center gap-2">
        <div className="relative">
          <div
            onClick={() => setShowMonthSelector(!showMonthSelector)}
            className="bg-[#F6F8FA] rounded-full pl-[35px] pr-4 pb-2 pt-2.5 text-[14px] cursor-pointer hover:bg-[#E0E4E8] transition-colors relative font-semibold leading-[20px]"
          >
            <Image
              src="/call-center/calendar.svg"
              alt="Calendar"
              width={18}
              height={18}
              className="max-w-[18px] max-h-[18px] absolute top-[10px] left-[10px] grayscale"
            />
            {formatMonthYear(date)}
          </div>
          {showMonthSelector && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-[12px] shadow-lg py-2 z-10 min-w-[120px]">
              {months.map((month) => (
                <div
                  key={month.value}
                  onClick={() => handleMonthSelect(month.value)}
                  className="px-4 py-2 hover:bg-[#F6F8FA] cursor-pointer text-sm"
                >
                  {month.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-[36px] h-[36px] flex items-center justify-center bg-icon_bg_new_kit-100 rounded-full cursor-pointer hover:bg-[#E0E4E8] transition-colors">
          <Image
            src="/call-center/arrow-icon.svg"
            alt="Next Month"
            width={22.4}
            height={22.4}
            className="max-w-[22.4px] max-h-[22.4px]"
          />
        </div>
      </div>
    </div>
  );
}
