const Filter = ({ filter, setFilter }) => {
  return (
    <>
      filter shown with:{" "}
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </>
  );
};

export default Filter;
