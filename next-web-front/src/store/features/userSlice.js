import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "John",
  lastName: "Doe",
  imageUrl: "/call-center/user-image.jpeg",
  age: 25,
  gender: "Male",
  dateOfBirth: "12 Oct 1990",
  location: "New York, USA",
  language: "English",
  timezone: "GMT+3",
  phone: "+1 234 567 89 00",
  email: "john.doe@example.com",
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
