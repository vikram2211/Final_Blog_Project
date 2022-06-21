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


const getBlog = async (req, res) => {
    let authorId = req.query["authorId"]
    if (!authorId) authorId = req.query["authorid"]
    console.log(authorId)
    let category = req.query.category
    let tags = req.query.tags
    let subcategory = req.query.subcategory
    let author = await blogModel.find({ authorId }, { isDeleted: false }, { isPublished: true });

    console.log(author)
    if (author.length == 0) {
        return res.status(404).send({ status: false, msg: "author not found." })
    }

    // let result = author.map((ele, ind) => {
    //     if (ele[ind].isDeleted == false && ele[ind].isPublished == true) {

    //         return ele;

    //     }
    // })
    // console.log(result)
    res.status(200).send({ status: true, data: author })
}


const updatedBlog = async function (req, res) {
    let blogId = req.params.blogId
    let tags = req.body.tags
    let subcategory = req.body.subcategory

    let blog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { tags, subcategory } }, { new: true })

    if (!blog) {
        res.status(404).send({ status: false, msg: "blog not found." })
    }
    res.status(200).send({status : true , data : blog})

}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updatedBlog = updatedBlog