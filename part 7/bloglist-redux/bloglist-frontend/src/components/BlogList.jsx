import { useSelector } from "react-redux";

import Blog from "./Blog";

const BlogList = ({ user }) => {
  const blogs = useSelector((state) => state.blogs);

  if (!blogs) return;

  const blogsToShow = blogs.slice().sort((a, b) => b.likes - a.likes);

  return (
    <div>
      {blogsToShow.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user} />
      ))}
    </div>
  );
};

export default BlogList;
