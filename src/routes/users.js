const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

const { ensureAuthenticated, checkAuth } = require('../../config/auth')
const User = require('../models/user')
const Task = require('../models/task')

router.get('/signup', checkAuth, (req, res) => {
    res.render('users/signup')
})

router.get('/login', checkAuth, (req, res) => {
    res.render('users/login')
})

router.get('/tasks', ensureAuthenticated, (req, res) => {

    req.user.populate({
        path: 'tasks',

    }).execPopulate()
    .then(() => {
        res.render('users/tasks',{
            user: req.user
        })
    })
    .catch((error) => {
        res.send({ error })
    })
})

router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('users/profile',{
        user: req.user
    })
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    if (!req.user.isAdmin) {
        res.redirect('/users/tasks')
    }else{

        User.find()
        .then((users) => {

            
            res.render('users/dashboard',{
                user: req.user,
                users,
            })
        })
        .catch((error) => {
            res.send({ error })
        })
    }
})



//Register user
router.post('/signup', (req,res) => {
    const { name, email, password } = req.body
    let errors = []

    //Required fields
    if (!name || !email || !password) {
        errors.push({ message: 'Please fill in all the fields'})
    }

    if (errors.length > 0) {
        res.render('users/signup', { errors })

    }else{
        //Find user with email
        User.findOne({ email })
        .then((user) => {

            //If emails exists
            if (user) {
                errors.push({ message: 'Email already exists'})
                res.render('users/signup', { errors })

            }else{
                //Create new user
                const user = new User({
                    name,
                    email,
                    password
                })
                //Hash password
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(user.password, salt, (error, hash) => {
                        if (error) {
                            throw error
                        }
                        user.password = hash

                        //Save and Redirect
                        user.save()
                        .then((user) => {
                            req.flash('success_msg', 'Registered successfully')
                            res.redirect('/users/login')
                        })
                        .catch((error) => {
                            res.send({ error })
                        })
                    })
                })
            }
        })
        .catch((error) => {
            res.send({ error })
        })
    }

})

//Login user
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/users/tasks',
        failureRedirect: '/users/login',
        failureFlash: 'Please fill in all the fields'
    })(req, res, next)
})



//Logout user
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Logged out successfully')
    res.redirect('/users/login')
})

//Update user
router.post('/profile', (req, res) => {

    //No need of findById as we have user in req.user

    const updates = Object.keys(req.body)

    updates.forEach((update) => req.user[update] = req.body[update])

    req.user.save()
    .then((user) => {
        req.flash('success_msg', 'Updated successfully')
        res.redirect('/users/profile')
    })
    .catch((error) => {
        res.send({ error })
    })


})

module.exports = router