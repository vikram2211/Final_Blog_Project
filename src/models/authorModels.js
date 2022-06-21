

const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    title:{
        type:string,
        required:true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    emailId: {
        type:String,
        required:true,
        unique: true,

    },
    mobile: {
        type: String,

        required: true
    },
    emailId: String,
    password: String,
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    password:{
        required:true
    },
    age: Number,
}, { timestamps: true });

module.exports = mongoose.model('author', authorSchema)