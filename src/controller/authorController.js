const authorModel = require("../models/authorModels")
const validator = require('validator')


const createAuthor = async function (req, res) {
    try{
    let author = req.body
    if( !(author.fname && author.lname && author.password && author.emailId) ){
        res.status(404).send({status : false, msg : "All fields are mandatory."})
    }
    let emailValidate = validator.isEmail(req.body.emailId);
    if(!emailValidate){   
        res.status(404).send({ status: false, msg :"Incorrect Email!"})
    } 
    let authorCreated = await authorModel.create(author)
    res.status(201).send({ status : true ,Data: authorCreated })
    }catch(err){
        res.status(500).send({ msg: err.message})
    }
}




module.exports.createAuthor = createAuthor
