"use client";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Header from "@/components/landing/header/header";
import TextCard from "@/components/landing/hero-card/text-card";
import PhoneCard from "@/components/landing/hero-card/phone-card";
import Chatbot from "@/components/landing/chatbot/chatbot";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="landing-page-container w-[100dvw] h-full">
        <Header />
        <TextCard />
        <PhoneCard />
        <Chatbot />
      </div>
    </>
  );
}
