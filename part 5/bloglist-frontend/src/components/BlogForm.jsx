import { useState } from "react";

import blogService from "../services/blogs";

const BlogForm = ({ blogFormRef, notify, blogs, setBlogs }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();

    try {
      const blog = await blogService.create({ title, author, url });

      blogFormRef.current.toggleVisibility();
      setBlogs(blogs.concat(blog));
      setTitle("");
      setAuthor("");
      setUrl("");
      notify(`a new blog ${blog.title} by ${blog.author}`);
    } catch (exception) {
      notify("title and author are required", "error");
    }
  };

  return (
    <div>
      <h2>add a new</h2>
      <form onSubmit={addBlog}>
        title{" "}
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <br />
        author{" "}
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br />
        url{" "}
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
