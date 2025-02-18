import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./features/notificationSlice";
import userReducer from "./features/userSlice";
import breadcrumbReducer from "./features/breadcrumbSlice";
import dashboardReducer from "./features/dashboardSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    user: userReducer,
    breadcrumb: breadcrumbReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
