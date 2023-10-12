import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

const slice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    set(state, action) {
      return action.payload;
    },
  },
});

export const { set } = slice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await usersService.getAll();
    dispatch(set(users));
  };
};

export default slice.reducer;
