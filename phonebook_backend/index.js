const express = require("express");

const app = express();
app.use(express.json())

let people = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (request, response) => {
  response.json(people);
});

app.get('/info', (request, response) => {
  response.send(`
    Phonebook has info for ${people.length} people. <br />
    ${Date()}
  `)
});

app.get('/api/persons/:id',  (request, response) => {
  const id = Number(request.params.id);
  const person = people.find(person => person.id === id);

  if (!person) {
    return response.status(404).end();
  }

  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const personToDelete = people.find(person => person.id === id);

  if (!personToDelete) {
    return response.status(404).end();
  }

  people = people.filter(person => person.id !== id);
  response.status(204).end();
})

const getNewId = () => {
  return Math.floor((Math.random() * 1000));
}

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!(name && number)) {
    return response.status(400).json({
      error: "name and number are required."
    });
  }

  const newPerson = { id: getNewId(), name, number };
  people = people.concat(newPerson);
  response.json(newPerson);

})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running in port ${3001}`);
});

