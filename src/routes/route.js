const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const auth= require("../middleware/auth.js")



//      <------------------Final Api Structure----------------------->

// router.route('/')
// .get("/blogs", auth.Authenticate,  auth.testing,  blogController.getBlog)
// .post("/blogs", auth.Authenticate, auth.testing, blogController.createBlog)
// .delete('/blogs',  auth.Authenticate, auth.blogQueryValid, auth.testing, blogController.deleteBlogByFields)



//<-------------This API used for Create Author---------------->//
router.post("/authors", authorController.createAuthor)

//<--------------This API used for Log in Author------------------>//
router.post("/login", authorController.authorLogin)


                    // <------------Blogs Api's------------------->//

// router.route('/')
// .put("/blogs/:blogId", auth.Authenticate, auth.testing, blogController.updatedBlog)
// .delete('/blogs/:blogId', auth.Authenticate,auth.testing, blogController.deleteBlog)

   // <-----------------404 Not Found--------------------->//
                    


//<--------------------This API used for Create Blogs-------------->//
router.post("/blogs", auth.Authenticate, auth.testing, blogController.createBlog)  


//<----------------This API used for Fetch Blogs of Logged in Author----------->//
router.get("/blogs", auth.Authenticate,  auth.testing,  blogController.getBlog) 
// auth.blogQueryValid,


//<----------------This API used for Update Blogs of Logged in Author---------->//
router.put("/blogs/:blogId", auth.Authenticate, auth.testing, blogController.updatedBlog)



//<----------------These APIs used for Deleting Blogs of Logged in Author--------->//
router.delete('/blogs/:blogId', auth.Authenticate,auth.testing, blogController.deleteBlog) 
router.delete('/blogs',  auth.Authenticate, auth.blogQueryValid, auth.testing, blogController.deleteBlogByFields)


router.all('/*', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})
                 


// router.route("/products")
// .post("/blogs", auth.Authenticate,  blogController.createBlog)
// .get("/blogs", auth.blogQueryValid, auth.Authenticate, auth.AuthorizationByQuery, blogController.getBlog)


//pass= /\w*\s*|\W|\D/.test(data.password)

module.exports = router;
