import { useEffect, useState } from "react";

import personsService from "./services/persons";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({ type: "", message: "" });

  useEffect(() => {
    personsService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const person = persons.find((person) => person.name === newName);

    if (person) {
      updatePerson(person);
      clearForm();
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };
    personsService
      .create(personObject)
      .then((response) => {
        setPersons(persons.concat(response.data));
        notify(`Added ${newName}`);
        clearForm();
      })
      .catch((error) => {
        notify(error.response.data.error, "error");
      });
  };

  const deletePerson = (personToBeDeleted) => {
    if (window.confirm(`Delete ${personToBeDeleted.name}`)) {
      personsService
        .remove(personToBeDeleted.id)
        .then(() => {
          setPersons(
            persons.filter((person) => person.id !== personToBeDeleted.id)
          );
          notify(`Deleted ${personToBeDeleted.name} from phonebook`);
        })
        .catch((error) => {
          notify(error.response.data.error, "error");
        });
    }
  };

  const updatePerson = (person) => {
    if (
      !window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    )
      return;

    const updatePersonObject = { ...person, number: newNumber };

    personsService
      .update(person.id, updatePersonObject)
      .then((updatedPerson) => {
        setPersons(
          persons.map((person) =>
            person.id !== updatedPerson.id ? person : updatedPerson
          )
        );
        notify(`Updated phonenumber of ${newName}`);
      })
      .catch((error) => {
        notify(error.response.data.error, "error");
      });
  };

  const clearForm = () => {
    setNewName("");
    setNewNumber("");
  };

  const notify = (message, type = "success") => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 3000);
  };

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
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
