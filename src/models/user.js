const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        email: unique,
        required: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    age:{
        type: Number,
        default: 0,
    },
    picture: {
        type: Buffer
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'user_id'
})

const User = mongoose.model('User',userSchema)

module.exports = User