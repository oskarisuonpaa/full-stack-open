import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Blog from "./Blog";

const blog = {
  title: "Title",
  author: "Author",
  url: "Url",
  likes: 0,
  user: { name: "tester" },
};

const mockLikeHandler = jest.fn();
let container;

describe("blog", () => {
  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={blog.user} handleLike={mockLikeHandler} />
    ).container;
  });
  test("renders only title and author by default", () => {
    screen.getByText(blog.title, { exact: false });
    screen.getByText(blog.author, { exact: false });

    let element = screen.queryByText(blog.url, { exact: false });
    expect(element).toBeNull();

    element = screen.queryByText("likes", { exact: false });
    expect(element).toBeNull();
  });

  test("renders url and likes when toggled by button", async () => {
    const user = userEvent.setup();

    const toggleButton = container.querySelector("#toggle-button");
    await user.click(toggleButton);

    screen.getByText(blog.title, { exact: false });
    screen.getByText(blog.author, { exact: false });
  });

  test("handleLike is called twice when liked twice", async () => {
    const user = userEvent.setup();

    const toggleButton = container.querySelector("#toggle-button");
    await user.click(toggleButton);

    const likeButton = container.querySelector("#like-button");
    console.log(likeButton);
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockLikeHandler).toHaveBeenCalledTimes(2);
  });
});
