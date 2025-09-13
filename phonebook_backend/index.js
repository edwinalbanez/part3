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

app.post('/api/persons', (request, response, next) => {

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
  })
  .catch(error => next(error));

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

  Person.findByIdAndUpdate(
    id, person, { new: true, runValidators: true, context: 'query' }
  ).then(updatedPerson => {
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
    return response.status(400).json({ error: 'Incorrect format id.' });

  } else if (error.name === 'ValidationError') {

    const fieldsWithError = Object.keys(error.errors);
    const errors = [];

    fieldsWithError.forEach(field => {

      if (field === 'name') {
        const { kind } = error.errors.name;
        
        switch (kind) {
          case 'required':
            errors.push('The name is required.');
            break;
          case 'minlength':
            errors.push('The name must have at least 3 characters.');
            break;
          default:
            errors.push('Incorrect name format.');
            break;
        }
      }

      if (field === 'number') {
        const { kind } = error.errors.number;
        
        switch (kind) {
          case 'required':
            errors.push('The number is required.');
            break;
          case 'minlength':
            errors.push('The number must have at least 8 digits.')
            break;
          case 'user defined':
            errors.push('Wrong number format, try something like 12-1234567 or 123-12345678.');
            break;
          default:
            errors.push('Incorrect number format.');
            break;
        }
      } 
    });
    
    return response.status(400).json({ error: errors.join(' ') });
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running in port ${3001}`);
});

