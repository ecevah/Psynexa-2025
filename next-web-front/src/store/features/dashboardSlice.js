import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cardTypes: {
    totalUsers: {
      items: [
        {
          value: "2,543",
          direction: "up",
          percent: "12.5%",
        },
      ],
    },
    activeClients: {
      items: [
        {
          value: "1,234",
          direction: "down",
          percent: "8.3%",
        },
      ],
    },
    monitoredUsers: {
      items: [
        {
          value: "3,756",
          direction: "up",
          percent: "15.2%",
        },
      ],
    },
    totalPatients: {
      items: [
        {
          value: "5,432",
          direction: "up",
          percent: "10.8%",
        },
      ],
    },
  },
  patients: [
    {
      id: 1,
      image: "/call-center/user-image.jpeg",
      name: "John Doe",
      age: 32,
      recentVisit: "12 Oct 2024",
      streak: "5 days",
      status: "Critical",
    },
    {
      id: 2,
      image: "/call-center/user-image.jpeg",
      name: "Jane Smith",
      age: 28,
      recentVisit: "11 Oct 2024",
      streak: "10 days",
      status: "Stable",
    },
    ...Array(10)
      .fill()
      .map((_, index) => ({
        id: index + 3,
        image: "/call-center/user-image.jpeg",
        name: `Patient ${index + 3}`,
        age: 25 + index,
        recentVisit: "10 Oct 2024",
        streak: `${3 + index} days`,
        status: index % 2 === 0 ? "Critical" : "Stable",
      })),
  ],
  calendar: {
    selectedDate: new Date().toISOString(),
    showMonthSelector: false,
    isCreatingEvent: false,
    viewingDate: null,
    eventForm: {
      title: "",
      description: "",
      time: "",
      startTime: "",
      endTime: "",
    },
  },
  events: {
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
  },
  todayEvents: [
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
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setCardData: (state, action) => {
      state.cardTypes = action.payload;
    },
    setPatients: (state, action) => {
      state.patients = action.payload;
    },
    setCalendarDate: (state, action) => {
      state.calendar.selectedDate =
        action.payload instanceof Date
          ? action.payload.toISOString()
          : action.payload;
    },
    setShowMonthSelector: (state, action) => {
      state.calendar.showMonthSelector = action.payload;
    },
    setIsCreatingEvent: (state, action) => {
      state.calendar.isCreatingEvent = action.payload;
    },
    setViewingDate: (state, action) => {
      state.calendar.viewingDate = action.payload;
    },
    setEventFormData: (state, action) => {
      state.calendar.eventForm = {
        ...state.calendar.eventForm,
        ...action.payload,
      };
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setTodayEvents: (state, action) => {
      state.todayEvents = action.payload;
    },
    addEvent: (state, action) => {
      const { date, event } = action.payload;
      if (!state.events[date]) {
        state.events[date] = [];
      }
      state.events[date].push(event);
    },
    updateEvent: (state, action) => {
      const { date, event } = action.payload;
      if (state.events[date]) {
        const index = state.events[date].findIndex((e) => e.id === event.id);
        if (index !== -1) {
          state.events[date][index] = event;
        }
      }
    },
    deleteEvent: (state, action) => {
      const { date, eventId } = action.payload;
      if (state.events[date]) {
        state.events[date] = state.events[date].filter((e) => e.id !== eventId);
      }
    },
  },
});

export const {
  setCardData,
  setPatients,
  setCalendarDate,
  setShowMonthSelector,
  setIsCreatingEvent,
  setViewingDate,
  setEventFormData,
  setEvents,
  setTodayEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = dashboardSlice.actions;

export const selectCardTypes = (state) => state.dashboard.cardTypes;
export const selectPatients = (state) => state.dashboard.patients;
export const selectCalendar = (state) => state.dashboard.calendar;
export const selectEvents = (state) => state.dashboard.events;
export const selectTodayEvents = (state) => state.dashboard.todayEvents;

export default dashboardSlice.reducer;
