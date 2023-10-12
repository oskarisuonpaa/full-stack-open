import { useRef, useState } from "react";
import Togglable from "./Togglable";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const toggleableRef = useRef();
  const dispatch = useDispatch();

  const addBlog = async (event) => {
    event.preventDefault();

    setTitle("");
    setAuthor("");
    setUrl("");

    dispatch(createBlog({ title, author, url }));
    dispatch(
      setNotification({
        message: `a new blog ${title} by ${author}`,
        type: "info",
      })
    );
    toggleableRef.current.toggleVisibility();
  };

  return (
    <Togglable buttonLabel="new blog" ref={toggleableRef}>
      <h2>add a new</h2>
      <form onSubmit={addBlog}>
        title{" "}
        <input
          id="title"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <br />
        author{" "}
        <input
          id="author"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br />
        url{" "}
        <input
          id="url"
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
        <br />
        <button type="submit">create</button>
      </form>
    </Togglable>
  );
};

export default BlogForm;
