const express = require('express')
const app =  express()
const {response} = require('express')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')
const mongoose = require('mongoose')

const cors = require('cors')
app.use(cors())

app.use(morgan(':method :url :status - :response-time ms :body' ))
app.use(express.json())
app.use(express.static('build'))


morgan.token('body', function (req, res) { return JSON.stringify(req.body) })


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)



console.log('hello world')

app.get('/', (req, res)=> {
    res.send('<h1> Hello World </h1>')
})

app.get('/api/persons',(req,res) => {
    Person.find({}).then(people => {
    res.json(people)
      })
})

app.get('/api/info',(req,res)=> {
    const newDate = new Date()

    Person.find({}).then(people => {
      let persons = people.length
      res.send(`Phonebook has info for ${persons} people </br> ${newDate}`)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then( person =>{
    if(person){response.json(person)
    }else{
    response.status(404).end()
  }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) =>{
Person.findByIdAndRemove(request.params.id)
.then(result => {
  response.status(204).end()
})
.catch(error=>next(error))
})

app.post('/api/persons',(req,res)=>{
  const body = req.body
  console.log(body)
  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  if(body === undefined){
    return res.status(400).json({error:"content missing"})
  }else{
    person.save()
    .then(savedPerson=>{
      res.json(savedPerson)
    })
    .catch((error) => {
      console.log(error.message)
      res.status(400).json({error: error.message})
    })
  }
})

app.put('/api/persons/:id', (req,res)=>{
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(req.params.id, person,{new:true})
  .then(updatedPerson => {
    res.json(updatedPerson)
  })
  .catch(error=>next(error))
})




const PORT = process.env.PORT
app.listen(PORT, () =>
console.log(`Server running on port ${PORT}`)
)

