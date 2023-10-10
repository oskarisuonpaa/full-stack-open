const bcrypt = require("bcryptjs");
const router = require("express").Router();
const User = require("../models/user");

router.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!password) {
    return response.status(400).send({ error: "password required" });
  } else if (password.length < 3) {
    return response
      .status(400)
      .send({ error: "password has to be atleast 3 characters long" });
  }

  const user = new User({
    username,
    name,
    passwordHash: await bcrypt.hash(password, 10),
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

router.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });

  return response.json(users);
});

module.exports = router;
