import { useMutation, useQuery } from "@apollo/client";

import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries";

const Authors = ({ show, setError }) => {
  const result = useQuery(ALL_AUTHORS);
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors.map((e) => e.message).join("\n");
      setError(messages);
    },
  });

  if (!show) {
    return null;
  } else if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const submit = async (event) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target).entries());

    updateAuthor({
      variables: {
        name: formData.name,
        setBornTo: Number(formData.born),
      },
    });

    event.target.born.value = "";
  };

  if (authors.length === 0) {
    return (
      <div>
        <h2>authors</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <h3>Set birthyear</h3>
        <form onSubmit={submit}>
          <div>
            <select name="name">
              {authors.map((author) => (
                <option key={author.name} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            born <input name="born" />
          </div>
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  );
};

export default Authors;
