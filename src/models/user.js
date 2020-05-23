const mongoose = require('mongoose')

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
},{
    timestamps: true
})


const User = mongoose.model('User',userSchema)

module.exports = User