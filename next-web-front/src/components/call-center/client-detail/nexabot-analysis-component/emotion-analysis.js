import React from "react";
import { useTranslations } from "next-intl";

const EmotionAnalysis = ({ selectedEmotion }) => {
  const t = useTranslations("NexabotAnalysis");

  const emotionData = {
    Angry: {
      color: "#FE7575",
      parameters: [
        { name: "frustration", percentage: "45%" },
        { name: "irritation", percentage: "30%" },
        { name: "rage", percentage: "15%" },
        { name: "annoyance", percentage: "10%" },
      ],
    },
    Happy: {
      color: "#FEE278",
      parameters: [
        { name: "joy", percentage: "40%" },
        { name: "contentment", percentage: "25%" },
        { name: "satisfaction", percentage: "20%" },
        { name: "pleasure", percentage: "15%" },
      ],
    },
    Depressed: {
      color: "#C179FF",
      parameters: [
        { name: "sadness", percentage: "35%" },
        { name: "hopelessness", percentage: "30%" },
        { name: "emptiness", percentage: "20%" },
        { name: "despair", percentage: "15%" },
      ],
    },
    Sad: {
      color: "#64C6EA",
      parameters: [
        { name: "grief", percentage: "40%" },
        { name: "melancholy", percentage: "25%" },
        { name: "sorrow", percentage: "20%" },
        { name: "loneliness", percentage: "15%" },
      ],
    },
    Overjoyed: {
      color: "#AFF06E",
      parameters: [
        { name: "elation", percentage: "35%" },
        { name: "euphoria", percentage: "30%" },
        { name: "delight", percentage: "20%" },
        { name: "excitement", percentage: "15%" },
      ],
    },
  };

  // Eğer selectedEmotion null veya undefined ise Overjoyed'i kullan
  const emotionToShow = selectedEmotion || "Overjoyed";
  const currentEmotion = emotionData[emotionToShow];

  return (
    <div className="flex flex-col ml-[20px]">
      <h2 className="text-[20px] font-semibold text-aside_menu-menu_list_itemm mb-4">
        {t(`emotions.${emotionToShow.toLowerCase()}`)} {t("emotionAnalysis")}
      </h2>
      {currentEmotion.parameters.map((parameter, index) => (
        <div key={index} className="flex flex-row gap-[20px] items-center mb-2">
          <div
            className="w-[12px] h-[12px] rounded-full"
            style={{ backgroundColor: currentEmotion.color }}
          />
          <div className="text-[14px] font-medium leading-[32px]">
            {t(`parameters.${parameter.name}`)}
          </div>
          <div className="text-[14px] font-light leading-[32px]">
            {parameter.percentage}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmotionAnalysis;
