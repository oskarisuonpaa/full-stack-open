import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";
import GenreButtons from "./GenreButtons";

const Books = ({ show }) => {
  const [genre, setGenre] = useState("all");
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre === "all" ? null : genre },
  });

  if (!show) {
    return null;
  } else if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  if (books.length === 0) {
    return (
      <div>
        <h2>books</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>books</h2>
      {genre !== "all" && (
        <p>
          in genre <b>{genre}</b>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <GenreButtons setGenre={setGenre} />
    </div>
  );
};

export default Books;
