const express = require('express')
const app = express()

app.use(express.json())

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

const LIMIT = 10000

const getRandomInt = () =>  Math.floor(Math.random() * LIMIT)

const generateId = () => {
  const cand = getRandomInt()
	while (persons.some(person => person.id === cand)) {
		cand = getRandomInt()
	}
  return cand
}

app.get('/info', (req, res) => {
	const time = new Date()
	res.send(`<p>Phonebook has currently ${persons.length} numbers saved in it.</p> <p>${time}</p>`)
})

app.get('/api/persons', (req, res) => {
	res.json(persons)
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

app.post('/api/persons', (request, response) => {
	const id = generateId()
  const body = request.body
	if (!(body.name && body.number)) {
		response.status(400).json({
			error: 'Missing name or number.'
		})
	}
	const person = {
		id: id,
		name: body.name,
		number: body.number
	}
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
	const found = persons.some(person => person.id === id)
	if (found) {
		persons = persons.filter(person => person.id !== id)
  	response.status(204).end()
	} else {
		response.status(404).end()
	}
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})