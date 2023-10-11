import { useState, useEffect, useRef } from "react";

import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { useDispatch } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  const updateBlogData = () => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const handleLike = async (id, blogObject) => {
    await blogService.update(id, blogObject);
    updateBlogData();
  };

  const createBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog);
      blogFormRef.current.toggleVisibility();
      setBlogs(blogs.concat(blog));
      updateBlogData();
      dispatch(
        setNotification({
          message: `a new blog ${blog.title} by ${blog.author}`,
          type: "info",
        })
      );
    } catch (exception) {
      dispatch(
        setNotification({
          message: "title and author are required",
          type: "error",
        })
      );
    }
  };

  if (!user) {
    return (
      <div>
        <LoginForm user={user} setUser={setUser} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={handleLike}
          updateBlogData={updateBlogData}
        />
      ))}
    </div>
  );
};

export default App;
