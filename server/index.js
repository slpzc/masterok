const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use(bodyParser.json())

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions))


const users = [
    {
        fullName: 'Чекунов Алексей Артёмович',
        login: 'kaktitam',
        password: '123456',
        email: 'leaveyt@mail.ru',
        admin: 1
    }

]
const category = ['Капитальный ремонт', 'Ремонт электрики', 'Косметический ремонт']
const tickets = [
    {
    author: 'kaktitam',
    adress: 'Пушкина 223',
    description: 'Описание квартиры',
    status: 'Отремонтировано',
    maxPrice: '500000',
        category: 'Кааа ремонт',
    photo: 'https://hameleone.ru/wp-content/uploads/a/a/3/aa31f7bb1ce28b36ceff465951d11de0.jpeg',
    uid: '3173634',
    time: '10/12/2022, 10:04:24 AM'
    },
    {
        title: 'Ремонт',
        author: 'pavel331',
        adress: 'Пушкина 223',
        description: 'Описание квартиры',
        status: 'Новая',
        maxPrice: '500000',
        category: 'Косметический',
        photo: 'https://hameleone.ru/wp-content/uploads/a/a/3/aa31f7bb1ce28b36ceff465951d11de0.jpeg',
        uid: '3173634',
        time: '10/12/2022, 10:04:24 AM'
        }
]


app.post('/register', function (req, res) {
    const body = req.body
    body.admin = 0
    if(users.some(user => user.email == body.email)) return res.status(403);
    console.log(body)
    users.push(body)
    return res.json({body, categories: category, tickets: tickets.filter(el => el.author == body.login)}).status(200)
})

app.post('/login', function (req, res) {
    const body = req.body
    const user = users.find(({login, password}) => login == body.login && password == body.password)
    
    if(!user) return res.send({ message: 'Такого пользователя нет!' }).status(403);
    console.log('вошёл')
    return res.json({user, categories: category, tickets: tickets.filter(el => el.author == user.login)}).status(200)
})

app.post('/createTicket', function (req, res) {
    const ticket = req.body
    ticket.uid = uidGen()
    ticket.status = 'Новая';
    ticket.time = new Date().toLocaleString("en-US", {timeZone: "Europe/Moscow"})
    console.log(ticket)
    tickets.unshift(ticket)
    return res.send(ticket).status(200)
})
//
app.post('/deleteTicket', function (req, res) {
    const UID = `${req.body.uid}`
    const ticketPosition = tickets.findIndex(ticket => ticket.uid == UID)
    tickets.splice(ticketPosition, ticketPosition)
    console.log('s')
    return res.send('ok').status(200)
})

app.post('/changeTicketStatus', function (req, res) {
    const UID = `${req.body.uid}`
    const status = req.body.status
    const ticketPosition = tickets.findIndex(ticket => ticket.uid == UID)
    console.log(tickets[ticketPosition])
    tickets[ticketPosition].status = status
    console.log(tickets[ticketPosition])
    return res.status(200)
})
app.post('/changeTicketCategory', function (req, res) {
    const UID = `${req.body.uid}`
    const category = req.body.category
    const ticketPosition = tickets.findIndex(ticket => ticket.uid == UID)
    console.log(tickets[ticketPosition])
    tickets[ticketPosition].category = category
    console.log(tickets[ticketPosition])
    return res.status(200)
})

app.post('/createCategory', function (req, res) {
    const status = req.body.category
    category.push(status)
    return res.status(200)
})

app.post('/deleteCategory', function (req, res) {
    const delStatus = req.body.status
    const statusIndex = category.indexOf(delStatus)
    category.splice(statusIndex, statusIndex)
    return res.status(200)
})

app.get('/getTickets', function (req, res) {
    const filtered = tickets.filter(el => el.status == 'Отремонтировано')
    return res.send(filtered).status(200)
})

// Генерация уникального идентификатора для заявок
const uidGen = () => {
    const key = 'abcdefgtyhriop[]azxcnm,./1234567890-='
    let uid = ''
    while (uid.length < 6) {
        uid += Math.floor(Math.random() * ( key.length - 1 - 0 + 1))
    }
    return uid
}

app.listen(3000)