const Filter = ({filter, onChange}) => {
  return (
    <div>
      Filter shown with: {" "}
      <input type="text" value={filter} onChange={({target}) => onChange(target.value)} />
    </div>
  )
}

export default Filter