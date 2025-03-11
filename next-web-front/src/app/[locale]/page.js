"use client";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/landing/header/header";
import TextCard from "@/components/landing/hero-card/text-card";
import PhoneCard from "@/components/landing/hero-card/phone-card";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="landing-page-container w-[100dvw] h-full">
        <Header />
        <TextCard />
        <PhoneCard />
        <div className="w-full max-w-[1440px] mx-auto p-[40px] rounded-[24px] bg-[rgba(0,0,0,0.10)] backdrop-blur-[150px]">
          <div className="w-full rounded-[32px] relative overflow-hidden px-[40px] py-[24px] flex flex-col">
            <div className="absolute w-[2200px] h-[2200px] rounded-full bg-[rgba(135,199,248,0.35)] blur-[250px] -top-[2100px] left-[100px]"></div>
            <div className="absolute w-[919px] h-[919px] rounded-full bg-[rgba(135,199,248,0.35)] blur-[200px] -top-[466px] -left-[366px]"></div>
            <div className="flex flex-row w-full justify-between relative">
              <div className="flex flex-col">
                <p className="capitalize text-[64px] font-bold leading-[79px] text-white">
                  start a conversation <br /> with our{" "}
                  <span className="text-[#5DB9FF]">Nexabot</span>
                  <br /> Now!
                </p>
                <div className="flex flex-col mt-[46px]">
                  <div className="flex flex-row mb-[16px]">
                    <div className="min-w-[150px] rounded-[48px] !border-[0.3px] border-solid border-white bg-[rgba(49,101,142,0.30)] backdrop-blur-[2px] py-[12px] px-[12px] flex flex-row gap-[8px] items-center mr-[16px]">
                      <Image
                        src="/landing/close-line.svg"
                        width={24}
                        height={24}
                        className="min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]"
                        alt="plus"
                      />
                      <div className="text-white text-[20px] font-light mr-[12px]">
                        Talk Nexa
                      </div>
                    </div>
                    <div className="min-w-[150px] rounded-[48px] !border-[0.3px] border-solid border-white bg-[rgba(49,101,142,0.30)] backdrop-blur-[2px] py-[12px] px-[12px] flex flex-row gap-[8px] items-center">
                      <Image
                        src="/landing/close-line.svg"
                        width={24}
                        height={24}
                        className="min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]"
                        alt="plus"
                      />
                      <div className="text-white text-[20px] font-light mr-[12px]">
                        Voice Nexa
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row ml-[58px]">
                    <div className="min-w-[213px] rounded-[48px] !border-[0.3px] border-solid border-white bg-[rgba(49,101,142,0.30)] backdrop-blur-[2px] py-[12px] px-[12px] flex flex-row gap-[8px] items-center mr-[16px]">
                      <Image
                        src="/landing/close-line.svg"
                        width={24}
                        height={24}
                        className="min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]"
                        alt="plus"
                      />
                      <div className="text-white text-[20px] font-light mr-[12px]">
                        Get Suggestions
                      </div>
                    </div>
                    <div className="min-w-[150px] rounded-[48px] !border-[0.3px] border-solid border-white bg-[rgba(49,101,142,0.30)] backdrop-blur-[2px] py-[12px] px-[12px] flex flex-row gap-[8px] items-center">
                      <Image
                        src="/landing/close-line.svg"
                        width={24}
                        height={24}
                        className="min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]"
                        alt="plus"
                      />
                      <div className="text-white text-[20px] font-light mr-[12px]">
                        Be Friend
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col relative">
                <Image
                  src="/landing/vector-chatbot.svg"
                  width={185}
                  height={100}
                  className="absolute top-[120px] left-[-140px] max-w-[185px] max-h-[100px] min-w-[185px] min-h-[100px] rotate-[85deg]"
                  alt="vector-chatbot"
                />
                <div className="px-[30px] py-[12px] bg-[#053A64] w-[310px] flex flex-row items-center gap-[12px] rounded-[24px] ml-[10px]">
                  <div className="w-[68px] h-[68px] rounded-full bg-[#0A6EBD] flex items-center justify-center">
                    <Image
                      src="/landing/mini-logo.svg"
                      width={50}
                      height={50}
                      alt="mini-logo"
                      className="max-w-[50px] max-h-[50px] min-w-[50px] min-h-[50px]"
                    />
                  </div>
                  <p className="w-[178px] text-white text-[12px]">
                    <span className="font-bold">Welcome to Nexabot!</span> How
                    are you! I am Nexabot, your personal friend. Have a specific
                    question to ask me?
                  </p>
                </div>
                <div className="px-[30px] py-[12px] bg-[#053A64] w-[310px] flex flex-row items-center gap-[12px] rounded-[24px] mt-[23px] mb-[47px] ml-[120px]">
                  <Image
                    src="/landing/chenese.jpeg"
                    width={68}
                    height={68}
                    alt="mini-logo"
                    className="max-w-[68px] max-h-[68px] min-w-[68px] min-h-[68px] rounded-full"
                  />
                  <p className="w-[178px] text-white text-[12px]">
                    I'm feeling a bit confused today and could use some help
                    figuring things out.
                  </p>
                </div>
                <div className="px-[30px] pt-[15px] pb-[9px] bg-[#053A64] w-[310px] flex flex-row gap-[12px] rounded-[24px] h-[123px] justify-between">
                  <div className="flex flex-col justify-between">
                    <div className="text-white text-[14px] font-medium">
                      Write your message....
                    </div>
                    <div className="flex flex-row gap-[24px] items-center mb-[15px]">
                      <Image
                        src="/landing/image.svg"
                        width={24}
                        height={24}
                        alt="image"
                        className="max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]"
                      />
                      <Image
                        src="/landing/voice.svg"
                        width={24}
                        height={24}
                        alt="voice"
                        className="max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[#E0F1FE] mt-auto">
                    <Image
                      src="/landing/send.svg"
                      width={24}
                      height={24}
                      alt="send"
                      className="max-w-[24px] max-h-[24px] min-w-[24px] min-h-[24px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
