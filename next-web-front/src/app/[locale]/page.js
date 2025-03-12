"use client";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/landing/header/header";
import TextCard from "@/components/landing/hero-card/text-card";
import PhoneCard from "@/components/landing/hero-card/phone-card";
import Chatbot from "@/components/landing/chatbot/chatbot";
import MockupCard from "@/components/landing/mockup/mockup-card";
import NexabotCard from "@/components/landing/mockup/nexabot-card";
import Triple from "@/components/landing/triple/triple";
import GridCard from "@/components/landing/why-psynexa/grid-card";
import Faq from "@/components/landing/faq/faq";
import DownloadCard from "@/components/landing/download/download-card";
import MailCard from "@/components/landing/footer/mail-card";
import FooterCard from "@/components/landing/footer/footer-card";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="landing-page-container w-[100dvw] h-full overflow-x-hidden">
        <Header />
        <TextCard
          circle={t("your_personal_friend.circle")}
          title={t("your_personal_friend.title")}
          description={t("your_personal_friend.description")}
          isHero={true}
        />
        <PhoneCard />
        <Chatbot />
        <div className="relative z-0">
          <div className="absolute w-[2500px] h-[1500px] rounded-full bg-[rgba(130,197,247,0.20)] blur-[150px] rotate-45 -top-[1200px] -left-[300px] z-10"></div>
          <TextCard
            circle={t("personal_mental_companion.circle")}
            title={t("personal_mental_companion.title")}
            description={t("personal_mental_companion.description")}
          />
        </div>
        <MockupCard />
        <Triple />
        <div className="relative">
          <div className="absolute w-[667px] h-[667px] rounded-full bg-[rgba(135,199,248,0.25)] blur-[200px] -bottom-[450px] -right-[450px]"></div>
        </div>
        <TextCard
          circle={t("enjoy_psynexa.circle")}
          title={t("enjoy_psynexa.title")}
          description={t("enjoy_psynexa.description")}
        />
        <GridCard />
        <TextCard
          circle={t("instant_answers.circle")}
          title={t("instant_answers.title")}
          description={t("instant_answers.description")}
        />
        <div className="relative">
          <div className="absolute w-[667px] h-[667px] rounded-full bg-[rgba(135,199,248,0.25)] blur-[200px] -bottom-[450px] -left-[450px]"></div>
        </div>
        <Faq />
        <DownloadCard />
        <MailCard />
        <FooterCard />
        <div className="absolute w-[1890px] h-[1890px] rounded-full bg-[rgba(135,199,248,0.25)] blur-[200px] -bottom-[450px] -right-[450px]"></div>
      </div>
    </>
  );
}
