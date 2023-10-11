import { useState } from "react";

import blogService from "../services/blogs";

const Blog = ({ blog, user, handleLike }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
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

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button id="toggle-button" onClick={toggleShowAll}>
        {showAll ? "hide" : "show"}
      </button>
      {showAll && (
        <div id="blog-details">
          <a href={blog.url}>{blog.url}</a> <br />
          likes {blog.likes}{" "}
          <button
            id="like-button"
            onClick={() =>
              handleLike(blog.id, {
                title: blog.title,
                author: blog.author,
                url: blog.url,
                likes: blog.likes + 1,
                user: blog.user.id,
              })
            }>
            like
          </button>
          <br />
          {blog.user.name}
          <br />
          {blog.user.username === user.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
