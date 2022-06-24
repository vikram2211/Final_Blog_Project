const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModels")
const moment = require('moment')


//<-----------This is used for Field Validation-------------------->//
let valid = function (value) {
  if (typeof value == "undefined" || typeof value == null|| typeof value === "number" || value.length == 0 )
  { 
      return false 
  }
  if( typeof value == "string" ){
      return  true
  }
  return true
}


//<------------------This function is used for Creating a blog----------------->//

const createBlog = async function (req, res) {
  try {
    let blog = req.body
    if (!(blog.title && blog.body && blog.authorId && blog.category)) {
      return res.status(404).send({ status: false, msg: "Please fill the Mandatory Fields." })
    }
    if (!valid(blog.title)) {
      return res.status(400).send({ status: false, message: "Please enter Title." })
    }

    if (!valid(blog.body)){
      return res.status(400).send({ status: false, message: "Please enter Body." })
    }
    if (!valid(blog.tags)){
      return res.status(400).send({ status: false, message: "Please enter Tags." })
    }
    if (!valid(blog.category)){
      return res.status(400).send({ status: false, message: "Please enter Category." })
    }
    if (!valid(blog.subcategory)){
      return res.status(400).send({ status: false, message: "Please enter Subcategory." })
    }    

    let author = await authorModel.findById(blog.authorId)
    if (!author) {
      return res.status(404).send({ status: false, msg: "author not found." })
    }
    let blogCreated = await blogModel.create(blog)
     return res.status(201).send({ Data: blogCreated })
  } catch (err) {
      return res.status(500).send({ msg: err.message })
  }
}

module.exports.createBlog = createBlog

//<---------------This function used for Fetching a Blog--------------->//

const getBlog = async (req, res) => {
  try {
    let data = req.query
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Empty Query. Enter the Queries." })
    }

    if (!(data.category || data.tags || data.subcategory || data.authorId)) {
      return res.status(404).send({ status: false, msg: "No Query Received." })
    }
    let author = req.passData
    let blog = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, { $or: [{ authorId: author.authorId }, { category: data.category }, { tags: data.tags }, { subcategory: data.subcategory }] }] })
    return res.status(200).send({status : true, msg : blog})
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


module.exports.getBlog = getBlog


//<----------------This function is used for Updating a Blog---------->//

const updatedBlog = async function (req, res) {
  let blogId = req.params.blogId
  let data = req.body
  if (Object.keys(data).length == 0) {
    return res.status(400).send({ status: false, msg: "Empty Body. Enter the fields." })
  }
  let title = req.body.title
  let body = req.body.body
  let tags = req.body.tags
  let subcategory = req.body.subcategory

  let blog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { title, body, tags, subcategory } }, { new: true })

  if (!blog) {
    return res.status(404).send({ status: false, msg: "blog not found." })
  }
  return res.status(200).send({ status: true, data: blog })

}

module.exports.updatedBlog = updatedBlog


//<----------This function is used for Deleting a blog by BlogId------------>//

const deleteBlog = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    let blog = await blogModel.findOneAndUpdate(
      { $and: [{ _id: blogId }, { isDeleted: false }] },
      { $set: { isDeleted: true, deletedAt: moment().format(), isPublished: false } },
      { new: true }
    );
    if (!blog) {
      return res
        .status(400)
        .send({ status: false, msg: "Sorry no record Found !" });
    }
    res.status(200).send();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.deleteBlog = deleteBlog


//<------------This function is used for Deleting a Blog by Query Parameter----------->//



const deleteBlogByFields = async (req, res) => {
   let validAuthor = req.userId
    if (Object.keys(req.query).length == 0) {
      return res.status(400).send({ status: false, msg: "Empty query. Enter the fields." })
    }
//------------------------------------------------------------//
    let blog = await blogModel.updateMany(
      {authorId : validAuthor},
      { $set: { isDeleted: true, deletedAt: moment().format(), isPublished: false } },
      {new: true}
    )
//------------------------------------------------------------------//
res.status(200).send()
 
};

module.exports.deleteBlogByFields = deleteBlogByFields
