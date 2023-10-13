import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const GenreButtons = ({ setGenre }) => {
  const result = useQuery(ALL_BOOKS);

  if (result.loading) return <div>loading...</div>;

  const books = result.data.allBooks;

  let genres = [];
  books.map((b) =>
    b.genres.forEach((g) => {
      if (!genres.includes(g)) {
        genres.push(g);
      }
    })
  );

  return (
    <div>
      {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setGenre("all")}>all genres</button>
    </div>
  );
};

export default GenreButtons;
