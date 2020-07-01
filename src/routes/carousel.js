const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const { 
    subirImagen,
    crearCarousel,
    obtenerCarousel,
    actualizarCarousel, 
    eliminarCarousel
} = require('../controllers/carousel.controllers');

router.route('/nuevo/:idProducto')
    .post(auth,subirImagen, crearCarousel)

router.route('/:idCarousel')
    .get(obtenerCarousel)
    .put(auth,subirImagen, actualizarCarousel)
    .delete(auth,eliminarCarousel)


module.exports = router;