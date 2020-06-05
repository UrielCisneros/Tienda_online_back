const { Router } = require('express');
const router = Router();

const { getGaleria, getGalerias, createGaleria ,createImagen, updateGaleria, deleteGaleria, deleteImagen } = require('../controllers/galeria.controllers');

router.route('/')
    .post(createGaleria)  

router.route('/:idGaleria')
    .get(getGaleria)
    .post(createImagen)  

router.route('/:idGaleria/imagen/:num_imagen')
    .put(updateGaleria) //updateimage AUN FALTA
    .delete(deleteImagen)


module.exports = router;