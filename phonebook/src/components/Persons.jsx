const Persons = ({ persons, onDelete }) => {

  if (persons.length === 0) {
    return (
      <>
        <h2>Numbers</h2>
        <p> No results. </p>
      </>
    );
  }

  return (
    <>
      <h2>Numbers</h2>

      {persons.map((person) => 
        <Contact 
          key={person.id} 
          person={person}
          onDelete={() => onDelete(person.id, person.name)}
        />
      )}
    </>
  );
};

const Contact = ({person, onDelete}) => {

  return(
    <p>
      {person.name} {person.number} {" "}
      <button onClick={onDelete}>Delete</button>
    </p>
  )
}

export default Persons
