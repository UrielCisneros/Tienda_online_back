const { Router } = require('express');
const router = Router();

const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, subirImagen } = require('../controllers/blog.controllers');



router.route('/')
    .get(getBlogs)//Get de all blog dates
    .post(subirImagen, createBlog);//Add a new blog


router.route('/:id')
    .put(subirImagen, updateBlog)//Update a blog
    .delete(deleteBlog);//Delete a blog

router.route('/:url').get(getBlog);//Get one blog dates

module.exports = router;