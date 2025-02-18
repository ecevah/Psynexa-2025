"use client";
import ClientReviewHeader from "@/components/call-center/dashboard/home/client-review-header";
import PatientTable from "@/components/call-center/dashboard/home/patient-table";
import ItemCard from "@/components/call-center/dashboard/item-card";
import ScheduleCalendar from "@/components/call-center/dashboard/calendar/schedule-calendar";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import React from "react";

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
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 min-[1080px]:grid-cols-3 min-[1380px]:grid-cols-4 gap-4 mb-[20px]">
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
      <div className="w-full h-full min-[1024px]:flex flex-col lg:flex-row pb-[24px] space-y-4 min-[1024px]:space-y-0 min-[1024px]:pb-[24px]">
        <div className="w-full h-[500px] lg:h-full rounded-[20px] py-[20px] px-[12px] bg-white flex flex-col">
          <ClientReviewHeader />
          <div className="max-h-full h-full w-full overflow-hidden">
            <PatientTable />
          </div>
        </div>
        <ScheduleCalendar
          taskDates={taskDates}
          events={events}
          todayEvents={todayEvents}
          onEventCreate={handleEventCreate}
        />
      </div>
    </>
  );
}
