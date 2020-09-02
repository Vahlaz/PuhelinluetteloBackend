const express = require('express')
const { response } = require('express')
const morgan = require('morgan')
const cors = require('cors')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

const app =  express()

app.use(cors())
app.use(morgan(':method :url :status - :response-time ms :body' ))
app.use(express.static('build'))
app.use(express.json())

let persons =  [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "velitoveri",
        "number": "39-23-6423122",
        "id": 5
      }
    ]

console.log('hello world')

app.get('/', (req, res)=> {
    res.send('<h1> Hello World </h1>')
})

app.get('/api/persons',(req,res) => {
    res.json(persons)
})

app.get('/api/info',(req,res)=> {
    const newDate = new Date()
    const content = `Phonebook has info for ${persons.length} people </br> ${newDate}`
response.send(content)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons',(req,res)=>{
  const id = Math.floor(Math.random()*(Math.floor(1000)))
  const body = req.body
  const person = {
    "name" : body.name,
    "number":body.number,
    "id": id
  }

  const found = persons.find(person => person.name === body.name)

  if(found){
    res.status(400).send({error: 'name must be unique'})
  }else if (!body.name || !body.number) {
    res.status(400).send({error : 'No name or number'})
  }else {
    persons = persons.concat(person)
    res.json(person).status(204).end()
  }
})


const PORT = process.env.PORT || 3001 
app.listen(PORT, () =>
console.log(`Server running on port ${PORT}`)
)

