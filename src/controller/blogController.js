const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModels")

const createBlog = async function (req, res) {
    let blog = req.body
    let authorId = req.body.authorId
    let author = await authorModel.findById(authorId)
    if (!author) {
        return res.status(404).send({ status: false, msg: "author not found." })
    }
    let blogCreated = await blogModel.create(blog)
    res.status(201).send({ Data: blogCreated })
}




module.exports.createBlog = createBlog