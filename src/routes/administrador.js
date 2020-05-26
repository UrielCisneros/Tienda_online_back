const { Router } = require('express');
const router = Router();
const { getAdmins, deleteAdmin, createAdmin, getAdmin, updateAdmin } = require('../controllers/administrador.controllers');


router.route('/')
    .get(getAdmins)//Get all admin dates
    .post(createAdmin);//Add a admin 


router.route('/:id')
    .get(getAdmin)//Get one admin dates
    .put(updateAdmin)//Update a admin
    .delete(deleteAdmin);//Delete a admin

module.exports = router;