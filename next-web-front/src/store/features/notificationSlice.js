import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboard: 0,
  clients: 0,
  bottom_support: 0,
  bottom_logout: 0,
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    clearNotifications: (state) => {
      Object.keys(state).forEach((key) => {
        state[key] = 0;
      });
    },
  },
});

export const { setNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
