const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel.js");
const ObjectId = require("mongoose").Types.ObjectId;

let decodedToken;

//<-----------This function is used for Authenticate an Author------------->//

let Authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["X-Api-Key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

    decodedToken = jwt.verify(token, "room13");

    if (!decodedToken) return res.status(400).send({ status: false, msg: "token is invalid" });
    if (req.body.authorId) {
      let id = ObjectId.isValid(req.body.authorId);
      if (!id)
        return res.status(400).send({ status: false, msg: "Enter valid Author Id." }); 
      if (decodedToken.userId == req.body.authorId) return next();
      else return res.status(401).send({ status: false, msg: "Unauthorised!!!" });
    }
    req.tokenId = decodedToken.userId;
    next();

  }catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.Authenticate = Authenticate;




//<-----------------This function is used Authorisation of an Author------------->//


const Authorisation = async (req, res, next) => {
  try{
  const {authorId, tags, category, subcategory} = req.query;
  const blogId = req.params.blogId;
  const data = req.body;
  
  //<-------Passing LoggedIn UserId into Route Handler------>//
  let validAuthor = decodedToken.userId;
  req.userId = validAuthor;

  //<---------------------This is for Query Paramrter----------------->//
  if (Object.keys(req.query)!=0) {
    try {

      //<------Validating AuthorId from Query Parameter------>//
      let validObjectId = ObjectId.isValid(req.query.authorId);


      //<------Fetching The Required Blog Using Query Parameter------->//
      let findAuthorIdObj = {isDeleted : false};
      if(req.query.authorId)
      {
        if(validObjectId && req.query.authorId == validAuthor)
          findAuthorIdObj.authorId = req.query.authorId;
        else if(!validObjectId) return res.status(400).send({status : false, msg : "Invalid Author ID !!! "})
            else return res.status(401).send({status : false, msg : "Unauthorised!!!"})
      }

      //<------Fetching The Filters from Query Parameter-------->//
      if(req.query.tags)
        findAuthorIdObj.tags = req.query.tags;
      if(req.query.category)
        findAuthorIdObj.category = req.query.category;
      if(req.query.subcategory)
        findAuthorIdObj.subcategory = req.query.subcategory;
      let fetchAuthorId = await blogModel.findOne(findAuthorIdObj).select({authorId : 1, _id  : 0})
      
      //<---------Checking Blog Exist or not--------->//
      if(fetchAuthorId != null)
      {
        req.varifiedAuthor = fetchAuthorId.authorId;
        return next();
      }
      return res.status(404).send({msg : "No Data Found !! "})
     
    } catch (err) {

      return res.status(500).send({ status: false, msg: err.message });

    }
  }


  // <---------------This is for Path Paramrter and Request Body----------------->//

  if ((Object.keys(req.body)!=0) || (Object.keys(req.params)!=0)) {
      try {

        //<------This is for Request Body------>//
        if (req.body.authorId) {
          let id = ObjectId.isValid(req.body.authorId);
          if (!id)
            return res.status(400).send({ status: false, msg: "Enter valid Author Id." });
          if (decodedToken.userId == req.body.authorId) return next();
          else return res.status(401).send({ status: false, msg: "Unauthorised!!!" });
        }


        //<------This is for Path Parameter------>//
        let validBlogId = ObjectId.isValid(req.params.blogId);
        req.tokenId = decodedToken.userId;
        let validAuthor = decodedToken.userId;

        let idCheckObj = {};

        //<------Checking BlogId is Valid or Not----->//
        if(req.params.blogId)
        {
          if(!validBlogId)
            return res.status(400).send({status : false, msg : "Invalid Blog Id !!"});
          else idCheckObj.blogId = req.params.blogId;
        }

        //<------Checking Blog is Exist or Not------->//
        let userId = await blogModel.findById(idCheckObj.blogId).select({ authorId: 1, _id: 0 });
        if (!userId) return res.status(400).send({ status: false, msg: "Blog Does not Exist!!!" });
        userId = userId.authorId.toString();
        if (validAuthor != userId) return res.status(401).send({ status: false, msg: "User not Authorised !!!" });

        return next();
       
      } catch (err) {
        return res.status(500).send({ status: false, msg: err.message});
      }}

   return next();

}catch(err){
    return res.status(500).send({status : false, msg : err.message})
  }
};

module.exports.Authorisation = Authorisation;
