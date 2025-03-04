import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

const initialState = {
  clients: Array(50)
    .fill()
    .map((_, index) => ({
      id: index + 1,
      image: "/call-center/user-image.jpeg",
      name: `Client ${index + 1}`,
      age: 25 + (index % 20),
      recentVisit: "23 Oct 2024",
      phoneNumber: "+90 213 321 1223",
      email: `client${index + 1}@example.com`,
      birthday: "12 Oct 2024",
    })),
  currentPage: 1,
  itemsPerPage: 10,
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    addClient: (state, action) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action) => {
      const { id, ...updates } = action.payload;
      const client = state.clients.find((client) => client.id === id);
      if (client) {
        Object.assign(client, updates);
      }
    },
    deleteClient: (state, action) => {
      state.clients = state.clients.filter(
        (client) => client.id !== action.payload
      );
    },
  },
});

export const {
  setClients,
  setCurrentPage,
  addClient,
  updateClient,
  deleteClient,
} = clientsSlice.actions;

// Base selectors
export const selectClientsState = (state) => state.clients;
export const selectClients = createSelector(
  selectClientsState,
  (state) => state.clients
);
export const selectCurrentPage = createSelector(
  selectClientsState,
  (state) => state.currentPage
);
export const selectItemsPerPage = createSelector(
  selectClientsState,
  (state) => state.itemsPerPage
);

// Memoized selectors with proper dependency tracking
export const selectPaginatedClients = createSelector(
  [selectClients, selectCurrentPage, selectItemsPerPage],
  (clients, currentPage, itemsPerPage) => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return clients.slice(start, end);
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) =>
        a.length === b.length &&
        a.every((item, index) => item.id === b[index].id),
    },
  }
);

export const selectTotalPages = createSelector(
  [selectClients, selectItemsPerPage],
  (clients, itemsPerPage) => Math.ceil(clients.length / itemsPerPage)
);

export default clientsSlice.reducer;
