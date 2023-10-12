const router = require("express").Router();

const Blog = require("../models/blog");
const { tokenExtractor, userExtractor } = require("../utils/middleware");

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

router.post("/", tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user;

  const { title, author, url } = request.body;

  const blog = new Blog({
    title,
    author,
    url,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs.push(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

router.delete(
  "/:id",
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);

    if (!user && blog.user.toString() !== user._id.toString()) {
      return response.send(401).json({ error: "operation not permitted" });
    }

    user.blogs = user.blogs.filter(
      (blog) => blog.toString() !== blog._id.toString()
    );

    await user.save();
    await Blog.deleteOne({ _id: blog._id });

    response.sendStatus(204);
  }
);

router.put("/:id", tokenExtractor, userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = {
    title,
    author,
    url,
    likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  response.json(updatedBlog);
});

router.post(
  "/:id/comments",
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const { id } = request.params;
    const { comment } = request.body;

    const blog = await Blog.findById(id);
    blog.comments.push(comment);
    await blog.save();

    response.json(blog);
  }
);

module.exports = router;
