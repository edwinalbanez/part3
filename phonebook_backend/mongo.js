const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log("add the password as an argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://edwinalbanez23:${password}@cluster0.co6vk.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  
  Person.find({}).then(people => {
    console.log('Phonebook:');
    
    people.forEach(person => {
      console.log(`${person.name} - ${person.number}`);
    });

    mongoose.connection.close();
  })

} else{

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });

  person.save().then(newPerson => {
    console.log(`${newPerson.name} was added.`);
    mongoose.connection.close();
  })
}



