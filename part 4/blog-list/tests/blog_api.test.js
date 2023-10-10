const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const { initialBlogs, blogsInDb } = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe("blogs api", () => {
  describe("when there are blogs in database", () => {
    test("all blogs are returned as json", async () => {
      const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("blogs return _id as id", async () => {
      const response = await api.get("/api/blogs");
      expect(response.body[0].id).toBeDefined();
    });
  });

  describe("a new blog", () => {
    test("can be saved to database", async () => {
      const blog = {
        title: "Test",
        author: "Test",
        url: "Test",
        likes: 0,
      };

      await api
        .post("/api/blogs")
        .send(blog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogs = await blogsInDb();
      expect(blogs).toHaveLength(initialBlogs.length + 1);

      const contents = blogs.map((blog) => blog.title);
      expect(contents).toContain(blog.title);
    });

    test("has 0 likes if likes value not provided", async () => {
      const blog = {
        title: "Test",
        author: "Test",
        url: "Test",
      };

      const response = await api
        .post("/api/blogs")
        .send(blog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      expect(response.body.likes).toBe(0);
    });

    test("is not saved to database if title is not provided", async () => {
      const blog = {
        author: "Test",
        url: "Test",
        likes: 0,
      };

      await api.post("/api/blogs").send(blog).expect(400);

      const blogs = await blogsInDb();
      expect(blogs).toHaveLength(initialBlogs.length);
    });

    test("is not saved to database if url is not provided", async () => {
      const blog = {
        title: "Test",
        author: "Test",
        likes: 0,
      };

      await api.post("/api/blogs").send(blog).expect(400);

      const blogs = await blogsInDb();
      expect(blogs).toHaveLength(initialBlogs.length);
    });
  });

  describe("an existing blog", () => {
    test("can be deleted from database", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await blogsInDb();

      expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

      const titles = blogsAtEnd.map((blog) => blog.title);
      expect(titles).not.toContain(blogToDelete.title);
    });

    test("can be updated", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedLikes = blogToUpdate.likes + 1;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ ...blogToUpdate, likes: updatedLikes })
        .expect(200);

      const blogsAtEnd = await blogsInDb();

      expect(blogsAtEnd[0].likes).toBe(updatedLikes);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
