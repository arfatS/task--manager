const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../../config/auth')

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('tasks/add',{
        user: req.user
    })
})

module.exports = router
