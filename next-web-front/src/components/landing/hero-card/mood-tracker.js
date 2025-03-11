import Image from "next/image";
import React from "react";

const MoodTracker = () => {
  return (
    <div className="flex flex-col w-[340px] px-[12px] py-[24px] rounded-[20px] bg-[#095c9c33] shadow-[0px_1px_6px_0px_rgba(157,157,157,0.15)]">
      <div className="flex flex-row items-center justify-between">
        <div className="text-[18px] font-semibold leading-[20px] text-white">
          Weekly Mood Tracker
        </div>
        <div className="p-[8px] border-[0.3px] border-white border-solid rounded-[13px] gap-[4px] flex flex-row bg-[#08538E]">
          <div className="text-[14px] font-medium leading-[20px] text-white">
            Weekly
          </div>
          <Image
            src="/landing/arrow-down.svg"
            width={13}
            height={13}
            alt="arrow-down"
            className="max-w-[13px] min-w-[13px] max-h-[13px] min-h-[13px] opacity-70 my-auto"
          />
        </div>
      </div>
      <div className="flex flex-row w-full max-w-[340px] overflow-x-hidden gap-[10px] mt-[24px]">
        <div className="min-w-[48px] py-[8px] rounded-[16px] gap-[7px] flex flex-col bg-[#D0F49B]">
          <div className="flex flex-col items-center justify-center mt-[3px]">
            <div className="text-[#0B1215] text-[14px] text-center leading-[14px]">
              12
            </div>
            <div className="text-[#0B1215] text-[14px] text-center leading-[14px]">
              Mon
            </div>
          </div>
          <Image
            src="/landing/green-happy.svg"
            width={32}
            height={32}
            className="max-w-[32px] min-w-[32px] max-h-[32px] min-h-[32px] mx-auto"
            alt="green-happy"
          />
        </div>
        <div className="min-w-[48px] py-[8px] rounded-[16px] gap-[7px] flex flex-col bg-[#FFEB9D]">
          <div className="flex flex-col items-center justify-center mt-[3px]">
            <div className="text-[#0B1215] text-[14px] text-center leading-[14px]">
              13
            </div>
            <div className="text-[#0B1215] text-[14px] text-center leading-[14px]">
              Tue
            </div>
          </div>
          <Image
            src="/landing/yellow-happy.svg"
            width={32}
            height={32}
            className="max-w-[32px] min-w-[32px] max-h-[32px] min-h-[32px] mx-auto"
            alt="yellow-happy"
          />
        </div>
        <div className="min-w-[48px] py-[8px] rounded-[16px] gap-[7px] flex flex-col bg-[#FF9090]">
          <div className="flex flex-col items-center justify-center mt-[3px]">
            <div className="text-[#0B1215] text-[14px] text-center leading-[14px]">
              14
            </div>
            <div className="text-[#0B1215] text-[14px] text-center leading-[14px]">
              Wed
            </div>
          </div>
          <Image
            src="/landing/red-angry.svg"
            width={32}
            height={32}
            className="max-w-[32px] min-w-[32px] max-h-[32px] min-h-[32px] mx-auto"
            alt="red-angry"
          />
        </div>
        <div className="min-w-[48px] py-[8px] rounded-[16px] gap-[7px] flex flex-col bg-[#8EDEFC]">
          <div className="flex flex-col items-center justify-center mt-[3px]">
            <div className="text-[#0B1215] text-[14px] text-center leading-[14px]">
              15
            </div>
            <div className="text-[#0B1215] text-[14px] text-center leading-[14px]">
              Thu
            </div>
          </div>
          <Image
            src="/landing/blue-sad.svg"
            width={32}
            height={32}
            className="max-w-[32px] min-w-[32px] max-h-[32px] min-h-[32px] mx-auto"
            alt="blue-sad"
          />
        </div>
        <div className="min-w-[48px] py-[8px] rounded-[16px] gap-[7px] flex flex-col bg-[#07518B] border border-white border-solid">
          <div className="flex flex-col items-center justify-center mt-[3px]">
            <div className="text-white text-[14px] text-center leading-[14px]">
              16
            </div>
            <div className="text-white text-[14px] text-center leading-[14px]">
              Fri
            </div>
          </div>
          <Image
            src="/landing/white-happy.svg"
            width={32}
            height={32}
            className="max-w-[32px] min-w-[32px] max-h-[32px] min-h-[32px] mx-auto"
            alt="white-happy"
          />
        </div>
        <div className="min-w-[48px] py-[8px] rounded-[16px] gap-[7px] flex flex-col bg-[#07518B] border border-white border-solid">
          <div className="flex flex-col items-center justify-center mt-[3px]">
            <div className="text-white text-[14px] text-center leading-[14px]">
              17
            </div>
            <div className="text-white text-[14px] text-center leading-[14px]">
              Sat
            </div>
          </div>
          <Image
            src="/landing/white-happy.svg"
            width={32}
            height={32}
            className="max-w-[32px] min-w-[32px] max-h-[32px] min-h-[32px] mx-auto"
            alt="white-happy"
          />
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
