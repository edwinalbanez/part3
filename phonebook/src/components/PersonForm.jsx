const PersonForm = ({name, number, onChangeName, onChangeNumber, onSubmit}) => {
  return (
    <div>
      <h2>Add a new</h2>
      <form onSubmit={onSubmit}>
        <div>
          Name: {" "}
          <input 
            value={name} 
            onChange={onChangeName}  
          />
        </div>
        <div>
          Number: {" "}
          <input 
            value={number} 
            onChange={onChangeNumber}  
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm