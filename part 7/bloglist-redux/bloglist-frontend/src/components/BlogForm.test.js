import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BlogForm from "./BlogForm";

const blog = {
  title: "Title",
  author: "Author",
  url: "Url",
};

test("<BlogForm /> calls handler with correct data", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  const container = render(<BlogForm createBlog={createBlog} />).container;

  const inputTitle = container.querySelector("#title");
  await user.type(inputTitle, blog.title);

  const inputAuthor = container.querySelector("#author");
  await user.type(inputAuthor, blog.author);

  const inputUrl = container.querySelector("#url");
  await user.type(inputUrl, blog.url);

  const submitButton = screen.getByText("create");
  await user.click(submitButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog.mock.calls[0][0].author).toBe(blog.author);
});
