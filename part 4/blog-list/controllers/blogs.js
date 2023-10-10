const router = require("express").Router();
const Blog = require("../models/blog");

router.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

router.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title) {
    return response.status(400).json({ message: "title missing" });
  } else if (!url) {
    return response.status(400).json({ message: "url missing" });
  }

  const blog = new Blog({ title, author, url, likes: likes ? likes : 0 });

  const result = await blog.save();
  response.status(201).json(result);
});

router.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

router.put("/:id", async (request, response) => {
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

module.exports = router;
