const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    lname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 15
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    emailId: {
        type: String,
        required: true,
        unique: true,      

    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
}, { timestamps: true });

module.exports = mongoose.model('author', authorSchema)