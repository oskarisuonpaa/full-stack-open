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
      state.push(action.payload);
    },
    update(state, action) {
      const updateBlog = action.payload;

      return state.map((blog) =>
        blog.id !== updateBlog.id ? blog : updateBlog
      );
    },
    remove(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { set, append, update, remove } = slice.actions;

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
    const blogToUpdate = {
      ...blog,
      likes: blog.likes + 1,
    };
    await blogsService.update(blogToUpdate);
    dispatch(update(blogToUpdate));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogsService.remove(id);
    dispatch(remove(id));
  };
};

export const commentBlog = (blog, comment) => {
  return async (dispatch) => {
    await blogsService.comment(blog.id, comment);
    dispatch(
      update({
        ...blog,
        comments: [...blog.comments, comment],
      })
    );
  };
};

export default slice.reducer;
