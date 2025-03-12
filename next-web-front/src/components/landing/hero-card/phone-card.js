import Image from "next/image";
import React from "react";
import MeditationCard from "./meditation-card";
import NexabotMiniLogoCard from "./nexabot-mini-logo-card";
import MoodTracker from "./mood-tracker";
import ExhaleCard from "./exhale-card";

const PhoneCard = () => {
  return (
    <>
      <div className="w-full h-[770px] flex items-end justify-center overflow-hidden relative z-20">
        <div className="w-[411px] h-[624px] relative ml-[6px]">
          <div className="w-[411px] h-[624px] relative overflow-hidden">
            <Image
              src="/landing/mockup-home.png"
              width={411}
              height={810}
              alt="mockup"
              className="absolute"
            />
          </div>
          <div className="min-[1100px]:flex hidden flex-col absolute bottom-[100px] -right-[320px]">
            <div className="ml-[25px] mb-[30px]">
              <MeditationCard />
            </div>
            <Image
              src="/landing/bot-right.svg"
              width={80}
              height={130}
              alt="bot-right"
              className="rotate-[-4deg]"
            />
          </div>
          <div className="min-[1100px]:flex hidden flex-row items-end justify-center absolute -top-[50px] min-[1400px]:-right-[500px] -right-[350px]">
            <Image
              src="/landing/top-right.svg"
              width={170}
              height={100}
              alt="top-right"
              className="rotate-[4deg] mr-[20px] -mb-[20px] min-[1400px]:block hidden"
            />
            <NexabotMiniLogoCard />
          </div>
          <div className="min-[1100px]:flex hidden flex-col w-fit absolute bottom-[50px] min-[1400px]:-left-[480px] -left-[350px]">
            <div className="pr-[140px] mb-[20px]">
              <MoodTracker />
            </div>
            <Image
              src="/landing/bot-left.svg"
              width={200}
              height={120}
              alt="bot-left"
              className="ml-auto rotate-[5px] min-[1400px]:block hidden"
            />
          </div>
          <div className="min-[1100px]:flex hidden flex-row absolute -top-[50px] min-[1400px]:-left-[440px] -left-[350px]">
            <ExhaleCard />
            <Image
              src="/landing/top-left.svg"
              width={100}
              height={100}
              alt="top-left"
              className="ml-[20px] mt-[20px] -rotate-[30deg] min-[1400px]:block hidden"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoneCard;
