import { createSlice } from "@reduxjs/toolkit";
import blogsService from "../services/blogs";
import loginService from "../services/login";
import { setNotification } from "./notificationReducer";

const userSlice = createSlice({
  name: "user",
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

export const { set, clear } = userSlice.actions;

export const loginUser = ({ username, password }) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });

      dispatch(set(user));
      blogsService.setToken(user.token);
    } catch (exception) {
      dispatch(
        setNotification({
          message: "wrong username or password",
          type: "error",
        })
      );
    }
  };
};

export const setUser = (user) => {
  return async (dispatch) => {
    dispatch(set(user));
    blogsService.setToken(user.token);
  };
};

export const clearUser = () => {
  return (dispatch) => {
    dispatch(clear());
    blogsService.setToken(null);
  };
};

export default userSlice.reducer;
