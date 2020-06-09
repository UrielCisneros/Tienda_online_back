const { Router } = require('express');
const router = Router();

const { subirImagen, getGaleria, createGaleria ,createImagen, updateGaleria, deleteGaleria, deleteImagen } = require('../controllers/galeria.controllers');

router.route('/:idProducto')
    .post(subirImagen, createGaleria)

router.route('/:idGaleria')
    .get(getGaleria)
    .post(subirImagen, createImagen)  

router.route('/:idGaleria/imagen/:num_imagen')
    .put(updateGaleria) //updateimage AUN FALTA
    .delete(deleteImagen)


module.exports = router;