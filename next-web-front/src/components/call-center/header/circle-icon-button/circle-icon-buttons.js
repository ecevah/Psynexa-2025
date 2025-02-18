"use client";
import React from "react";
import HeaderCircleIconButton from "./header-circle-icon-button";
import { useTranslations } from "next-intl";

const CircleIconButtons = () => {
  const t = useTranslations("DashboardPage");
  const buttons = [
    {
      icon: "/call-center/search.svg",
      text: t.raw("header.search"),
      func: () => {
        alert("Search");
      },
    },
    {
      icon: "/call-center/Chat.svg",
      text: t.raw("header.message"),
      func: () => {
        alert("Message");
      },
    },
    {
      icon: "/call-center/notification.svg",
      text: t.raw("header.notification"),
      func: () => {
        alert("Notification");
      },
    },
  ];
  return (
    <>
      <div className="flex flex-row gap-4">
        {buttons.map((button) => (
          <HeaderCircleIconButton key={button.text} {...button} />
        ))}
      </div>
    </>
  );
};

export default CircleIconButtons;
