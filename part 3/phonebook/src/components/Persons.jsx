import Person from "./Person";

const Persons = ({ persons, removePerson }) => {
  return (
    <>
      {persons.map((person) => {
        return (
          <Person key={person.id} person={person} removePerson={removePerson} />
        );
      })}
    </>
  );
};

export default Persons;
