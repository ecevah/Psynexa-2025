"use client";
import React from "react";
import Calendar from "react-calendar";
import { useLocale } from "next-intl";
import "react-calendar/dist/Calendar.css";

export default function CustomCalendar({
  date,
  onDateChange,
  taskDates,
  onTaskDateClick,
  onEmptyDateClick,
}) {
  const locale = useLocale();

  const handleDateClick = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    if (taskDates.includes(formattedDate)) {
      onTaskDateClick?.(selectedDate, formattedDate);
    } else {
      onEmptyDateClick?.(selectedDate, formattedDate);
      onDateChange?.(selectedDate);
    }
  };

  return (
    <Calendar
      className="border-none w-full mx-auto"
      value={date}
      onChange={handleDateClick}
      showNavigation={false}
      locale={locale}
      tileClassName={({ date }) => {
        const formattedDate = date.toISOString().split("T")[0];
        const hasTask = taskDates.includes(formattedDate);
        return hasTask
          ? "!bg-[#0A6EBD] !text-white rounded-full hover:!bg-[#0A6EBD]"
          : "";
      }}
    />
  );
}
