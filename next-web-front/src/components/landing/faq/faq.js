"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const FAQItem = ({
  number,
  title,
  content,
  isExpanded,
  onToggle,
  isFirst,
  isLast,
}) => {
  return (
    <div className="w-full" data-aos="fade-up">
      <div
        className={`w-full flex justify-between items-center py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 cursor-pointer border-b border-white border-opacity-50 ${
          isExpanded ? "bg-[rgba(203,203,203,0.10)] border-b-0" : ""
        } ${
          isFirst
            ? "rounded-t-[16px] sm:rounded-t-[20px] md:rounded-t-[24px]"
            : ""
        } ${
          isLast && !isExpanded
            ? "rounded-b-[16px] sm:rounded-b-[20px] md:rounded-b-[24px]"
            : ""
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-1 overflow-hidden">
          <div className="text-white font-urbanist text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-medium shrink-0">
            {number < 10 ? `0${number}` : number}
          </div>
          <div className="text-white font-urbanist text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] font-medium leading-tight">
            {title}
          </div>
        </div>
        <div
          className={`w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] flex-shrink-0 flex items-center justify-center transition-transform duration-300 bg-[#1A4B72] rounded-full border border-solid border-white ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div
        className={`w-full bg-[rgba(203,203,203,0.10)] transition-all duration-300 ease-in-out overflow-hidden ${
          isLast
            ? "rounded-b-[16px] sm:rounded-b-[20px] md:rounded-b-[24px]"
            : ""
        } ${
          isExpanded
            ? "max-h-[1000px] opacity-100 p-4 sm:p-6 md:p-8"
            : "max-h-0 opacity-0 p-0 border-opacity-0"
        }`}
      >
        <div className="text-white font-urbanist text-[14px] sm:text-[16px] md:text-[18px] leading-[1.5] sm:leading-[1.6] md:leading-[1.7]">
          {content}
        </div>
      </div>
    </div>
  );
};

const Faq = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const t = useTranslations("HomePage.faq");

  // Create our own FAQ array with hardcoded indices
  // Since we know there are 5 FAQ items, we manually retrieve each one
  const faqData = [
    {
      title: t("item1.title"),
      content: t("item1.content"),
    },
    {
      title: t("item2.title"),
      content: t("item2.content"),
    },
    {
      title: t("item3.title"),
      content: t("item3.content"),
    },
    {
      title: t("item4.title"),
      content: t("item4.content"),
    },
    {
      title: t("item5.title"),
      content: t("item5.content"),
    },
  ];

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16"
      id="faq-section"
    >
      <div className="w-full border border-white border-opacity-50 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden">
        {faqData.map((faq, index) => (
          <FAQItem
            key={index}
            number={index + 1}
            title={faq.title}
            content={faq.content}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
            isFirst={index === 0}
            isLast={index === faqData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;
