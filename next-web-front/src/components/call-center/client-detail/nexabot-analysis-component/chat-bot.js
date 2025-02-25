import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import ChatMessage from "./chat-message";
import Image from "next/image";

const ChatBot = () => {
  const t = useTranslations("NexabotAnalysis.chatbot");
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const textAreaRef = useRef(null);

  const chatMessages = [
    {
      isBot: true,
      message: "Merhaba! Size nasıl yardımcı olabilirim?",
      time: "09:30",
    },
    {
      isBot: false,
      message: "Merhaba, bugünkü raporumu görebilir miyim?",
      time: "09:31",
    },
    {
      isBot: true,
      message:
        "Tabii ki, hemen raporunuzu getiriyorum. Bugün için duygusal analiz sonuçlarınız oldukça pozitif görünüyor.",
      time: "09:31",
    },
    {
      isBot: false,
      message: "Teşekkür ederim, detaylı görebilir miyim?",
      time: "09:32",
    },
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Sadece yeni mesaj eklendiğinde scroll yapılacak
  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1];
      if (lastMessage && !lastMessage.isBot) {
        scrollToBottom();
      }
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Mesaj gönderme işlemi burada yapılır
      setInputMessage("");
      scrollToBottom();
      autoResize();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Textarea'nın yüksekliğini, içerisindeki içeriğe göre otomatik ayarlayan fonksiyon
  const autoResize = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  return (
    <div className="w-full xl:w-[400px] bg-[#FAFAFA] rounded-[20px] pb-4 px-4 flex flex-col h-[calc(100vh-180px)] xl:h-[calc(100vh-140px)]">
      <div className="w-full h-[48px] bg-[#FAFAFA] text-center text-aside_menu-menu_list_itemm text-[18px] font-semibold leading-[22px] pt-4">
        {t("title")}
      </div>
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 events-container scroll-smooth"
      >
        <div className="flex flex-col">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.isBot ? "justify-start" : "justify-end"
              } mb-4`}
            >
              <ChatMessage
                isBot={msg.isBot}
                message={msg.message}
                time={msg.time}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="relative w-full flex items-end">
        <textarea
          ref={textAreaRef}
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => !inputMessage && setIsInputFocused(false)}
          placeholder={t("messagePlaceholder")}
          className="flex-1 px-4 py-3 pr-16 rounded-[22px] bg-white resize-none text-[14px] focus:outline-none shadow-sm placeholder:text-[#9D9D9D] placeholder:pt-[5px] pt-[17px] events-container max-sm:text-[12px] max-sm:px-3 max-sm:py-2"
          style={{
            minHeight: "15px",
            maxHeight: "200px",
            lineHeight: "10px",
          }}
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 flex-shrink-0 w-9 h-9 rounded-full bg-[#E0F1FE] hover:bg-[#CCE7FD] transition-colors flex items-center justify-center absolute right-1.5 bottom-1.5 max-sm:w-7 max-sm:h-7 max-sm:right-1 max-sm:bottom-1"
          aria-label={t("send")}
        >
          <Image
            src="/call-center/send.svg"
            alt={t("send")}
            width={16}
            height={16}
            className="ml-0.5 max-sm:w-4 max-sm:h-4"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
