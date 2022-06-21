const mongoose = require('mongoose')
const ObjectId = mongoose.schema.Types.ObjectId


const blogSchema = new mongoose.schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }, 
    authorId:{
        type: ObjectId,
        ref: "author",
        required: true
    },
    tags: [ String ],
    category:{
        types: [ String ],
        required: true
    },
    subcategory: [ String ],
    deletedAt: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: String,
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timeStamps: true });

module.exports = mongoose.model('blogs', blogSchema)
