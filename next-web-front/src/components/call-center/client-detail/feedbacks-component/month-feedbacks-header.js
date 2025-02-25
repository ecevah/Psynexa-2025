import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import HomeDropdown from "../../dropdown/home-dropdown";
import { useTranslations } from "next-intl";

const MonthFeedbacksHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const searchRef = useRef(null);
  const tTemplate = useTranslations("Template");
  const [selectedOption, setSelectedOption] = useState(tTemplate("allTime"));

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

  const timeOptions = [
    { value: "thisMonth", label: tTemplate("allTime") },
    { value: "lastWeek", label: tTemplate("lastWeek") },
    { value: "lastMonth", label: tTemplate("lastMonth") },
    { value: "lastYear", label: tTemplate("lastYear") },
  ];

  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white rounded-[20px] mb-6">
      <div className="text-[20px] font-semibold text-aside_menu-menu_list_itemm">
        {months[selectedMonth].label} Feedbacks
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <div
          ref={searchRef}
          className={`flex items-center transition-all duration-300 ${
            isSearchOpen ? "w-full sm:w-[200px]" : "w-[50px]"
          } h-[50px] bg-[#F7F7F7] rounded-full overflow-hidden`}
        >
          {isSearchOpen ? (
            <div className="flex items-center w-full px-3">
              <Image
                src="/call-center/search.svg"
                alt="Search"
                width={20}
                height={20}
                className="mr-2 flex-shrink-0"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-[14px] text-[#0B1215]"
                placeholder="Search..."
              />
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full h-full flex items-center justify-center"
              aria-label="Search"
            >
              <Image
                src="/call-center/search.svg"
                alt="Search"
                width={24}
                height={24}
              />
            </button>
          )}
        </div>

        <div className="flex flex-row gap-4 w-full sm:w-auto">
          <HomeDropdown
            options={months}
            selected={months[selectedMonth].label}
            onChange={(value) => {
              const month = months.find((m) => m.label === value);
              if (month) setSelectedMonth(month.value);
            }}
            customButton={
              <button className="flex items-center gap-2 h-[50px] px-4 bg-[#F7F7F7] rounded-full text-[14px] font-medium text-[#0B1215] whitespace-nowrap">
                Choose Month
                <Image
                  src="/call-center/calendar.svg"
                  alt="Calendar"
                  width={20}
                  height={20}
                />
              </button>
            }
            style={{
              zIndex: 21,
              fontSize: "14px",
              lineHeight: "20px",
            }}
          />

          <HomeDropdown
            options={timeOptions}
            selected={selectedOption}
            onChange={(value) => setSelectedOption(value)}
            style={{
              zIndex: 20,
              fontSize: "14px",
              lineHeight: "20px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MonthFeedbacksHeader;
