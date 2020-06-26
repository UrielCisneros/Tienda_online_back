const { Router } = require('express');
const router = Router();

const { 
    subirImagen,
    crearCarousel,
    obtenerCarousel,
    actualizarCarousel, 
    eliminarCarousel
} = require('../controllers/carousel.controllers');

router.route('/nuevo/:idProducto')
    .post(subirImagen, crearCarousel)

router.route('/:idCarousel')
    .get(obtenerCarousel)
    .put(subirImagen, actualizarCarousel)
    .delete(eliminarCarousel)


module.exports = router;