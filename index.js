const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})