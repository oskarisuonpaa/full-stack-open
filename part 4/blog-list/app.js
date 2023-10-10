const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");

const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");

const app = express();

mongoose.set("strictQuery", false);

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);

module.exports = app;
