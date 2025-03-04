import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedEmotion: "Overjoyed",
  judicialExpressions: [
    {
      id: 1,
      expression: "Expression 1",
      context: "Context 1",
      date: "12.03.2024",
    },
    {
      id: 2,
      expression: "Expression 2",
      context: "Context 2",
      date: "11.03.2024",
    },
    {
      id: 3,
      expression: "Expression 3",
      context: "Context 3",
      date: "10.03.2024",
    },
  ],
};

const nexabotAnalysisSlice = createSlice({
  name: "nexabotAnalysis",
  initialState,
  reducers: {
    setSelectedEmotion: (state, action) => {
      state.selectedEmotion = action.payload;
    },
    setJudicialExpressions: (state, action) => {
      state.judicialExpressions = action.payload;
    },
    updateJudicialExpression: (state, action) => {
      const { id, ...updates } = action.payload;
      const expression = state.judicialExpressions.find((exp) => exp.id === id);
      if (expression) {
        Object.assign(expression, updates);
      }
    },
  },
});

export const {
  setSelectedEmotion,
  setJudicialExpressions,
  updateJudicialExpression,
} = nexabotAnalysisSlice.actions;

export const selectSelectedEmotion = (state) =>
  state.nexabotAnalysis.selectedEmotion;
export const selectJudicialExpressions = (state) =>
  state.nexabotAnalysis.judicialExpressions;

export default nexabotAnalysisSlice.reducer;
