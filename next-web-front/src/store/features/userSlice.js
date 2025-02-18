import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "John",
  lastName: "Doe",
  imageUrl: "/call-center/user-image.jpeg",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      const { firstName, lastName, imageUrl } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.imageUrl = imageUrl;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
