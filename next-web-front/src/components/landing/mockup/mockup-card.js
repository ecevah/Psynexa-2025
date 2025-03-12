import React from "react";
import NexabotMiniLogo from "./nexabot-mini-logo";
import Image from "next/image";
import MeditationBlog from "./meditation-blog";
import VoiceText from "./voice-text";
import Video from "./video";
import NexabotCard from "./nexabot-card";
import MobileStarCard from "./mobile-star-card";
import MobileVideo from "./mobile-video";
const MockupCard = () => {
  return (
    <>
      <div className="hidden min-[1000px]:block relative w-[650px] h-[780px] mx-auto min-[1455px]:mt-[162px] min-[1455px]:mb-[200px] min-[1200px]:mt-[100px] min-[1200px]:mb-[50px] mt-0 mb-0 max-[1455px]:scale-[0.8] max-[1200px]:scale-[0.6] max-[1000px]:scale-[0.4]">
        <Image
          src="/landing/left-mockup.png"
          width={406}
          height={570}
          className="min-w-[406px] min-h-[570px] max-w-[406px] max-h-[570px] rotate-[5deg] absolute top-0 left-0 z-50"
          alt="left-mockup"
        />
        <Image
          src="/landing/right-mockup.png"
          width={406}
          height={570}
          className="min-w-[406px] min-h-[570px] max-w-[406px] max-h-[570px] -rotate-[5deg] absolute bottom-0 right-0 z-40"
          alt="right-mockup"
        />
        <NexabotMiniLogo />
        <MeditationBlog />
        <Video />
        <VoiceText />
        <NexabotCard />
      </div>
      <div className="flex flex-col min-[1000px]:hidden relative z-10 items-center">
        <div className="relative w-[320px] h-[330px] mt-[50px]">
          <Image
            src="/landing/left-mockup.png"
            width={190}
            height={250}
            className="min-w-[190px] min-h-[250px] max-w-[190px] max-h-[250px] rotate-[5deg] absolute top-0 left-0 z-50"
            alt="left-mockup"
          />
          <Image
            src="/landing/right-mockup.png"
            width={190}
            height={250}
            className="min-w-[190px] min-h-[250px] max-w-[190px] max-h-[250px] -rotate-[5deg] absolute bottom-0 right-0 z-40"
            alt="right-mockup"
          />
          <div className="scale-[0.7] translate-x-[90px] translate-y-[-50px]">
            <NexabotMiniLogo />
          </div>
        </div>
        <div className="mx-[25px] grid min-[740px]:grid-cols-2 grid-cols-1 gap-[25px] mt-[50px]">
          <MobileStarCard
            title="Nexabot"
            description="Nexabot analyzes your emotions, offers empathetic support, and provides personalized suggestions to help you navigate your day."
          />
          <MobileStarCard
            title="Meditation and Audio Blog Listening"
            description="Immerse yourself in personalized meditation sessions and inspiring audio blogs to calm your mind and uplift your spirit."
          />
          <div className="min-[740px]:col-span-2 min-[740px]:flex min-[740px]:justify-center">
            <div className="min-[740px]:w-[calc(50%-12.5px)]">
              <MobileStarCard
                title="Voice and Text Interaction with Nexabot"
                description="Communicate with Nexabot via voice or text to receive tailored recommendations and insights designed just for you."
              />
            </div>
          </div>
        </div>
        <MobileVideo />
      </div>
    </>
  );
};

export default MockupCard;
