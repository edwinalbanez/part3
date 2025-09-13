import { useState, useEffect } from "react";
import personService from "./services/persons"
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons"
import Notification from "./components/Notification"

const App = () => {
  
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState({text: null});

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])
  
  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const createMessage = (text, success = true) => {
    setMessage({text, success});
    setTimeout(() => setMessage({text: null}), 3000);
  };

  const clearFields = () => {
    setNewName("");
    setNewNumber("");
  }

  const handlerSubmit = (event) => {
    event.preventDefault();

    const someEmptyField = newName.trim() === "" || newNumber.trim() === "";

    if (someEmptyField) {
      createMessage("Complete all fields.", false);
      return;
    }

    const repeatedPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

    if (repeatedPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in your contacts, update the number?`
      );
      
      if (!confirmUpdate) {
        return;
      }
      
      personService
        .update(repeatedPerson.id, {...repeatedPerson, number: newNumber})
        .then(updatedPerson => {
          setPersons(
            persons.map(person => person.id === updatedPerson.id ? updatedPerson : person)
          );
          clearFields();
          createMessage(`Updated ${updatedPerson.name}'s number.`);
        })
        .catch((error) => {
          const { error: message } = error.response.data;
          createMessage(`${message}`, false);
        });

      return;
    }

    personService
      .create({name: newName, number: newNumber})
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        clearFields();
        createMessage(`${newPerson.name} has been added.`);
      })
      .catch((error) => {
        const { error: message } = error.response.data;
        createMessage(`${message}`, false);
      });
  }

  const handleDeletePerson = (id, name) => {

    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (!confirmDelete) {
      return;
    }

    personService.remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
        createMessage(`${name} was removed from contacts.`, false);
      })
      .catch(error => {
        if (error.status === 404) {
          setPersons(persons.filter(person => person.id !== id));
          createMessage(`${name} has already been removed from contacts.`, false);
          return;
        }

        createMessage(`The information of ${name} could not be deleted`, false);
      });
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={message} />

      <Filter 
        filter={filter}
        onChange={setFilter}
      />

      <PersonForm
        onSubmit={handlerSubmit} 
        name={newName}
        number={newNumber}
        onChangeName={({target}) => setNewName(target.value)}
        onChangeNumber={({target}) => setNewNumber(target.value)}
      />

      <Persons 
        persons={personsToShow} 
        onDelete={handleDeletePerson} />
    </div>
  );
};

export default App;
