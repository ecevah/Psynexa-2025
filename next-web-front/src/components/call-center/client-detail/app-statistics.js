import React, { useState, useRef, useEffect } from "react";
import HomeDropdown from "../dropdown/home-dropdown";
import { useTranslations } from "next-intl";
import EmotionTrackingLine from "./app-statistics-component/emotion-tracking-line";
import EmotionTrackingBar from "./app-statistics-component/emotion-tracking-bar";
import CircleIconButtons from "../header/circle-icon-button/circle-icon-buttons";
import HeaderCircleIconButton from "../header/circle-icon-button/header-circle-icon-button";
import TestTable from "./app-statistics-component/test-table";
import ContentsTable from "./app-statistics-component/contents-table";
import FilterPopup from "./app-statistics-component/filter-popup";
import Image from "next/image";

const AppStatistics = () => {
  const t = useTranslations("AppStatistics");
  const tTemplate = useTranslations("Template");
  const [selectedOption, setSelectedOption] = useState(tTemplate("allTime"));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col gap-[20px] py-[20px]">
        {/* First Row */}
        <div className="flex flex-col lg:flex-row gap-[13px]">
          {/* Emotion Tracking */}
          <div className="flex flex-col w-full lg:w-[66%] gap-[10px] px-[12px] py-[20px] bg-white rounded-[20px] shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div className="text-aside_menu-menu_list_itemm text-[20px] font-semibold leading-[32px]">
                {t("emotionTracking")}
              </div>
              <HomeDropdown
                options={[
                  { value: "thisMonth", label: tTemplate("allTime") },
                  { value: "lastWeek", label: tTemplate("lastWeek") },
                  { value: "lastMonth", label: tTemplate("lastMonth") },
                  { value: "lastYear", label: tTemplate("lastYear") },
                ]}
                selected={selectedOption}
                onChange={(value) => setSelectedOption(value)}
                style={{ zIndex: 100 }}
              />
            </div>
            <EmotionTrackingLine />
          </div>

          {/* Emotion Tracking Bar */}
          <div className="flex flex-col w-full lg:w-[34%] gap-[10px] px-[12px] py-[20px] bg-white rounded-[20px] shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div className="text-aside_menu-menu_list_itemm text-[20px] font-semibold leading-[32px]">
                {t("emotionTrackingBar")}
              </div>
              <HomeDropdown
                options={[
                  { value: "thisMonth", label: tTemplate("allTime") },
                  { value: "lastWeek", label: tTemplate("lastWeek") },
                  { value: "lastMonth", label: tTemplate("lastMonth") },
                  { value: "lastYear", label: tTemplate("lastYear") },
                ]}
                selected={selectedOption}
                onChange={(value) => setSelectedOption(value)}
                style={{ zIndex: 100 }}
              />
            </div>
            <EmotionTrackingBar />
          </div>
        </div>

        {/* Second Row */}
        <div className="flex flex-col lg:flex-row gap-[13px]">
          {/* Test Results */}
          <div className="flex flex-col w-full lg:w-[50%] gap-[10px] px-[12px] py-[20px] bg-white rounded-[20px] shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div className="text-aside_menu-menu_list_itemm text-[20px] font-semibold leading-[32px]">
                {t("testResults")}
              </div>
              <div className="flex flex-row gap-[10px] w-full sm:w-auto">
                <div
                  ref={searchRef}
                  className={`flex items-center transition-all duration-300 ${
                    isSearchOpen ? "w-full sm:w-[200px]" : "w-[60px]"
                  } h-[60px] min-w-[60px] bg-[#F7F7F7] rounded-full overflow-hidden`}
                >
                  {isSearchOpen ? (
                    <div className="flex items-center w-full px-3">
                      <Image
                        src="/call-center/search.svg"
                        alt={t("search")}
                        width={20}
                        height={20}
                        className="mr-2 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-none text-[14px] text-[#0B1215]"
                        placeholder={t("searchPlaceholder")}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="w-full h-full flex items-center justify-center"
                      aria-label={t("search")}
                    >
                      <Image
                        src="/call-center/search.svg"
                        alt={t("search")}
                        width={24}
                        height={24}
                      />
                    </button>
                  )}
                </div>
                <HomeDropdown
                  options={[
                    { value: "thisMonth", label: tTemplate("allTime") },
                    { value: "lastWeek", label: tTemplate("lastWeek") },
                    { value: "lastMonth", label: tTemplate("lastMonth") },
                    { value: "lastYear", label: tTemplate("lastYear") },
                  ]}
                  selected={selectedOption}
                  onChange={(value) => setSelectedOption(value)}
                  style={{ zIndex: 100 }}
                />
              </div>
            </div>
            <div className="mt-4 overflow-y-auto events-container">
              <TestTable />
            </div>
          </div>

          {/* Contents Data */}
          <div className="flex flex-col w-full lg:w-[50%] gap-[10px] px-[12px] py-[20px] bg-white rounded-[20px] shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div className="text-aside_menu-menu_list_itemm text-[20px] font-semibold leading-[32px]">
                {t("contentsData")}
              </div>
              <div className="flex flex-row gap-[10px] w-full sm:w-auto">
                <div
                  ref={searchRef}
                  className={`flex items-center transition-all duration-300 ${
                    isSearchOpen ? "w-full sm:w-[200px]" : "w-[40px]"
                  } h-[40px] bg-[#F7F7F7] rounded-full overflow-hidden`}
                >
                  {isSearchOpen ? (
                    <div className="flex items-center w-full px-3">
                      <Image
                        src="/call-center/search.svg"
                        alt={t("search")}
                        width={20}
                        height={20}
                        className="mr-2 flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-none text-[14px] text-[#0B1215]"
                        placeholder={t("searchPlaceholder")}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="w-full h-full flex items-center justify-center"
                      aria-label={t("search")}
                    >
                      <Image
                        src="/call-center/search.svg"
                        alt={t("search")}
                        width={24}
                        height={24}
                      />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="flex flex-row gap-[10px] px-[16px] bg-primary_color_font_palette-600 rounded-full items-center justify-center hover:bg-primary_color_font_palette-700 whitespace-nowrap"
                >
                  <Image
                    src="/call-center/filter-2.svg"
                    alt={t("filter")}
                    width={20}
                    height={20}
                    className="min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px]"
                  />
                  <div className="text-white text-[16px] font-semibold leading-[32px]">
                    {t("filter")}
                  </div>
                </button>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <ContentsTable searchQuery={searchQuery} />
            </div>
          </div>
        </div>
      </div>
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </>
  );
};

export default AppStatistics;
