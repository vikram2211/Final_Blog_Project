const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModels");
const moment = require("moment");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//<-----------This is used for Field Validation-------------------->//
let valid = function (value) {
  if (
    typeof value == "undefined" || typeof value == null || typeof value === "number" || value.length == 0)
    return false;
  if (typeof value == "string") return true;

  return true;
};

//<------------------This function is used for Creating a blog----------------->//

const createBlog = async function (req, res) {
  try {

    //<-------Checking Whether Request Body is empty or not----------->//
    let blog = req.body;
    if (!(blog.title && blog.body && blog.authorId && blog.category))
      return res.status(400).send({ status: false, msg: "Please fill the Mandatory Fields." });
    let validating

    //<-------Validation of Blog title----------->//
    if (!valid(blog.title))
      return res.status(400).send({ status: false, message: "Please enter Blog Title." });
    //let validating = /^[A-Za-z]{6,}$/.test(blog.title.trim())
   // [A-Za-z]
    //if (!validating) return res.send({ status: false, message: "Please enter Valid Blog Title." })

    //<-------Validation of Body of Blog----------->//
    if (!valid(blog.body))
      return res.status(400).send({ status: false, message: "Please enter Body of Blog." });
     validating = /^[A-Za-z0-9]+$/.test(blog.body.trim())


    //<-------Validation of Tags of Blog----------->//
    if (!valid(blog.tags))
      return res.status(400).send({ status: false, message: "Please enter Tags of The Blog." });
    validating = /^[A-Za-z]+$/.test(blog.tags)
    if (!validating) return res.send({ status: false, message: "Please enter Valid Tags of The Blog." })


    //<-------Validation of Category of Blog----------->//
    if (!valid(blog.category))
      return res.status(400).send({ status: false, message: "Please enter Category of The Blog." });
    validating = /^[A-Za-z]+$/.test(blog.category)
    if (!validating) return res.send({ status: false, message: "Please enter Valid Category of The Blog." })


    //<-------Validation of Subcategory of Blog----------->//
    if (!valid(blog.subcategory))
      return res.status(400).send({ status: false, message: "Please enter Subcategory of The Blog." })
    validating = /^[A-Za-z]+$/.test(blog.subcategory)
    if (!validating)
      return res.status(400).send({ status: false, message: "Please enter Valid Subcategory of The Blog." })


    //<-------Validation of AuthorId of The Blog----------->//
    let author = await authorModel.findById(blog.authorId);
    if (!author)
      return res.status(404).send({ status: false, msg: "Author not found." });


    //<-------Blog Creation----------->//
    let blogCreated = await blogModel.create(blog);
    return res.status(201).send({ status : true, data: blogCreated });

  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

module.exports.createBlog = createBlog;


//<---------------This function used for Fetching a Blog--------------->//

const getBlog = async (req, res) => {
  try {

    //<------Acquiring UserId from Decoded Token------->//
    let validAuthorId = req.userId;
    let data = req.query

    if (Object.keys(req.query) == 0) {
      let blog = await blogModel.find({ authorId: validAuthorId, isDeleted: false })
      if (blog.length == 0) return res.status(404).send({ status: false, msg: "No Blog Found!!!" })
      return res.status(200).send({ status: true, msg: blog })
    }

    let { authorId, tags, category, subcategory } = req.query;
    let Objectid = mongoose.Types.ObjectId(authorId)

    let addObj = { isDeleted: false, isPublished: true }
    addObj.authorId = validAuthorId;

    if (!Objectid) {
      return res.status(400).send({ status: false, msg: "Author is Not Valid !" })
    }


    if (tags) {
      addObj.tags = tags;
    }
    if (category) {
      addObj.category = category;
    }
    if (subcategory) {
      addObj.subcategory = subcategory
    }
    let blog = await blogModel.find(addObj)
    if (blog.length == 0) return res.status(404).send({ status: false, msg: "Blog Not Found." })
    return res.status(200).send({ status: true, data: blog })
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.getBlog = getBlog;

//<----------------This function is used for Updating a Blog---------->//

const updatedBlog = async function (req, res) {
  try {
    let blogId = ObjectId.isValid(req.params.blogId);
    let obj = {};
    if (req.params.blogId) {
      if (!blogId) return res.status(404).send({ status: false, msg: "Invalid BlogId !!" });
      else obj.blogId = req.params.blogId;
    }
    let data = req.body;


    if (!(data.title || data.body || data.tags || data.subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "Mandatory fields are requird !!! " });
    }
    const { body, title, tags, subcategory , isPublished} = req.body;
    const dataObj = { isPublised : isPublished, updatedAt: moment().format() };
    if (title) dataObj.title = title;
    if (body) dataObj.body = body
    if (tags) dataObj.tags = tags
    if (subcategory) dataObj.subcategory = subcategory

    if(isPublished != undefined)
    {
      dataObj['isPublished']= isPublished;
      dataObj['isPublished '] =  isPublished ? dataObj.publishedAt = moment().format() : dataObj.publishedAt = null;
    }
  
    let blog = await blogModel.findOneAndUpdate(
      { _id: obj.blogId, isDeleted: false },
      { $set: dataObj ,  },
      { new: true }
    );
    
    if (!blog) return res.status(404).send({ status: false, msg: "blog not found." });

    return res.status(200).send({ status: true, message : "Updated Successfuly", data: blog });
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
};

module.exports.updatedBlog = updatedBlog;



//<----------This function is used for Deleting a blog by BlogId------------>//

const deleteBlog = async (req, res) => {
  try {
    let blogId = ObjectId.isValid(req.params.blogId);
    let obj = {};
    if (req.params.blogId) {
      if (!blogId) return res.status(404).send({ status: false, msg: "Invalid BlogId !!" });
      else obj.blogId = req.params.blogId;
    }

    const dataObj = { isPublished: false, isDeleted: true, deletedAt: moment().format() };

    let blog = await blogModel.findOneAndUpdate(
      { _id: obj.blogId, isDeleted: false },
      { $set: dataObj },
      { new: true }
    );
    if (!blog) return res.status(404).send({ status: false, msg: "No Blog Found !!!" });

    res.status(200).send({status: true});
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.deleteBlog = deleteBlog;

//<------------This function is used for Deleting a Blog by Query Parameter----------->//

const deleteBlogByFields = async (req, res) => {
  try {

    let verifiedAuthorId = req.varifiedAuthor
    let addObj = { isDeleted: false }
    let deletedObj = { isDeleted: true, isPublished: false };

    deletedObj.deletedAt = moment().format();


    const { authorId, tags, category, subcategory } = req.query;
    let Objectid = mongoose.Types.ObjectId(authorId)

    if (Object.keys(req.query).length == 0) 
       return res.status(400).send({ status: false, msg: "Invalid Input!!!" });

    if (authorId) {
      if (Objectid && authorId == verifiedAuthorId) addObj.authorId = authorId;
      else if (!Objectid) 
        return res.status(400).send({ status: false, msg: "Author is Not Valid !" })
    }
    if (tags) addObj.tags = tags;
    if (category) addObj.category = category;
    if (subcategory) addObj.subcategory = subcategory

    let blog = await blogModel.find(addObj).updateMany({ $set: deletedObj })

    return res.status(200).send({status : true});

  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}



module.exports.deleteBlogByFields = deleteBlogByFields;



