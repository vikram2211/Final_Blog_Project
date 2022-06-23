const jwt = require("jsonwebtoken");
const blogModel = require('../models/blogModel.js')

let decodedToken

let Authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["X-Api-Key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
        decodedToken = jwt.verify(token, "room13");
        if (!decodedToken)
            return res.status(400).send({ status: false, msg: "token is invalid" });
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

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


let AuthorizationByQuery = async function (req, res, next) {
        let validAuthor = decodedToken.userId
    //-------------------------------------------//
        req.userId = validAuthor
    //-------------------------------------------//
        let author = await blogModel.find({ $or: [{ authorId: req.query.authorId }, { category: req.query.category }, { tags: req.query.tags }, { subcategory: req.query.subcategory }] }).select({ authorId: 1, _id: 0 })
        let userId = author.map(function (ele) {
            return `${ele.authorId}`
        })
 
        let id = userId.map(ele => {
            if (ele == validAuthor) {
                return true
            } else {
                return false
            }
        })
        if (id.includes(true)) {
            next()
        } else {
            return res.status(403).send({ status: false, msg: "You Are not authorised!!!" })
        }
   
}

module.exports.Authenticate = Authenticate
module.exports.Authorization = Authorization
module.exports.AuthorizationByQuery = AuthorizationByQuery


