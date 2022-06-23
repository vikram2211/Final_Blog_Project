const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const auth= require("../middleware/auth.js")


router.post("/authors", authorController.createAuthor)
router.post("/blogs", blogController.createBlog)
router.get("/blogs", blogController.getBlog)
router.put("/blogs/:blogId", auth.Authenticate, auth.Authorization, blogController.updatedBlog)
router.delete('/blogs/:blogId', auth.Authenticate,auth.Authorization, blogController.deleteBlog)
router.delete('/blogs',  blogController.deleteBlogByFields)
// auth.Authenticate,auth.AuthorizationByQuery,

router.post("/login", authorController.authorLogin)
module.exports = router;
