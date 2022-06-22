const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModels")

const createBlog = async function (req, res) {
    try{
    let blog = req.body
    if(Object.keys(blog).length==0){
        return res.status(400).send({status: true, msg: "Empty Body. Enter the fields."})
    }
    if( !(blog.title && blog.body && blog.authorId && blog.category) ){
        res.status(404).send({status : false, msg : "Please fill the Mandatory Fields."})
    }
    
    let author = await authorModel.findById(authorId)
    if (!author) {
        return res.status(404).send({ status: false, msg: "author not found." })
    }
    let blogCreated = await blogModel.create(blog)
    res.status(201).send({ Data: blogCreated })
   }catch(err){
      res.status(500).send({ msg : err.message})
   }
}


const getBlog = async (req, res) => {
    try{
    let data = req.query
    if(Object.keys(data).length==0){
        return res.status(400).send({status: true, msg: "Empty Query. Enter the Queries."})
    }

    if( !(data.category || data.title || data.subcategory || data.authorId) ){
         return res.status(404).send({status : false , msg: "No Query Received." })
    }
    let blog = await blogModel.find({$and:[{isDeleted : false}, {isPublished : true}, {$or: [{authorId: data.authorId},{category: data.category }, {tags : data.tags}, {subcategory : data.subcategory}]} ]})
    if(blog.length == 0){
        res.status(404).send({status: false, msg: "No Blog Found."})
    }
    res.send({status: true, msg : blog})
    }
    catch(err){
        res.status(500).send({status: false, msg: err.message})
    }
}


const updatedBlog = async function (req, res) {
    let blogId = req.params.blogId
    let data = req.body
    if(Object.keys(data).length==0){
        return res.status(400).send({status: true, msg: "Empty Body. Enter the fields."})
    }
    let title = req.body.title
    let body = req.body.body
    let tags = req.body.tags
    let subcategory = req.body.subcategory

    let blog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { title, body, tags, subcategory } }, { new: true })

    if (!blog) {
        res.status(404).send({ status: false, msg: "blog not found." })
    }
    res.status(200).send({status : true , data : blog})

}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updatedBlog = updatedBlog