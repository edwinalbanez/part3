require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'))

morgan.token("body", (request, response) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'));


app.get('/api/persons', (request, response) => {
  Person.find({}).then(
    people => response.json(people)
  );
});

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    response.send(`
      Phonebook has info for ${people.length} people. <br />
      ${Date()}
    `)
  });
});

app.get('/api/persons/:id',  (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
});


app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then(deletedPerson => {
      if (!deletedPerson) {
        return response.status(404).json({
          error: 'Person not found.'
        });
      }
      response.status(204).end();
    })
    .catch(error => next(error));

})

app.post('/api/persons', (request, response) => {

  if (!request.body) {
    return response.status(400).json({
      error: 'No data in the request.'
    })
  }

  const { name, number } = request.body;

  if (!(name && number)) {
    return response.status(400).json({
      error: 'Name and number are required.'
    })
  }

  const person = new Person({ name, number })

  person.save().then(addedPerson => {
    response.status(201).json(addedPerson)
  });

});

app.put('/api/persons/:id', (request, response, next) => {

  if (!request.body) {
    return response.status(400).json({
      error: 'No data in the request.'
    })
  }
  
  const { name, number } = request.body;
  
  if (!(name && number)) {
    return response.status(400).json({
      error: 'Name and number are required.'
    })
  }

  const id = request.params.id;
  const person = { name, number };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      if (!updatedPerson) {
        return response.status(404).json({
          error: 'Person not found.'
        })
      }
      response.json(updatedPerson)
    })
    .catch(error => next(error));
})

const unknowEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknow endpoint'})
}

app.use(unknowEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Incorrect format id.' })
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running in port ${3001}`);
});

