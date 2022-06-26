const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModels");
const moment = require("moment");
const { default: mongoose } = require("mongoose");

//<-----------This is used for Field Validation-------------------->//
let valid = function (value) {
  if (
    typeof value == "undefined" ||
    typeof value == null ||
    typeof value === "number" ||
    value.length == 0
  ) {
    return false;
  }
  if (typeof value == "string") {
    return true;
  }
  return true;
};

//<------------------This function is used for Creating a blog----------------->//

const createBlog = async function (req, res) {
  try {
    //<-------Checking Whether Request Body is empty or not----------->//
    let blog = req.body;
    if (!(blog.title && blog.body && blog.authorId && blog.category)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please fill the Mandatory Fields." });
    }
    //<-------Validation of Blog title----------->//
    if (!valid(blog.title)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter Blog Title." });
    }
    let validating = /^[A-Za-z]+$/.test(blog.title.trim())
    if (!validating) return res.send({ status: false, message: "Please enter Valid Blog Title." })

    //<-------Validation of Body of Blog----------->//
    if (!valid(blog.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter Body of Blog." });
    }
    validating = /^[A-Za-z0-9]+$/.test(blog.body.trim())

    //<-------Validation of Tags of Blog----------->//
    if (!valid(blog.tags)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter Tags of The Blog."});
    }
    validating = /^[A-Za-z]+$/.test(blog.tags)
    if (!validating) return res.send({ status: false, message: "Please enter Valid Tags of The Blog."})

    //<-------Validation of Category of Blog----------->//
    if (!valid(blog.category)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter Category of The Blog." });
    }
    validating = /^[A-Za-z]+$/.test(blog.category)
    if (!validating) return res.send({ status: false, message: "Please enter Valid Category of The Blog." })


    //<-------Validation of Subcategory of Blog----------->//
    if (!valid(blog.subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter Subcategory of The Blog." });
    }
    validating = /^[A-Za-z]+$/.test(blog.subcategory)
    if (!validating){
          return res
          .status(400)
          .send({ status: false, message: "Please enter Valid Subcategory of The Blog." })
    }

    
    //<-------Validation of AuthorId of The Blog----------->//
    let author = await authorModel.findById(blog.authorId);
    if (!author) {
      return res.status(404).send({ status: false, msg: "author not found." });
    }


    //<-------Blog Creation----------->//
    let blogCreated = await blogModel.create(blog);
    return res.status(201).send({ Data: blogCreated });

  } catch (err) {
        return res.status(500).send({ msg: err.message });
  }
};

module.exports.createBlog = createBlog;

//<---------------This function used for Fetching a Blog--------------->//


const getBlog = async (req, res) => {
  try {
    
    let validAuthorId = req.userId;
    let data = req.query

    let {authorId, tags, category, subcategory} = req.query;
    let Objectid = mongoose.Types.ObjectId(authorId)
    
    console.log(authorId,"AuthorID input")
    let addObj = { isDeleted: false , isPublished : true}
    addObj.authorId = validAuthorId;
    console.log("object",addObj)
    console.log("query id",data.authorId)
    
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
    console.log("object",addObj)
    console.log("query id",data.authorId)
   console.log(validAuthorId)
   let blog = await blogModel.find(addObj )
   console.log("The Object",addObj)
    //console.log(`Final Data ${blog}`)
   if(blog.length == 0) return res.status(404).send({status : false, msg: "Blog Not Found."})
   return res.status(200).send({status: true, msg : blog})
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.getBlog = getBlog;

//<----------------This function is used for Updating a Blog---------->//

const updatedBlog = async function (req, res) {
  let blogId = req.params.blogId;
  let data = req.body;
  if (Object.keys(data).length == 0) {
    return res
      .status(400)
      .send({ status: false, msg: "Empty Body. Enter the fields." });
  }
  let title = req.body.title;
  let body = req.body.body;
  let tags = req.body.tags;
  let subcategory = req.body.subcategory;

  let blog = await blogModel.findOneAndUpdate(
    { _id: blogId },
    { $set: { title, body, tags, subcategory } },
    { new: true }
  );

  if (!blog) {
    return res.status(404).send({ status: false, msg: "blog not found." });
  }
  return res.status(200).send({ status: true, data: blog });
};

module.exports.updatedBlog = updatedBlog;

//<----------This function is used for Deleting a blog by BlogId------------>//

const deleteBlog = async (req, res) => {
  try {
    let blogId = req.params.blogId;
    let blog = await blogModel.findOneAndUpdate(
      { $and: [{ _id: blogId }, { isDeleted: false }] },
      {
        $set: {
          isDeleted: true,
          deletedAt: moment().format(),
          isPublished: false,
        },
      },
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

module.exports.deleteBlog = deleteBlog;

//<------------This function is used for Deleting a Blog by Query Parameter----------->//

const deleteBlogByFields = async (req, res) => {
  let validAuthor = req.userId;
  let addObj = { isDeleted: false }
  let deletedObj = { isDeleted: true, isPublished: false };

  deletedObj.deletedAt = moment().format();


  const { authorId, tags, category, subcategory } = req.query;
  let Objectid = mongoose.Types.ObjectId(authorId)

  if (Object.keys(req.query).length == 0) {
    return res
      .status(400)
      .send({ status: false, msg: "Empty query. Enter the fields." });
  }

  if (authorId) {
    if (Objectid && authorId == validAuthor) {
      addObj.authorId = authorId;
    }
    else if (!Objectid) {
      return res.status(400).send({ status: false, msg: "Author is Not Valid !" })
    }
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

  let blog = await blogModel.find(addObj).updateMany({ $set: deletedObj })


  return res.status(200).send();
}



module.exports.deleteBlogByFields = deleteBlogByFields;


// objectId Validation
