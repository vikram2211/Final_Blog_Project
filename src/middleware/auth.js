const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel.js");
const ObjectId = require("mongoose").Types.ObjectId;

let decodedToken;

//<-----------This function is used for Authenticate an Author------------->//

let Authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["X-Api-Key"];
    if (!token)
      return res
        .status(400)
        .send({ status: false, msg: "token must be present" });
    decodedToken = jwt.verify(token, "room13");
    if (!decodedToken)
      return res.status(400).send({ status: false, msg: "token is invalid" });
    if (req.body.authorId) {
      let id = ObjectId.isValid(req.body.authorId);
      if (!id)
        return res
          .status(400)
          .send({ status: false, msg: "Enter valid Author Id." });
      if (decodedToken.userId == req.body.authorId) {
        return next();
      } else {
        return res.status(403).send({ status: false, msg: "Unauthorised!!!" });
      }
    }
    req.tokenId = decodedToken.userId;
    console.log(decodedToken.userId);
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.Authenticate = Authenticate;

//<-----------------This function is used Authorisation of an Author------------->//

let Authorization = async function (req, res, next) {
  try {
    let validAuthor = decodedToken.userId;
    let userId = await blogModel
      .findById(req.params.blogId)
      .select({ authorId: 1, _id: 0 });
    if (!userId)
      return res
        .status(400)
        .send({ status: false, msg: "Blog Does not Exist!" });
    userId = userId.authorId.toString();
    console.log(validAuthor);
    if (validAuthor != userId) {
      return res
        .status(403)
        .send({ status: false, msg: "User not Authorised !" });
    }
    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.Authorization = Authorization;

//<------------This Function is used for Authorization using Query Parameter----------->/

let AuthorizationByQuery = async function (req, res, next) {
  let validAuthor = decodedToken.userId;

  console.log(`Toekn Id from ${validAuthor}`);
  //-------------------------------------------//
  req.userId = validAuthor;
  //-------------------------------------------//

  if (req.query.authorId) {
    if (req.query.authorId == validAuthor) {
      req.userId = validAuthor;
      return next();
    } else {
      return res
        .status(403)
        .send({ status: false, msg: " Sorry You are not Authorised !!" });
    }
  }
  next();
};

module.exports.AuthorizationByQuery = AuthorizationByQuery;

//<--------------This function is used for Checking Existing Blog------------->

const blogQueryValid = async function (req, res, next) {
  //<---------Checking Query Parameter is Not Empty------->//
  try {
    let data = req.query;
    let validAuthor = decodedToken;
    console.log("DecodedToken", validAuthor.userId);
    //console.log(data.authorId)
    if (!(data.category || data.tags || data.subcategory || data.authorId)) {
      return res.status(404).send({ status: false, msg: "No Query Received." });
    }
    //decodedToken = jwt.verify(token, "room13");
    if (req.query.authorId) {
      if (decodedToken.userId != req.query.authorId) {
        return res
          .status(403)
          .send({ status: false, msg: "Unauthorised Author." });
      }
    }

    //<-------Checking Blog is Deleted or Not-------------->//
    let blog = await blogModel.find({
      $and: [
        { isDeleted: false },
        {
          $or: [
            { authorId: data.authorId },
            { category: data.category },
            { tags: data.tags },
            { subcategory: data.subcategory },
          ],
        },
      ],
    });
    if (blog.length == 0) {
      return res.status(404).send({ status: false, msg: "No Blog Found." });
    }
    return next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.blogQueryValid = blogQueryValid;

const testing = async (req, res, next) => {
  const {authorId, tags, category, subcategory} = req.query;
  const blogId = req.params.blogId;
  const data = req.body;
  console.log(req.query)

  // <---------------------This Auth for Post Api----------------->//
  if (req.query) {
    try {
      let validAuthor = decodedToken.userId;

      console.log(`Toekn Id from ${validAuthor}`);
      let validObjectId = ObjectId.isValid(req.query.authorId);
      //-------------------------------------------//
      req.userId = validAuthor;
      //-------------------------------------------//
      let findAuthorIdObj = {isDeleted : false};
      if(req.query.authorId)
      {
        console.log(`AuthorID ${req.query.authorId}`)
        if(validObjectId && req.query.authorId == validAuthor)
        {
          findAuthorIdObj.authorId = req.query.authorId;
        }
        else if(!validObjectId){
          return res.status(404).send({status : false, msg : "Invalid Author ID !!! "})
        }
        else
        {
          return res.status(400).send({status : false, msg : "bhai jab tu authorised nahi hai to q ungli kr rhe ho 😡"})
        }
      }
      if(req.query.tags)
      {
        findAuthorIdObj.tags = req.query.tags;
      }
      if(req.query.category)
      {
        findAuthorIdObj.category = req.query.category;
      }
      if(req.query.subcategory)
      {
        findAuthorIdObj.subcategory = req.query.subcategory;
      }
      console.log(findAuthorIdObj)
      let fetchAuthorId = await blogModel.findOne(findAuthorIdObj).select({authorId : 1, _id  : 0})
      // console.log(fetchAuthorId.authorId)
      if(fetchAuthorId != null)
      {
        req.varifiedAuthor = fetchAuthorId.authorId;
        return next();
      }
      return res.status(404).send({msg : "No Data Found !! "})

      // if (req.query) {
      //   if (validAuthor) {
      //     // req.userId = validAuthor;
      //     return next();
      //   } else {
      //     return res
      //       .status(403)
      //       .send({ status: false, msg: " Sorry You are not Authorised !!" });
      //   }
      // }
     
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, msg: err.message, text : "hcdbucdsuycguy" });

    }
  }
  if (req.body || req.params) {
    try {
      let token = req.headers["x-api-key"];
      if (!token) token = req.headers["X-Api-Key"];
      if (!token)
        return res
          .status(400)
          .send({ status: false, msg: "token must be present" });
      decodedToken = jwt.verify(token, "room13");
      if (!decodedToken)
        return res.status(400).send({ status: false, msg: "token is invalid" });
      if (req.body.authorId) {
        let id = ObjectId.isValid(req.body.authorId);
        if (!id)
          return res
            .status(400)
            .send({ status: false, msg: "Enter valid Author Id." });
        if (decodedToken.userId == req.body.authorId) {
          return next();
        } else {
          return res
            .status(403)
            .send({ status: false, msg: "Unauthorised!!!" });
        }
      }
      let validBlogId = ObjectId.isValid(req.params.blogId);
      req.tokenId = decodedToken.userId;
      let validAuthor = decodedToken.userId;
      console.log(decodedToken.userId);
      let idCheckObj = {};
      if(req.params.blogId)
      {
        if(!validBlogId)
        {
          return res.status(404).send({status : false, msg : "Invalid Id !!"});
        }
        else
        {
          idCheckObj.blogId = req.params.blogId;
        }
      }
      console.log(idCheckObj)
      let userId = await blogModel
      .findById(idCheckObj.blogId)
      .select({ authorId: 1, _id: 0 });
      if (!userId)
      return res
        .status(400)
        .send({ status: false, msg: "Blog Does not Exist! from params" });
      userId = userId.authorId.toString();
      console.log(validAuthor);
      if (validAuthor != userId) {
      return res
        .status(403)
        .send({ status: false, msg: "User not Authorised !" });
    }
      next();
    } catch (err) {
      return res.status(500).send({ status: false, msg: err.message, data : "frm Auhtjorsisatudscjhds"});
    }
  }
 
};

module.exports.testing = testing;
