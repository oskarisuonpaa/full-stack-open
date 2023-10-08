const Person = ({ person, removePerson }) => (
  <p>
    {person.name} {person.number}{" "}
    <button onClick={() => removePerson(person.name, person.id)}>delete</button>
  </p>
);

export default Person;
