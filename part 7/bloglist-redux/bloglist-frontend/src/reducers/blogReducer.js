import { createSlice } from "@reduxjs/toolkit";
import blogsService from "../services/blogs";

const slice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    set(state, action) {
      return action.payload;
    },
    append(state, action) {
      return state.push(action.payload);
    },
    like(state, action) {
      const blogToChange = action.payload;

      return state.map((blog) =>
        blog.id !== blogToChange.id
          ? blog
          : { ...blogToChange, likes: blogToChange.likes + 1 }
      );
    },
    remove(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { set, append, like, remove } = slice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll();
    dispatch(set(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogsService.create(content);
    dispatch(append(newBlog));
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    await blogsService.update({ ...blog, likes: blog.likes + 1 });
    dispatch(like(blog));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogsService.remove(id);
    dispatch(remove(id));
  };
};

export default slice.reducer;
