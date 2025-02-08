import { useState, useEffect } from "react";
import { Names } from "./Names";
import name from "./service/name";

const Filter = ({ searchPerson, handleSearchPerson }) => {
  return (
    <div>
      <input value={searchPerson} onChange={handleSearchPerson} placeholder="enter name" />
    </div>
  );
};

const PersonForm = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <div>
      <form onSubmit={addName}>
        <br />
        <h2>Add a new name & number</h2>
        <div>
          <input value={newName} onChange={handleNameChange} placeholder="enter name" />
        </div>
        <div>
          <input value={newNumber} onChange={handleNumberChange} placeholder="enter number" />
        </div>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

const Persons = ({ filteredPerson, deleteName }) => {
  return (
    <div>
      {filteredPerson.map((person) => (
        <Names key={person.id} persons={person} deleteName={deleteName} />
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchPerson, setSearchPerson] = useState("");
  const [filteredPerson, setFilteredPerson] = useState([]);

  useEffect(() => {
    name.getAll().then((initialPersons) => {
      setPersons(initialPersons);
      setFilteredPerson(initialPersons);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();

    if (!newName || !newNumber) {
      alert("Name and Number are required");
      return;
    }

    if (persons.find((person) => person.name.toLowerCase() === newName.toLowerCase())) {
      alert(`The name "${newName}" is already in the database.`);
      setNewName("")
      setNewNumber("")
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber
    };

    name
      .create(nameObject)
      .then((returnedPerson) => {
        setPersons([...persons, returnedPerson]);
        setFilteredPerson([...filteredPerson, returnedPerson]);
        setNewName("");
        setNewNumber("");
        alert(`Added ${returnedPerson.name} to the database`);
      })
      .catch((err) => {
        console.error(err);
        alert(`Failed to add person`, err);
      });
  };

  const deleteName = async (id) => {
    try {
      await name.remove(id);
      setPersons(persons.filter((person) => person.id !== id));
      setFilteredPerson(filteredPerson.filter((person) => person.id !== id));
      alert("Contact deleted successfully.");
    } catch (err) {
      console.error("Error deleting contact:", err);
      alert(`Failed to delete the contact. Error: ${err.message}`);
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchPerson = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchPerson(query);

    const filteritems = persons.filter((person) => person.name.toLowerCase().includes(query));
    setFilteredPerson(filteritems);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchPerson={searchPerson} handleSearchPerson={handleSearchPerson} />
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Contacts</h2>
      <Persons filteredPerson={filteredPerson} deleteName={deleteName} />
    </div>
  );
};

export default App;
