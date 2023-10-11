const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../app");
const Blog = require("../models/blog");
const {
  initialBlogs,
  blogsInDb,
  initialUsers,
  usersInDb,
} = require("./test_helper");
const User = require("../models/user");

const api = supertest(app);

let authenticationHeader;

describe("blogs api", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = initialUsers[0];
    await api.post("/api/users").send(user);
    const response = await api.post("/api/login").send(user);
    authenticationHeader = `Bearer ${response.body.token}`;
  });

  describe("when there are blogs in database", () => {
    beforeEach(async () => {
      await Blog.deleteMany({});
      await Blog.insertMany(initialBlogs);
    });

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

  describe("a new blog with valid token", () => {
    test("can be saved to database", async () => {
      const blog = {
        title: "Test",
        author: "Test",
        url: "Test",
        likes: 0,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", authenticationHeader)
        .send(blog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogs = await blogsInDb();
      expect(blogs).toHaveLength(initialBlogs.length + 1);

      const contents = blogs.map((blog) => blog.title);
      expect(contents).toContain(blog.title);
    });

    test("with 0 likes if likes value not provided", async () => {
      const blog = {
        title: "Test",
        author: "Test",
        url: "Test",
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", authenticationHeader)
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

      await api
        .post("/api/blogs")
        .set("Authorization", authenticationHeader)
        .send(blog)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });

    test("is not saved to database if author is not provided", async () => {
      const blog = {
        title: "Test",
        url: "Test",
        likes: 0,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", authenticationHeader)
        .send(blog)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });
  });

  describe("an existing blog with valid token", () => {
    test("can be deleted from database", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", authenticationHeader)
        .expect(204);

      const blogsAtEnd = await blogsInDb();
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

      const titles = blogsAtEnd.map((blog) => blog.title);
      expect(titles).not.toContain(blogToDelete.title);
    });

    test("is not deleted from database if id is invalid", async () => {
      await api
        .delete(`/api/blogs/${-1}`)
        .set("Authorization", authenticationHeader)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });

    test("can be updated", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedLikes = blogToUpdate.likes + 1;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("Authorization", authenticationHeader)
        .send({ ...blogToUpdate, likes: updatedLikes })
        .expect(200);

      const blogsAtEnd = await blogsInDb();

      expect(blogsAtEnd[0].likes).toBe(updatedLikes);
    });

    test("is not updated if id is invalid", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedLikes = blogToUpdate.likes + 1;

      await api
        .put(`/api/blogs/${-1}`)
        .set("Authorization", authenticationHeader)
        .send({ ...blogToUpdate, likes: updatedLikes })
        .expect(400);

      const blogsAtEnd = await blogsInDb();

      expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes);
    });

    test("is not updated with invalid data", async () => {
      await api
        .put(`/api/blogs/${initialBlogs[initialBlogs.length - 1].id}`)
        .set("Authorization", authenticationHeader)
        .expect(400);
    });
  });

  describe("a new blog with invalid token", () => {
    test("is not saved to database", async () => {
      const blog = {
        title: "Test",
        author: "Test",
        url: "Test",
        likes: 0,
      };

      await api.post("/api/blogs").send(blog).expect(401);
    });
  });

  describe("an existing blog with invalid token", () => {
    test("is not deleted from database", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
    });

    test("is not updated", async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedLikes = blogToUpdate.likes + 1;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ ...blogToUpdate, likes: updatedLikes })
        .expect(401);

      const blogsAtEnd = await blogsInDb();

      expect(blogsAtEnd[0].likes).not.toBe(updatedLikes);
    });
  });

  describe("a new user", () => {
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash("secret", 10);
      const user = new User({ username: "root", passwordHash });

      await user.save();
    });

    test("can be saved to database", async () => {
      const usersAtStart = await usersInDb();

      const user = {
        username: "Test",
        name: "Test",
        password: "Test",
      };

      await api
        .post("/api/users")
        .send(user)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map((user) => user.username);
      expect(usernames).toContain(user.username);
    });

    test("is not saved to database if username is already taken", async () => {
      const usersAtStart = await usersInDb();

      const user = {
        username: "root",
        name: "Superuser",
        password: "salainen",
      };

      await api.post("/api/users").send(user).expect(400);

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toEqual(usersAtStart);
    });

    test("is not saved to database if password is too short", async () => {
      const user = {
        username: "Test",
        name: "Test",
        password: "Te",
      };

      await api
        .post("/api/users")
        .send(user)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });

    test("is not saved to database if no password provided", async () => {
      const user = {
        username: "Test",
        name: "Test",
      };

      await api
        .post("/api/users")
        .send(user)
        .expect(400)
        .expect("Content-Type", /application\/json/);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
