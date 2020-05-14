const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const emails = require('../emails/account')

const router = new express.Router()

router.post('/users', async (req, res) => {
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

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/profile', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        res.status(400).send({ error: "Invalid update operation..."})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
       res.status(400).send() 
    }
})

router.delete('/users/profile', auth, async (req, res) => {
    try {
        await req.user.remove()
        emails.sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(400).send() 
    }
})

//File uploads
const upload = multer({
    // dest: 'pictures',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid file type'))
        }

        cb(undefined, true)
    }
})

router.post('/users/profile/picture', auth, upload.single('picture'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.picture = buffer
    await req.user.save()

    res.send()
},(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/profile/picture', auth, async (req, res) => {
    req.user.picture = undefined
    await req.user.save()
    res.send()    
})

router.get('/users/:id/picture', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.picture) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.picture)

    } catch (error) {
        res.status(400).send({error})
    }
})

module.exports = router