import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cardTypes: {
    totalUsers: {
      items: [
        {
          value: "100",
          direction: "up",
          percent: "10",
        },
      ],
    },
    activeClients: {
      items: [
        {
          value: "100",
          direction: "down",
          percent: "10",
        },
      ],
    },
    monitoredUsers: {
      items: [
        {
          value: "100",
          direction: null,
          percent: null,
        },
      ],
    },
    totalPatients: {
      items: [
        {
          value: "100",
          direction: null,
          percent: null,
        },
      ],
    },
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateCardItems: (state, action) => {
      const { cardType, items } = action.payload;
      if (state.cardTypes[cardType]) {
        state.cardTypes[cardType].items = items;
      }
    },
    addCardItem: (state, action) => {
      const { cardType, item } = action.payload;
      if (state.cardTypes[cardType]) {
        state.cardTypes[cardType].items.push(item);
      }
    },
    updateCardItem: (state, action) => {
      const { cardType, index, data } = action.payload;
      if (state.cardTypes[cardType] && state.cardTypes[cardType].items[index]) {
        state.cardTypes[cardType].items[index] = {
          ...state.cardTypes[cardType].items[index],
          ...data,
        };
      }
    },
  },
});

export const { updateCardItems, addCardItem, updateCardItem } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
