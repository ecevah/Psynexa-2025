import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import ChatBot from "./nexabot-analysis-component/chat-bot";
import EmotionDoughnut from "./nexabot-analysis-component/emotion-doughnut";
import EmotionAnalysis from "./nexabot-analysis-component/emotion-analysis";
import JudicialExpressionsTable from "./nexabot-analysis-component/judicial-expressions-table";
import Image from "next/image";
import {
  selectSelectedEmotion,
  setSelectedEmotion,
} from "@/store/features/nexabotAnalysisSlice";

const NexabotAnalysis = () => {
  const t = useTranslations("NexabotAnalysis");
  const dispatch = useDispatch();
  const selectedEmotion = useSelector(selectSelectedEmotion);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  const handleEmotionSelect = (emotion) => {
    // Eğer seçilen duygu zaten seçili değilse, yeni duyguyu seç
    dispatch(setSelectedEmotion(emotion));
  };

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
    <div className="grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-6 w-full min-h-full pb-[20px] overflow-y-hidden">
      {/* Sol Taraf - Ana İçerik */}
      <div className="flex flex-col gap-6 flex-1 min-w-0">
        {/* Emotion Analysis Kartı */}
        <div className="bg-white rounded-[20px] p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[400px]">
              <EmotionDoughnut
                selectedEmotion={selectedEmotion}
                onEmotionSelect={handleEmotionSelect}
              />
            </div>
            <div className="flex-1 min-w-0">
              <EmotionAnalysis selectedEmotion={selectedEmotion} />
            </div>
          </div>
        </div>

        {/* Judicial Expression Kartı */}
        <div className="bg-white rounded-[20px] p-6 h-full">
          <div className="flex flex-row w-full items-center justify-between mb-6">
            <div className="text-[20px] font-semibold leading-[32px] text-aside_menu-menu_list_itemm">
              {t("judicialExpression")}
            </div>
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
          </div>

          <div className="overflow-x-auto">
            <JudicialExpressionsTable searchQuery={searchQuery} />
          </div>
        </div>
      </div>

      {/* Sağ Taraf - ChatBot */}
      <div className="xl:w-[400px] flex-shrink-0">
        <ChatBot />
      </div>
    </div>
  );
};

export default NexabotAnalysis;
