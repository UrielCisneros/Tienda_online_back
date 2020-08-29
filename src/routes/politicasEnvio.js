const { Router } = require('express');
const router = Router();
const { getPoliticas,createPoliticas,updatePoliticas } = require('../controllers/politicasEnvio.controllers');
const auth = require('../middleware/auth');

router.route('/')
    .get(getPoliticas)//Get all admin dates
    .post(createPoliticas);//Add a admin 


router.route('/:id')
    .put(updatePoliticas)//Update a admin

module.exports = router;