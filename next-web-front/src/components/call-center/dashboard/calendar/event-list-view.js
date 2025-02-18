"use client";
import React from "react";
import Image from "next/image";
import TodayItem from "./today-item";

export default function EventListView({ events, date, onClose, formatDate }) {
  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {formatDate(new Date(date))}
        </div>
        <div
          onClick={onClose}
          className="flex items-center justify-center max-w-[36px] max-h-[36px] w-[36px] h-[36px] rounded-full bg-icon_bg_new_kit-100 cursor-pointer ml-auto"
        >
          <Image
            src="/call-center/clarity_close-line.svg"
            alt="close"
            width={18}
            height={18}
          />
        </div>
      </div>

      <div className="flex flex-col w-full space-y-2 overflow-y-auto events-container">
        {events.map((event) => (
          <TodayItem
            key={event.id}
            image={event.image}
            title={event.title}
            time={event.time}
            id={event.id}
          />
        ))}
      </div>
    </>
  );
}
