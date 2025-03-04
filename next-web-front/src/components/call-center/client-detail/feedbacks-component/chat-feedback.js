import React, { useState } from "react";
import { useTranslations } from "next-intl";
import HeaderCircleIconButton from "../../header/circle-icon-button/header-circle-icon-button";
import { useSelector } from "react-redux";
import { selectMessages } from "@/store/features/feedbacksSlice";

const ChatFeedback = () => {
  const t = useTranslations("Feedbacks.chatFeedback");
  const [feedbackState, setFeedbackState] = useState("initial"); // initial, input, completed
  const [selectedType, setSelectedType] = useState(null); // like, dislike
  const [feedbackText, setFeedbackText] = useState("");

  const messages = useSelector(selectMessages);

  const handleFeedbackClick = (type) => {
    setSelectedType(type);
    setFeedbackState("input");
  };

  const handleSave = () => {
    if (feedbackText.trim()) {
      setFeedbackState("completed");
    }
  };

  if (feedbackState === "completed") {
    return (
      <div className="flex flex-col gap-[8px] items-center justify-center w-full max-w-[316px] h-[173px] rounded-[20px] border-[1px] border-[#B0B0B0] border-dashed mx-auto">
        <div className="text-aside_menu-menu_list_itemm text-[18px] font-medium leading-[32px] text-center px-4">
          {t("thankYou")}
        </div>
      </div>
    );
  }

  if (feedbackState === "input") {
    return (
      <div className="flex flex-col gap-[12px] items-center w-full max-w-[316px] mx-auto">
        <div className="w-full h-[120px] rounded-[20px] border-[1px] border-[#B0B0B0] border-dashed p-4">
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={t("writeFeedback")}
            className="w-full h-full resize-none text-[14px] focus:outline-none"
          />
        </div>
        <button
          onClick={handleSave}
          className="h-[40px] px-6 rounded-full w-full bg-primary_color_font_palette-600 hover:bg-primary_color_font_palette-700 transition-colors text-[17px] font-semibold text-white"
        >
          {t("saveFeedback")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[8px] items-center justify-center w-full max-w-[316px] h-[173px] rounded-[20px] border-[1px] border-[#B0B0B0] border-dashed mx-auto">
      <div className="text-aside_menu-menu_list_itemm text-[18px] font-medium leading-[32px] text-center px-4">
        {t("giveFeedback")}
      </div>
      <div className="flex flex-row justify-center items-center gap-[20px]">
        <HeaderCircleIconButton
          icon="/call-center/like.svg"
          text={t("like")}
          labelIsVisible={false}
          isBig={false}
          style={{ backgroundColor: "#F7F7F7" }}
          func={() => handleFeedbackClick("like")}
        />
        <HeaderCircleIconButton
          icon="/call-center/dislike.svg"
          text={t("dislike")}
          labelIsVisible={false}
          isBig={false}
          style={{ backgroundColor: "#F7F7F7" }}
          func={() => handleFeedbackClick("dislike")}
        />
      </div>
    </div>
  );
};

export default ChatFeedback;
