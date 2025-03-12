import React from "react";
import Image from "next/image";

const MailCard = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 pt-[50px] sm:pt-[60px] md:pt-[80px] pb-[80px] sm:pb-[100px] md:pb-[120px]">
      <h2 className="text-white text-[24px] sm:text-[28px] md:text-[32px] font-semibold leading-tight sm:leading-[26px] mb-[8px] sm:mb-[12px] text-center">
        Join Our Newsletter
      </h2>
      <p className="text-white text-[12px] sm:text-[14px] leading-[22px] sm:leading-[26px] mb-[24px] md:mb-[30px] text-center">
        Be the first to know when we launch
      </p>

      <div className="w-full max-w-[500px] relative">
        <div className="flex items-center relative">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-[50px] sm:h-[56px] pl-[16px] pr-[60px] py-[12px] rounded-[32px] bg-[#F5F5F7] text-[#0B1215] font-urbanist text-[15px] sm:text-[17px] font-medium leading-[26px] outline-none"
          />
          <button
            type="submit"
            className="absolute right-[8px] flex items-center justify-center w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#0B1215] hover:bg-[#1a2328] transition-colors"
          >
            <div className="flex items-center justify-center w-full h-full">
              <Image
                src="/landing/right-arrow-icon.svg"
                alt="Send"
                width={16}
                height={16}
                className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] transform -rotate-45"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MailCard;
