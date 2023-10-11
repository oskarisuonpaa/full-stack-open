import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const slice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    filterChange(state, action) {
      return action.payload;
    },
  },
});

export const { filterChange } = slice.actions;
export default slice.reducer;
