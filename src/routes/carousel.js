const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const { 
    subirImagen,
    crearCarousel,
    obtenerCarousel,
    actualizarCarousel, 
    eliminarCarousel,
    obtenerTodosCarousels
} = require('../controllers/carousel.controllers');

router.route('/')
    .get(obtenerTodosCarousels)

router.route('/nuevo/:idProducto')
    .post(auth,subirImagen, crearCarousel)

router.route('/:idProducto')
    .get(obtenerCarousel)
    .put(auth,subirImagen, actualizarCarousel)
    .delete(auth,eliminarCarousel)


module.exports = router;