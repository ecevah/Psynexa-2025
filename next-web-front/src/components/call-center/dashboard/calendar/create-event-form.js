"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CreateEventForm({
  selectedDate,
  formatDate,
  onCancel,
  onSave,
  eventTitle,
  setEventTitle,
  eventDescription,
  setEventDescription,
  eventTime,
  setEventTime,
}) {
  const t = useTranslations("Calendar");

  // Yeni: Zaman seçici durumları
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");

  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = React.useRef(null);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#0B1215] text-lg font-medium">
          {t("createEvent.title")}
        </h2>
        <div
          onClick={onCancel}
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
      <div className="text-sm text-gray-600 mb-4">
        {formatDate(selectedDate)}
      </div>
      <div className="space-y-4 overflow-y-auto">
        <div>
          <input
            type="text"
            placeholder={t("createEvent.eventTitle")}
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="w-full p-2 rounded-lg focus:outline-none focus:ring-none"
          />
        </div>
        <div>
          {!showTimePicker ? (
            <button
              type="button"
              onClick={() => setShowTimePicker(true)}
              className="w-full flex flex-row items-center justify-center py-[4px] border border-gray-300 rounded-full focus:outline-none"
            >
              <Image
                src="/call-center/time-circle.svg"
                alt="time icon"
                width={20}
                height={20}
              />
              <span className="text-[#B0B0B0] text-[16px] font-medium leading-[32px] ml-[8px]">
                {t("createEvent.selectTime")}
              </span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  const newStart = e.target.value;
                  if (endTime) {
                    setEventTime(`${newStart} - ${endTime}`);
                  } else {
                    setEventTime(newStart);
                  }
                }}
                className="w-1/2 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-none"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  const newEnd = e.target.value;
                  if (startTime) {
                    setEventTime(`${startTime} - ${newEnd}`);
                  } else {
                    setEventTime(newEnd);
                  }
                }}
                className="w-1/2 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-none"
              />
            </div>
          )}
        </div>
        <div>
          <div className="relative">
            {!eventDescription && !isFocused && (
              <div
                onClick={() => textareaRef.current?.focus()}
                className="absolute top-2 flex items-center px-3 text-gray-400 cursor-text"
              >
                <Image
                  src="/call-center/edit.svg"
                  alt="edit icon"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                <span>Add note</span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={eventDescription}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setEventDescription(e.target.value)}
              className="w-full h-[200px] max-h-[200px] p-2 rounded-lg focus:outline-none focus:ring-none resize-none"
            />
          </div>
        </div>

        <button
          onClick={onSave}
          className="w-full py-[16px] px-[24px] bg-science_blue-600 rounded-full text-white text-[17px] font-medium"
        >
          {t("createEvent.save")}
        </button>
      </div>
    </>
  );
}
