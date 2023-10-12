import { useDispatch, useSelector } from "react-redux";
import { commentBlog, likeBlog, removeBlog } from "../reducers/blogReducer";
import { useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Blog = () => {
  const dispatch = useDispatch();
  const id = useParams().id;
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  );
  const user = useSelector((state) => state.user);

  const handleDelete = () => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return;
    }
    dispatch(removeBlog(blog.id));
  };

  const handleLike = () => {
    dispatch(likeBlog(blog));
  };

  const addComment = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    dispatch(commentBlog(blog, comment));
    event.target.comment.value = "";
  };

  if (!blog) return;

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <LinkContainer to={blog.url}>
          <a className="link-underline link-underline-opacity-0">{blog.url}</a>
        </LinkContainer>
        <br />
        likes {blog.likes}{" "}
        <Button size="sm" onClick={handleLike}>
          like
        </Button>
        <br />
        added by {blog.user.name}{" "}
        {blog.user.username === user.username && (
          <Button variant="secondary" size="sm" onClick={handleDelete}>
            remove
          </Button>
        )}
      </div>

      <div>
        <h3>comments</h3>
        <Form onSubmit={addComment}>
          <Form.Control type="text" name="comment"></Form.Control>
          <Button type="submit">add comment</Button>
        </Form>
        <ul>
          {blog.comments &&
            blog.comments.map((comment) => <li key={comment}>{comment}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
