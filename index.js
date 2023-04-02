const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
		JSON.stringify(req.body)
  ].join(' ')
}))

// Jätän vielä tämän tähän
let persons = [
	{
		"id": 1,
		"name": "Makkis Makkarahauva",
		"number": "111-111-111"
	},
	{
		"id": 2,
		"name": "Pupu Jussikainen",
		"number": "222-222-222"
	},
	{
		"id": 3,
		"name": "Misse Missenen",
		"number": "333-333-333"
	}
]

// Käyttää vielä persons-taulukkoa
app.get('/info', (request, response) => {
	const time = new Date()
	response.send(`<p>Phonebook has currently ${persons.length} numbers saved in it.</p> <p>${time}</p>`)
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
  	})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
	const body = request.body
	if (!(body.name && body.number)) {
		return response.status(400).json({ error: 'Missing name or number.' })
	}
	const person = new Person({
		name: body.name,
		number: body.number
	})
		person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

app.put('/api/persons/:id', (request, response) => {
	const newPerson = request.body
	const id = request.params.id
	Person.findByIdAndUpdate(id, newPerson, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id.' })
  }
  next(error)
}

app.use(errorHandler)