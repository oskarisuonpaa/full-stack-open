const BlogForm = ({
  addBlog,
  title,
  setTitle,
  author,
  setAuthor,
  url,
  setUrl,
}) => (
  <>
    <h2>add a new</h2>
    <form onSubmit={addBlog}>
      title{" "}
      <input
        type="text"
        value={title}
        name="Title"
        onChange={({ target }) => setTitle(target.value)}
      />
      <br />
      author{" "}
      <input
        type="text"
        value={author}
        name="Author"
        onChange={({ target }) => setAuthor(target.value)}
      />
      <br />
      url{" "}
      <input
        type="text"
        value={url}
        name="Url"
        onChange={({ target }) => setUrl(target.value)}
      />
      <br />
      <button type="submit">create</button>
    </form>
  </>
);

export default BlogForm;
