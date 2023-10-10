import { useState } from "react";

import blogService from "../services/blogs";

const Blog = ({ blog, user }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleLike = async () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    await blogService.update(blog.id, blogObject);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return;
    }
    await blogService.remove(blog.id);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  if (showAll) {
    return (
      <div style={blogStyle}>
        <p>
          {blog.title} {blog.author}{" "}
          <button onClick={toggleShowAll}>hide</button>
        </p>
        <p>{blog.url}</p>
        <p>
          {blog.likes} <button onClick={handleLike}>like</button>{" "}
        </p>
        <p>{blog.user.name}</p>
        {blog.user.username === user.username && (
          <button onClick={handleDelete}>remove</button>
        )}
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleShowAll}>view</button>
    </div>
  );
};

export default Blog;
