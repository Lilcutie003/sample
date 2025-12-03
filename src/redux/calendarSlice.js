// calendarSlice.js
import { createSlice } from "@reduxjs/toolkit";
import dummyData from "../data/dummyData";

const initialState = {
  events: dummyData,
  selectedDate: null,
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    selectDate: (state, action) => {
      state.selectedDate = action.payload;
    },
  },
});

export const { selectDate } = calendarSlice.actions;
export default calendarSlice.reducer;
