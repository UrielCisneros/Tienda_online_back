const { Router } = require('express');
const router = Router();


router.route('/')
    .get((req, res) => res.send('get - admin routes'))//Get de all blog dates
    .post((req, res) => res.send('post un blog - admin routes'));//Add a new blog


router.route('/:id')
    .get((req, res) => res.send('post - admin routes'))//Get one blog dates
    .put((req, res) => res.send('put - admin routes'))//Update a blog
    .delete((req, res) => res.send('deleted - admin routes'));//Delete a blog

module.exports = router;