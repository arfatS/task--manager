const express = require('express')
const router = express.Router()

const { ensureAuthenticated } = require('../../config/auth')
const Task = require('../models/task')

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('tasks/add',{
        user: req.user
    })
})

router.get('/update/:id', ensureAuthenticated, (req, res) => {
    const _id = req.params.id
    
    Task.findById(_id)
    .then((task) => {
        res.render('tasks/update',{
            user: req.user,
            task
        })
    })
    .catch((error) => {
        res.send({ error })
    })
})

//Add task
router.post('/add', (req, res) => {
    const { name, description } = req.body
    
    const task = new Task({
        name,
        description,
        user_id: req.user._id
    })

    task.save()
    .then((task) => {
        res.redirect('/users/tasks')
    })
    .catch((error) => {
        res.send({ error })
    })
})

//Update task
router.post('/update', (req, res) => {
    const { name, description, id } = req.body
    
    Task.findByIdAndUpdate(id,{
        name,
        description
    })
    .then((task) => {
        res.redirect('/users/tasks')
    })
    .catch((error) => {
        res.send({ error })
    })
})

//Delete task
router.post('/delete', (req, res) => {
    Task.findByIdAndDelete(req.body.id)
    .then((task) => {
        res.redirect('/users/tasks')
    })
    .catch((error) => {
        res.send({ error })
    })
})

module.exports = router
