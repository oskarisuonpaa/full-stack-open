import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    set(state, action) {
      return action.payload;
    },
    clear(state, action) {
      return null;
    },
  },
});

export const setNotification = (notification, time = 5) => {
  return (dispatch) => {
    dispatch(set(notification));
    setTimeout(() => {
      dispatch(clear());
    }, 1000 * time);
  };
};

export const { set, clear } = notificationSlice.actions;
export default notificationSlice.reducer;
