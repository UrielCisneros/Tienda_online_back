const { Router } = require('express');
const router = Router();

const { 
    crearGaleria,
    obtenerGaleria,
    crearImagen, 
    actualizarImagen, 
    eliminarGaleria, 
    eliminarImagen, 
    subirImagen 
} = require('../controllers/galeria.controllers');

router.route('/nueva/:idProducto')
    .post(subirImagen, crearGaleria)

router.route('/:idGaleria')
    .get(obtenerGaleria)
    .post(subirImagen, crearImagen)
    .delete(eliminarGaleria)

router.route('/:idGaleria/imagen/:idImagen')
    .put(subirImagen, actualizarImagen) //updateimage AUN FALTA
    .delete(eliminarImagen)


module.exports = router;