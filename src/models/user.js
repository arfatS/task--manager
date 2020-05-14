const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not include "password".')
            }
        }
    },
    age:{
        type: Number,
        default: 0,
        validate(value){
            if (value < 0) {
                throw new Error('Age cannot be negative.')
            }
        }
    },
    picture: {
        type: Buffer
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'user_id'
})

//Methods are accessible on instances
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)

    this.tokens = this.tokens.concat({ token })
    await this.save()
    
    return token
}

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.picture
    
    return userObject
}

//Statics are accessible on models
userSchema.statics.findByCredentials = async (email, password) => {
    const myError = function(error){
        this.error = error
    }
    myError.prototype = new Error();

    const user = await User.findOne({ email })
    if (!user) {
        throw new myError('Unable to login...')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new myError('Unable to login...')
    }

    return user
}

//Password hashing
userSchema.pre('save', async function(next){

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

//Delete tasks when user is remover
userSchema.pre('remove', async function(next){
    await Task.deleteMany({ user_id: this._id})
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User