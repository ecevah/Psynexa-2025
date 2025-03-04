"use client";
import ClientReviewHeader from "@/components/call-center/dashboard/home/client-review-header";
import PatientTable from "@/components/call-center/dashboard/home/patient-table";
import ItemCard from "@/components/call-center/dashboard/item-card";
import ScheduleCalendar from "@/components/call-center/dashboard/calendar/schedule-calendar";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
import Breadcrumb from "@/components/call-center/breadcrumb/breadcrumb";
import {
  selectCardTypes,
  selectEvents,
  selectTodayEvents,
  addEvent,
} from "@/store/features/dashboardSlice";

const CARD_ICONS = {
  totalUsers: "/call-center/3-user.svg",
  activeClients: "/call-center/notification.svg",
  monitoredUsers: "/call-center/notification.svg",
  totalPatients: "/call-center/notification.svg",
};

const CARD_TYPES = [
  "totalUsers",
  "activeClients",
  "monitoredUsers",
  "totalPatients",
];

// Örnek etkinlik verileri - Gerçek uygulamada API'den gelecek
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
  ],
  "2025-02-20": [
    {
      id: "5",
      title: "Grup Terapisi",
      time: "10:00 AM - 11:30 AM",
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
  ],
};

// Bugünün etkinlikleri - Gerçek uygulamada API'den gelecek
const TODAY_EVENTS = [
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
];

export default function DashboardPage() {
  const t = useTranslations("DashboardPage");
  const { cardTypes } = useSelector((state) => state.dashboard);
  const [events, setEvents] = React.useState(SAMPLE_EVENTS);
  const [todayEvents, setTodayEvents] = React.useState(TODAY_EVENTS);

  const taskDates = React.useMemo(() => Object.keys(events), [events]);

  const handleEventCreate = (newEvent) => {
    console.log("Yeni etkinlik:", newEvent);
  };

  return (
    <>
      <div className="mt-[20px] mb-[16px]">
        <Breadcrumb />
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 min-[1080px]:grid-cols-3 min-[1380px]:grid-cols-4 gap-4 mb-4">
        {CARD_TYPES.map((cardType) =>
          cardTypes[cardType].items.map((item, index) => (
            <ItemCard
              key={`${cardType}-${index}`}
              title={t(`statistics.${cardType}`)}
              icon={CARD_ICONS[cardType]}
              value={item.value}
              direction={item.direction}
              percent={item.percent}
            />
          ))
        )}
      </div>
      <div className="w-full lg:max-h-[560px] min-[1380px]:max-h-full lg:h-[calc(100vh-404px)] flex flex-col min-[1024px]:flex-row gap-6">
        <div className="flex-1 h-full bg-white rounded-[20px] flex flex-col overflow-hidden">
          <div className="px-[12px] pt-[20px] pb-[20px]">
            <ClientReviewHeader />
          </div>
          <div className="flex-1 min-h-0">
            <PatientTable />
          </div>
        </div>
        <div className="h-fit min-[1024px]:h-full min-[1024px]:w-[364px]">
          <ScheduleCalendar
            taskDates={taskDates}
            events={events}
            todayEvents={todayEvents}
            onEventCreate={handleEventCreate}
          />
        </div>
      </div>
    </>
  );
}
