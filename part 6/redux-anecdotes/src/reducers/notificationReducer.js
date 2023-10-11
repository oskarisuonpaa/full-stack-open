import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    set(state, action) {
      console.log(action.payload);
      return action.payload;
    },
    clear(state, action) {
      return null;
    },
  },
});

export const setNotification = (message, time) => {
  return (dispatch) => {
    dispatch(set(message));
    setTimeout(() => {
      dispatch(clear());
    }, 1000 * time);
  };
};

export const { set, clear } = notificationSlice.actions;
export default notificationSlice.reducer;
