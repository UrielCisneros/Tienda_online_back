const { Router } = require('express');
const router = Router();

const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('../controllers/blog.controllers');



router.route('/')
    .get(getBlogs)//Get de all blog dates
    .post(createBlog);//Add a new blog


router.route('/:id')
    .get(getBlog)//Get one blog dates
    .put(updateBlog)//Update a blog
    .delete(deleteBlog);//Delete a blog

module.exports = router;