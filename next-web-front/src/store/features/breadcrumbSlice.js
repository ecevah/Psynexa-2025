import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [{ text: "Dashboard", link: "/dashboard", active: true }],
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    setBreadcrumbs: (state, action) => {
      state.items = action.payload;
    },
    addBreadcrumb: (state, action) => {
      const newItem = action.payload;
      // Eğer aynı link zaten varsa, o ve sonrasını kaldır
      const existingIndex = state.items.findIndex(
        (item) => item.link === newItem.link
      );
      if (existingIndex !== -1) {
        state.items = state.items.slice(0, existingIndex);
      }
      // Tüm itemları pasif yap ve yeni itemi ekle
      state.items = [
        ...state.items.map((item) => ({ ...item, active: false })),
        { ...newItem, active: true },
      ];
    },
    clearBreadcrumbs: (state) => {
      state.items = [{ text: "Dashboard", link: "/dashboard", active: true }];
    },
  },
});

export const { setBreadcrumbs, addBreadcrumb, clearBreadcrumbs } =
  breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
