import React from "react";

const ChatMessage = ({ isBot, message, time }) => {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`flex min-w-[60px] max-w-[298px] p-3 items-start gap-2 ${
          isBot
            ? "bg-white rounded-[12px_12px_12px_2px]"
            : "bg-[#E0F1FE] rounded-[12px_12px_2px_12px]"
        }`}
      >
        {message}
      </div>
      <div className="text-[#0B1215] text-right font-urbanist text-[14px] font-light leading-[140%]">
        {time}
      </div>
    </div>
  );
};

export default ChatMessage;
