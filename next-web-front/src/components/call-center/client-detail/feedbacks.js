import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import BarChart from "./feedbacks-component/bar-chart";
import LineChart from "./feedbacks-component/line-chart";
import FeedbackHeader from "./feedbacks-component/feedback-header";
import MonthFeedbacksHeader from "./feedbacks-component/month-feedbacks-header";
import MonthFeedbackTable from "./feedbacks-component/month-feedback-table";
import Image from "next/image";
import ChatMessage from "./nexabot-analysis-component/chat-message";
import ChatFeedback from "./feedbacks-component/chat-feedback";
import { useSelector } from "react-redux";
import {
  selectMessages,
  selectChartData,
} from "@/store/features/feedbacksSlice";

const Feedbacks = () => {
  const t = useTranslations("Feedbacks");
  const [isLineChart, setIsLineChart] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messages = useSelector(selectMessages);
  const chartData = useSelector(selectChartData);
  const textAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const parameters = {
    positive: {
      color: "#45B369",
      name: "Positive",
      total: chartData.reduce((acc, data) => acc + data.positive, 0),
    },
    negative: {
      color: "#EF4A00",
      name: "Negative",
      total: chartData.reduce((acc, data) => acc + Math.abs(data.negative), 0),
    },
  };

  const handleChartToggle = () => {
    setIsLineChart(!isLineChart);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newUserMessage = {
        id: messages.length + 1,
        text: inputMessage,
        isBot: false,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInputMessage("");
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
      }

      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: t("botResponse"),
          isBot: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, botResponse]);
        scrollToBottom();
      }, 1000);

      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoResize = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,364px] gap-5 w-full min-h-full pb-[20px]">
      {/* Sol Taraf - Ana İçerik */}
      <div className="flex flex-col gap-5">
        {/* Grafik Kartı */}
        <div className="bg-white rounded-[20px] p-4 sm:p-6">
          <FeedbackHeader
            onChartToggle={handleChartToggle}
            isLineChart={isLineChart}
          />
          <div className="w-full overflow-hidden events-container">
            {isLineChart ? <LineChart /> : <BarChart />}
          </div>
        </div>

        {/* Aylık Geri Bildirimler Tablosu */}
        <div className="bg-white rounded-[20px] p-4 sm:p-6">
          <MonthFeedbacksHeader />
          <div className="mt-4 overflow-x-auto">
            <MonthFeedbackTable />
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Sohbet ve Geri Bildirim */}
      <div className="flex flex-col gap-5">
        {/* Geri Bildirim Kartı */}
        <div className="bg-white rounded-[20px] p-4 sm:p-6">
          <div className="flex flex-row justify-between items-center mb-6">
            <div className="px-3 py-1.5 rounded-full bg-[#EF477026] text-[12px] font-medium text-[#EF4770]">
              {t("negative")}
            </div>
            <div className="text-aside_menu-menu_list_itemm text-[14px] sm:text-base font-medium">
              #Dec 7, 2024 - 03:45 PM
            </div>
          </div>
          <div className="text-aside_menu-menu_list_itemm text-base sm:text-lg font-medium leading-relaxed">
            {t("feedbackExample")}
          </div>
        </div>

        {/* Sohbet Kartı */}
        <div className="bg-white rounded-[20px] p-4 sm:p-6 flex-1 min-h-[500px] max-h-[680px]">
          <div className="flex flex-col h-full">
            <div className="text-lg sm:text-xl font-semibold text-aside_menu-menu_list_itemm mb-4 text-center">
              {t("chatTitle")}
            </div>

            {/* Mesaj Listesi */}
            <div className="flex-1 mb-4 events-container max-h-[400px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  } mb-4`}
                >
                  <ChatMessage
                    isBot={message.isBot}
                    message={message.text}
                    time={message.time}
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Geri Bildirim Bölümü */}
            <div className="mt-auto">
              <ChatFeedback />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedbacks;
