const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {
    fname: {
        type:String,
        required:true
    },
    lname: {
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
    password:{
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('author', authorSchema)