const Notification = ({ message }) => {
  if (message.text === null) {
    return null
  }

  return (
    <div className={message.success ? "success" : "error" }>
      {message.text}
    </div>
  )
}

export default Notification