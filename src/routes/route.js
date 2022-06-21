const express = require('express');
const router = express.Router();
const authorController= require("../controller/authorController")
const blogController= require("../controller/blogController")


router.post("/users", authorController.createAuthor  )
router.post("/blogs", blogController.createBlog  )
module.exports = router;