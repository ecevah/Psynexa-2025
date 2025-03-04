"use client";
import React from "react";
import CustomCalendar from "./calendar";
import { useTranslations, useLocale } from "next-intl";
import TodayItem from "./today-item";
import EventListView from "./event-list-view";
import CreateEventForm from "./create-event-form";
import CalendarHeader from "./calendar-header";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCalendar,
  selectEvents,
  selectTodayEvents,
  setCalendarDate,
  setShowMonthSelector,
  setIsCreatingEvent,
  setViewingDate,
  setEventFormData,
  addEvent,
} from "@/store/features/dashboardSlice";

export default function ScheduleCalendar({
  taskDates,
  events,
  todayEvents,
  onEventCreate,
}) {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const dispatch = useDispatch();

  const calendar = useSelector(selectCalendar);
  const reduxEvents = useSelector(selectEvents);
  const reduxTodayEvents = useSelector(selectTodayEvents);

  // Convert ISO string to Date object
  const selectedDate = calendar.selectedDate
    ? new Date(calendar.selectedDate)
    : new Date();

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
    const d = new Date(selectedDate);
    d.setMonth(i);
    return {
      label: d.toLocaleDateString(locale, { month: "short" }),
      value: i,
    };
  });

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    dispatch(setCalendarDate(newDate));
    dispatch(setShowMonthSelector(false));
  };

  const handleEmptyDateClick = (date) => {
    const isoDate = date.toISOString();
    dispatch(setCalendarDate(isoDate));
    dispatch(setIsCreatingEvent(true));
    dispatch(setViewingDate(null));
  };

  const handleTaskDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    dispatch(setViewingDate(formattedDate));
    dispatch(setIsCreatingEvent(false));
  };

  const handleSaveEvent = () => {
    const { title, description, time, startTime, endTime } = calendar.eventForm;
    if (title && time) {
      dispatch(
        addEvent({
          date: selectedDate.toISOString().split("T")[0],
          event: {
            id: Date.now().toString(),
            title,
            description,
            time: `${startTime} - ${endTime}`,
            image: "/call-center/user-image.jpeg",
          },
        })
      );
    }
    dispatch(setIsCreatingEvent(false));
    dispatch(
      setEventFormData({
        title: "",
        description: "",
        time: "",
        startTime: "",
        endTime: "",
      })
    );
  };

  if (calendar.viewingDate) {
    return (
      <div className="h-full w-full bg-white rounded-[20px] p-[20px] flex flex-col">
        <EventListView
          events={reduxEvents[calendar.viewingDate] || []}
          date={calendar.viewingDate}
          onClose={() => dispatch(setViewingDate(null))}
          formatDate={formatDate}
        />
      </div>
    );
  }

  if (calendar.isCreatingEvent && selectedDate) {
    return (
      <div className="h-full w-full bg-white rounded-[20px] p-[20px] flex flex-col">
        <CreateEventForm
          selectedDate={selectedDate}
          formatDate={formatDate}
          onCancel={() => dispatch(setIsCreatingEvent(false))}
          onSave={handleSaveEvent}
          eventTitle={calendar.eventForm.title}
          setEventTitle={(title) =>
            dispatch(setEventFormData({ ...calendar.eventForm, title }))
          }
          eventDescription={calendar.eventForm.description}
          setEventDescription={(description) =>
            dispatch(setEventFormData({ ...calendar.eventForm, description }))
          }
          eventTime={calendar.eventForm.time}
          setEventTime={(time) =>
            dispatch(setEventFormData({ ...calendar.eventForm, time }))
          }
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white rounded-[20px] p-[20px] flex flex-col overflow-y-scroll events-container ">
      <CalendarHeader
        date={selectedDate}
        showMonthSelector={calendar.showMonthSelector}
        setShowMonthSelector={(show) => dispatch(setShowMonthSelector(show))}
        months={months}
        handleMonthSelect={handleMonthSelect}
        formatMonthYear={formatMonthYear}
      />
      <CustomCalendar
        date={selectedDate}
        onDateChange={(date) => dispatch(setCalendarDate(date.toISOString()))}
        taskDates={taskDates}
        onTaskDateClick={handleTaskDateClick}
        onEmptyDateClick={handleEmptyDateClick}
      />
      <div className="text-black font-semibold text-[20px] leading-[40px] mt-[10px]">
        {t("todayTasks")}
      </div>
      <div className="flex-1 flex flex-col w-full overflow-y-auto min-h-[72px] overflow-x-visible events-container ">
        {reduxTodayEvents.map((event) => (
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
