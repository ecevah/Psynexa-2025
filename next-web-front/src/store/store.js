import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./features/notificationSlice";
import userReducer from "./features/userSlice";
import breadcrumbReducer from "./features/breadcrumbSlice";
import dashboardReducer from "./features/dashboardSlice";
import timeScaleReducer from "./features/timeScaleSlice";
import speechDoughnutReducer from "./features/speechDoughnutSlice";
import emotionDoughnutReducer from "./features/emotionDoughnutSlice";
import itemCardLineReducer from "./features/itemCardLineSlice";
import emotionTrackingReducer from "./features/emotionTrackingSlice";
import nexabotAnalysisReducer from "./features/nexabotAnalysisSlice";
import feedbacksReducer from "./features/feedbacksSlice";
import clientsReducer from "./features/clientsSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    user: userReducer,
    breadcrumb: breadcrumbReducer,
    dashboard: dashboardReducer,
    timeScale: timeScaleReducer,
    speechDoughnut: speechDoughnutReducer,
    emotionDoughnut: emotionDoughnutReducer,
    itemCardLine: itemCardLineReducer,
    emotionTracking: emotionTrackingReducer,
    nexabotAnalysis: nexabotAnalysisReducer,
    feedbacks: feedbacksReducer,
    clients: clientsReducer,
  },
});

export default store;
