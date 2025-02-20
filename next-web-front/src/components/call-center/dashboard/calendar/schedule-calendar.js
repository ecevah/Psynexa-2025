"use client";
import React from "react";
import CustomCalendar from "./calendar";
import { useTranslations, useLocale } from "next-intl";
import TodayItem from "./today-item";
import EventListView from "./event-list-view";
import CreateEventForm from "./create-event-form";
import CalendarHeader from "./calendar-header";

// Örnek etkinlik verileri
const SAMPLE_EVENTS = {
  "2025-02-15": [
    {
      id: "1",
      title: "Terapi Seansı - John Doe",
      time: "09:00 AM - 10:30 AM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "2",
      title: "Psikolojik Danışmanlık - Sarah Smith",
      time: "11:00 AM - 12:30 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "3",
      title: "Aile Terapisi - Johnson Ailesi",
      time: "02:00 PM - 03:30 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "4",
      title: "Bireysel Seans - Mike Wilson",
      time: "04:00 PM - 05:00 PM",
      image: "/call-center/user-image.jpeg",
    },
  ],
  "2025-02-20": [
    {
      id: "5",
      title: "Grup Terapisi",
      time: "10:00 AM - 11:30 AM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "6",
      title: "Danışmanlık Seansı - Emma Brown",
      time: "02:00 PM - 03:00 PM",
      image: "/call-center/user-image.jpeg",
    },
  ],
  "2025-02-25": [
    {
      id: "7",
      title: "Çift Terapisi - Taylor Çifti",
      time: "11:00 AM - 12:30 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "8",
      title: "Stres Yönetimi Seansı - Lisa Clark",
      time: "03:00 PM - 04:00 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "9",
      title: "Bireysel Danışmanlık - Tom Harris",
      time: "05:00 PM - 06:00 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "7",
      title: "Çift Terapisi - Taylor Çifti",
      time: "11:00 AM - 12:30 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "8",
      title: "Stres Yönetimi Seansı - Lisa Clark",
      time: "03:00 PM - 04:00 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "9",
      title: "Bireysel Danışmanlık - Tom Harris",
      time: "05:00 PM - 06:00 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "7",
      title: "Çift Terapisi - Taylor Çifti",
      time: "11:00 AM - 12:30 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "8",
      title: "Stres Yönetimi Seansı - Lisa Clark",
      time: "03:00 PM - 04:00 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "9",
      title: "Bireysel Danışmanlık - Tom Harris",
      time: "05:00 PM - 06:00 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "7",
      title: "Çift Terapisi - Taylor Çifti",
      time: "11:00 AM - 12:30 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "8",
      title: "Stres Yönetimi Seansı - Lisa Clark",
      time: "03:00 PM - 04:00 PM",
      image: "/call-center/user-image.jpeg",
    },
    {
      id: "9",
      title: "Bireysel Danışmanlık - Tom Harris",
      time: "05:00 PM - 06:00 PM",
      image: "/call-center/user-image.jpeg",
    },
  ],
};

export default function ScheduleCalendar({
  taskDates,
  events,
  todayEvents,
  onEventCreate,
}) {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const [date, setDate] = React.useState(new Date());
  const [showMonthSelector, setShowMonthSelector] = React.useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventDescription, setEventDescription] = React.useState("");
  const [eventTime, setEventTime] = React.useState("");
  const [viewingDate, setViewingDate] = React.useState(null);

  const formatMonthYear = (date) => {
    return date.toLocaleDateString(locale, {
      month: "short",
      year: "numeric",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(date);
    d.setMonth(i);
    return {
      label: d.toLocaleDateString(locale, { month: "short" }),
      value: i,
    };
  });

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(date);
    newDate.setMonth(monthIndex);
    setDate(newDate);
    setShowMonthSelector(false);
  };

  const handleEmptyDateClick = (selectedDate) => {
    setSelectedDate(selectedDate);
    setIsCreatingEvent(true);
    setViewingDate(null);
  };

  const handleTaskDateClick = (selectedDate) => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    setViewingDate(formattedDate);
    setIsCreatingEvent(false);
  };

  const handleSaveEvent = () => {
    if (onEventCreate) {
      onEventCreate({
        date: selectedDate,
        title: eventTitle,
        description: eventDescription,
        time: eventTime,
      });
    }
    setIsCreatingEvent(false);
    setEventTitle("");
    setEventDescription("");
    setEventTime("");
    setSelectedDate(null);
  };

  if (viewingDate) {
    return (
      <div className="h-full w-full bg-white rounded-[20px] p-[20px] flex flex-col">
        <EventListView
          events={events[viewingDate] || []}
          date={viewingDate}
          onClose={() => setViewingDate(null)}
          formatDate={formatDate}
        />
      </div>
    );
  }

  if (isCreatingEvent && selectedDate) {
    return (
      <div className="h-full w-full bg-white rounded-[20px] p-[20px] flex flex-col">
        <CreateEventForm
          selectedDate={selectedDate}
          formatDate={formatDate}
          onCancel={() => setIsCreatingEvent(false)}
          onSave={handleSaveEvent}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          eventDescription={eventDescription}
          setEventDescription={setEventDescription}
          eventTime={eventTime}
          setEventTime={setEventTime}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white rounded-[20px] p-[20px] flex flex-col overflow-y-scroll events-container ">
      <CalendarHeader
        date={date}
        showMonthSelector={showMonthSelector}
        setShowMonthSelector={setShowMonthSelector}
        months={months}
        handleMonthSelect={handleMonthSelect}
        formatMonthYear={formatMonthYear}
      />
      <CustomCalendar
        date={date}
        onDateChange={setDate}
        taskDates={taskDates}
        onTaskDateClick={handleTaskDateClick}
        onEmptyDateClick={handleEmptyDateClick}
      />
      <div className="text-black font-semibold text-[20px] leading-[40px] mt-[10px]">
        {t("todayTasks")}
      </div>
      <div className="flex-1 flex flex-col w-full overflow-y-auto min-h-[72px] overflow-x-visible events-container ">
        {todayEvents.map((event) => (
          <TodayItem
            key={event.id}
            image={event.image}
            title={event.title}
            time={event.time}
            id={event.id}
          />
        ))}
      </div>
    </div>
  );
}
