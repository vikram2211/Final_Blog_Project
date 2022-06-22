const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModels")

const createBlog = async function (req, res) {
    try{
    let blog = req.body
    let authorId = req.body.authorId
    let title = blog.title.toLowerCase()
    let body = blog.body.toLowerCase()
    let tags = blog.tags.toLowerCase()
    let category = blog.category.toLowerCase()
    let subcategory = blog.subcategory.toLowerCase()
    if( !(title && body && authorId && category) ){
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
    console.log(data)
    //console.log(req.query)
    //if(Object.keys(data) == 0) return res.status(404).send({status: false, msg : "Incomplete data."})
    if( !(data.category || data.tags || data.subcategory || data.authorId) ){
         return res.status(404).send({status : false , msg: "No Query Received." })
    }
    let blog = await blogModel.find({$and:[{isDeleted : false}, {isPublished : true}, {$or: [{authorId: data.authorId},{category: data.category},{tags: data.tags},{subcategory: data.subcategory}]} ]})
    console.log(blog)
    if(blog.length == 0){
        res.status(404).send({status: false, msg: "No Blog Found."})
    }
    res.send({status: true, msg : blog})

    // let authorId = req.query["authorId"]
    // if (!authorId) authorId = req.query["authorid"]
    // let category = req.query["Category"]
    // if (!category) category = req.query["category"]
    // let tags = req.query["Tags"]
    // if (!tags) tags = req.query["tags"]
    // let subcategory = req.query["Subcategory"]
    // if (!subcategory) subcategory = req.query["subcategory"]
    // let queryData = {}
    // console.log(authorId)
    // console.log(category, tags , subcategory)
    // if(Object.keys(authorId) != 0 ){
    //     queryData.authorId = authorId
    //     console.log(queryData) 
    // }
    // if(!category){
    //     queryData.category = category
    //    //console.log(queryData) 
    // }
    // if(!tags){
    //     queryData.tags = tags
    //    // console.log(queryData) 
    // }
    // if(!subcategory){
    //     queryData.subcategory = subcategory
    //     //console.log(queryData) 
    // }
    // let result = await blogModel.find({queryData}, {isDeleted : false}, {isPublished : true})
    // res.status(200).send({ status: true, data: result })
    }catch(err){
        res.status(500).send({status: false, msg: err.message})
    }
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