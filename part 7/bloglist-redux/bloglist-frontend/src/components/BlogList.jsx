import { useSelector } from "react-redux";

import { LinkContainer } from "react-router-bootstrap";

const BlogList = ({ user }) => {
  const blogs = useSelector((state) => state.blogs);

  if (!blogs) return;

  const blogsToShow = blogs.slice().sort((a, b) => b.likes - a.likes);

  const style = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    border: "solid",
    borderWidth: 1,
    marginTop: 5,
  };

  return (
    <div>
      {blogsToShow.map((blog) => (
        <div style={style} key={blog.id}>
          <LinkContainer to={`/blogs/${blog.id}`}>
            <a className="link-underline link-underline-opacity-0">
              {blog.title}
              {blog.author}
            </a>
          </LinkContainer>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
