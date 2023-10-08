import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    type: null,
    message: null,
  });

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const notify = (type = "success", message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: null });
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    let nameTaken = false;
    let takenPerson = {};

    for (let i = 0; i < persons.length; i++) {
      if (persons[i].name === personObject.name) {
        nameTaken = true;
        takenPerson = persons[i];
        break;
      }
    }

    if (!nameTaken) {
      setPersons(persons.concat(personObject));
      personService.create(personObject);
      notify("success", `Added ${newName}`);
    } else {
      updatePerson(takenPerson);
    }

    setNewName("");
    setNewNumber("");
  };

  const removePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => setPersons(persons.filter((person) => person.id !== id)))
        .catch(() => {
          notify(
            "error",
            `Information of ${name} has already been removed from server`
          );
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  const updatePerson = (takenPerson) => {
    if (
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      personService
        .update(takenPerson.id, {
          ...takenPerson,
          number: newNumber.number,
        })
        .then(() => {
          setPersons(
            persons.map((person) =>
              person.id !== takenPerson.id
                ? person
                : { ...takenPerson, number: newNumber.number }
            )
          );
          notify("success", `Number of ${takenPerson.name} updated.`);
        })
        .catch(() => {
          notify(
            "error",
            `Information of ${takenPerson.name} has already been removed from server`
          );
          setPersons(persons.filter((p) => p.id !== takenPerson.id));
        });
    }
  };

  const personsToShow = filter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} />

      <Filter filter={filter} setFilter={setFilter} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  );
};

export default App;
