const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser');
var cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors())
let i = 1
function *idGenerate() {
    while (true) {
        yield i++
    }
}

generate = idGenerate()

const users = [
    {
        id: generate.next().value,
        name: 'hoang',
        age: 24
    }
]

function addUser(name, age) {
    const user = {
        id: generate.next().value,
        name,
        age
    }
    users.push(user)
    return user
}

function removeUser(id) {
    const index = users.findIndex((user) => user.id == id)
    if (index == -1) {
        throw Error("Id of user doesn't exist")
    }
    return users.splice(index, 1)[0]
}

function edit(id, name, age) {
    let index = users.findIndex((user) => user.id == id)
    if (index == -1) {
        throw Error("Id of user doesn't exist")
    }
    return users[index] = {...users[index], ...{ name, age }}
}

function getUsers() {
    return users
}

function getUser(id) {
    const index = users.findIndex((user) => user.id == id)
    if (index == -1) {
        throw Error("Id of user doesn't exist")
    }
    return users[index]
}

app.get('/users', (req, res) => res.send(getUsers()))

app.get('/user/:id', (req, res) => {
    const id = req.param('id')
    console.log(id, 'id')

    return res.send(getUser(id))
})
app.post('/user', (req, res) => {
    console.log(req.body, 'req.body');
    console.log(req.params, 'req.params')
    console.log(req.query, 'req.query')
    const body = req.body
    return res.send(addUser(body.name, body.age))
})
app.put('/user/:id', (req, res) => {
    const body = req.body
    return res.send(edit(req.param('id'), body.name, body.age))
})

app.delete('/user/:id', (req, res) => res.send(removeUser(req.param('id'))))

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Accept', '*')
    next();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))