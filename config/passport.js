const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../src/models/user')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'

        },(email, password, done) => {


            // Verify callback - done(error, user, message)

            //Find by email
            User.findOne({ email })
            .then((user) => {

                if (!user) {
                    return done(null, false, { message: 'Email not registered' })
                }

                //Match password
                bcrypt.compare(password, user.password, (error, isMatch) => {
                    if (error) {
                        throw error
                    }

                    if(isMatch){
                        return done(null, user)
                    }else{
                        return done(null, false, { message: 'Incorrect password' })
                    }
                })
            })
            .catch((error) => {
                console.log(error)
            })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}