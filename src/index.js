const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')

// const userRouter = require('./routers/user')
// const taskRouter = require('./routers/task')
require('./db/mongoose')

const app = express()
const port = process.env.PORT

const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.use(express.static(publicPath))
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.json())
// app.use(userRouter)
// app.use(taskRouter)

app.use(bodyParser.urlencoded({extended: false}))

app.get('', (req, res) => {
    res.render('index')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/tasks', (req, res) => {
    res.render('tasks')
})

app.get('/profile', (req, res) => {
    res.render('profile')
})

const multer = require('multer')
const sharp = require('sharp')
const User = require('./models/user')
const auth = require('./middleware/auth')
const emails = require('./emails/account')

app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        // emails.sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})












app.get('*', (req,res) => {
    res.send('404 Page not found')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})