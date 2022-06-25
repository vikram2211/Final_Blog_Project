const jwt = require("jsonwebtoken");
const blogModel = require('../models/blogModel.js')
const ObjectId = require('mongoose').Types.ObjectId

let decodedToken

//<-----------This function is used for Authenticate an Author------------->//

let Authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["X-Api-Key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
        decodedToken = jwt.verify(token, "room13");
        if (!decodedToken)
            return res.status(400).send({ status: false, msg: "token is invalid" });
        if(req.body.authorId){
            let id = ObjectId.isValid(req.body.authorId)
            if(!id) return res.status(400).send({status:false, msg: "Enter valid Author Id."})
            if(decodedToken.userId == req.body.authorId){
                 return next()
            }else{
               return res.status(403).send("Unauthorised!!!")
            }
        }
        req.tokenId = decodedToken.userId
        console.log(decodedToken.userId)
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.Authenticate = Authenticate



//<-----------------This function is used Authorisation of an Author------------->//

let Authorization = async function (req, res, next) {
    try {
        let validAuthor = decodedToken.userId
        let userId = await blogModel.findById(req.params.blogId).select({ authorId: 1, _id: 0 })
        if (!userId) return res.status(400).send({ status: false, msg: "Blog Does not Exist!" })
        userId = userId.authorId.toString()
        console.log(validAuthor)
        if (validAuthor != userId) {
            return res.status(403).send({ status: false, msg: "User not Authorised !" })
        }
        next();
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.Authorization = Authorization


//<------------This Function is used for Authorization using Query Parameter----------->/

let AuthorizationByQuery = async function (req, res, next) {
        let validAuthor = decodedToken.userId
    //-------------------------------------------//
        req.userId = validAuthor
    //-------------------------------------------//
     console.log(validAuthor)
        let author = await blogModel.find({ $or: [{ authorId: validAuthor }, { category: req.query.category }, { tags: req.query.tags }, { subcategory: req.query.subcategory }] }).select({ authorId: 1, _id: 0 })
        let userId = author.map(function (ele) {
            return `${ele.authorId}`
        })
        //console.log(userId)
        let id = userId.map(ele => {
            if (ele == validAuthor) {
                return true
            } else {
                return false
            }
        })
        //console.log(id)
        if (id.includes(true)) {
            req.passData = author[0].authorId.toString()
            console.log(req.passData)
            next()
        } else {
            return res.status(403).send({ status: false, msg: "You Are not authorised!!!" })
        }
   
}

module.exports.AuthorizationByQuery = AuthorizationByQuery


//<--------------This function is used for Checking Existing Blog-------------> 

const blogQueryValid = async function (req, res, next){
    
    //<---------Checking Query Parameter is Not Empty------->//
    let data = req.query
    let validAuthor = decodedToken
    console.log("DecodedToken",validAuthor.userId)
    //console.log(data.authorId)
    if (!(data.category || data.tags || data.subcategory || data.authorId)) {
        return res.status(404).send({ status: false, msg: "No Query Received." });
     }
     //decodedToken = jwt.verify(token, "room13");
     if(req.query.authorId){
     if(decodedToken.userId != req.query.authorId){
        return res.status(403).send({status: false, msg: "Unauthorised Author."})
      }
     }
    
    //<-------Checking Blog is Deleted or Not-------------->//
    let blog = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, { $or: [{ authorId: data.authorId }, { category: data.category }, { tags: data.tags }, { subcategory: data.subcategory }] }] })
    if (blog.length == 0) {
      return res.status(404).send({ status: false, msg: "No Blog Found." })
    }
    return next()

}

module.exports.blogQueryValid = blogQueryValid


