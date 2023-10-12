import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { initializeBlogs } from "./reducers/blogReducer";
import { initializeUsers } from "./reducers/usersReducer";
import { clearUser, setUser } from "./reducers/userReducer";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import UsersList from "./components/UsersList";
import User from "./components/User";
import Blog from "./components/Blog";
import NavigationBar from "./components/NavigationBar";

const App = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
    } else {
      const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        dispatch(setUser(user));
      }
    }
  });

  if (!user) {
    return (
      <div className="container">
        <LoginForm user={user} setUser={setUser} />
      </div>
    );
  }

  return (
    <Router>
      <NavigationBar />
      <div className="container">
        <Notification />
        <h1>blog app</h1>

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <BlogForm />
                <BlogList user={user} />
              </div>
            }
          />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<Blog />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
