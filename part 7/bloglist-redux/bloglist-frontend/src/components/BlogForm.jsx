import { useRef, useState } from "react";
import Togglable from "./Togglable";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import { Button, Form } from "react-bootstrap";

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
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author</Form.Label>
          <Form.Control
            type="text"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url</Form.Label>
          <Form.Control
            type="text"
            name="url"
            value={author}
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          create
        </Button>
      </Form>
    </Togglable>
  );
};

export default BlogForm;
