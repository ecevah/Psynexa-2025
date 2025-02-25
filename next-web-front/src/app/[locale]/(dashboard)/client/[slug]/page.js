"use client";
import Breadcrumb from "@/components/call-center/breadcrumb/breadcrumb";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import UserProfile from "@/components/call-center/client-detail/user-profile";
import AppStatistics from "@/components/call-center/client-detail/app-statistics";
import NexabotAnalysis from "@/components/call-center/client-detail/nexabot-analysis";
import Feedbacks from "@/components/call-center/client-detail/feedbacks";
import { useTranslations } from "next-intl";
const DetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sliderStyle, setSliderStyle] = useState({});
  const buttonsRef = useRef({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const t = useTranslations("ClientDetail");

  const tabs = [
    { id: "userProfile", label: t("userProfile") },
    { id: "appStatistics", label: t("appStatistics") },
    { id: "nexabotAnalysis", label: t("nexabotAnalysis") },
    { id: "feedback", label: t("feedback") },
  ];

  const queryTab = searchParams.get("tab");
  const isValidTab = tabs.some((tab) => tab.id === queryTab);
  const [activeTab, setActiveTab] = useState(
    isValidTab ? queryTab : tabs[0].id
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (queryTab && !isValidTab) {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tabs[0].id);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [queryTab, isValidTab, router, searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.push(`?${params.toString()}`, { scroll: false });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const activeButton = buttonsRef.current[activeTab];
    if (activeButton) {
      const parentLeft =
        activeButton.parentElement.getBoundingClientRect().left;
      const buttonLeft = activeButton.getBoundingClientRect().left;
      const relativeLeft = buttonLeft - parentLeft;

      setSliderStyle({
        left: `${relativeLeft}px`,
        width: `${activeButton.offsetWidth}px`,
      });
    }
  }, [activeTab]);

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  const renderTabContent = () => {
    switch (activeTab) {
      case "userProfile":
        return <UserProfile />;
      case "appStatistics":
        return <AppStatistics />;
      case "nexabotAnalysis":
        return <NexabotAnalysis />;
      case "feedback":
        return <Feedbacks />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mt-[20px] mb-[16px] w-full flex flex-row min-[600px]:flex-col items-start justify-between min-[900px]:flex-row min-[900px]:items-center gap-4">
        <Breadcrumb />

        {/* Mobile Dropdown */}
        <div className="relative ml-auto min-[600px]:hidden" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-science_blue-100 py-[12px] px-[16px] rounded-full text-[14px] font-semibold"
          >
            <span>{activeTabLabel}</span>
            <Image
              src="/call-center/arrow-down.svg"
              alt="arrow"
              width={16}
              height={16}
              className={`transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-[200px] bg-white rounded-[12px] shadow-lg py-1 z-50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full text-left px-4 py-3 text-[14px] hover:bg-science_blue-100 transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-science_blue-100 font-semibold"
                        : ""
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Tabs */}
        <div className="hidden min-[600px]:flex ml-auto w-fit min-[900px]:w-auto py-[8px] px-[16px] bg-science_blue-100 rounded-full gap-[8px] relative">
          <div
            className="absolute bg-[#0A6EBD] rounded-full transition-all duration-300 ease-in-out h-[46px]"
            style={sliderStyle}
          />
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => (buttonsRef.current[tab.id] = el)}
              onClick={() => handleTabChange(tab.id)}
              className={`py-[12px] px-[16px] rounded-full transition-all duration-200 whitespace-nowrap text-[14px] min-[400px]:text-[16px] font-semibold leading-[22px] text-aside_menu-menu_list_itemm relative z-10
                ${activeTab === tab.id ? "text-white" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto events-container">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DetailPage;
