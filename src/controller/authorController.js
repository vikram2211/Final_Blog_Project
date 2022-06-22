const authorModel = require("../models/authorModels")
const validator = require('validator')


const createAuthor = async function (req, res) {
    try{
    let author = req.body
    
    let email = req.body.emailId

    if( !(author.fname && author.lname && author.password && author.emailId) ){
        res.status(404).send({status : false, msg : "All fields are mandatory."})
    }
    let emailValidate = validator.isEmail(req.body.emailId);
    let duplicate = await authorModel.findOne({email})
    if(duplicate){
       return res.status(400).send({status: false, msg : "Email Already Exist."}) 
    }
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
