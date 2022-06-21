const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")


router.post("/authors", authorController.createAuthor)
router.post("/createBlogs", blogController.createBlog)
router.get("/getBlog", blogController.getBlog)
router.put("/updateBlog/:blogId", blogController.updatedBlog)
module.exports = router;