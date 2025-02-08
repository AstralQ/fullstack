const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();


const PORT = process.env.PORT || 3002;

// ✅ Middleware Setup
app.use(express.json()); 
app.use(cors());
app.use(express.static('dist'))
app.use(morgan('tiny'))

// ✅ Custom Morgan Tokens
morgan.token('req-body', (req) => {
    return ['POST', 'PUT', 'DELETE'].includes(req.method) ? JSON.stringify(req.body) : 'No body';
});

morgan.token('query-params', (req) => {
    return Object.keys(req.query).length ? JSON.stringify(req.query) : 'No query params';
});

morgan.token('headers', (req) => JSON.stringify(req.headers));

// ✅ Morgan Logger
app.use(
    morgan(':method :url :status - Body: :req-body - Query: :query-params - Headers: :headers')
);



let persons = [
    { id: "1c9f", name: "damn-czu", number: "123-567-467467" },
    { id: "d21c", name: "Senai Tafere", number: "123-567" },
    { id: "cc3a", name: "Filmon woldeabzghi", number: "123-567" },
    { id: "9bae", name: "abel tafere", number: "123-456" }
];

app.get('/api/persons', (req,res) => {
    res.send(persons)
})

app.get('/api/info', (req,res) => {
    res.send(`persons include ${persons.length} this amount of people !`)
})

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: "Name and number are required" });
    }

    if (persons.some(person => person.name === name || person.number === number)) {
        return res.status(400).json({ error: "Name & Number must be unique" });
    }

    // ✅ Ensure ID is a unique number
    const generateId = () => {
        return persons.length > 0 ? Math.max(...persons.map(p => parseInt(p.id, 16))) + 1 : 1;
    };

    const newPerson = {
        id: generateId().toString(16),  // Ensure unique ID as hex string
        name,
        number
    };

    persons.push(newPerson); // ✅ Update the `persons` array correctly
    res.status(201).json(newPerson);
});


app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter((person) => person.id !== id)
    res.status(202).send(`Person with id : ${id} deleted`)
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
