const { Router } = require('express');
const router = Router();

const { 
    crearCarrito,
    agregarArticulo,
    obtenerCarrito,
    eliminarCarrito, 
    eliminarArticulo,
    modificarCantidadArticulo,
    actualizarTotal 
} = require('../controllers/carrito.controllers');


router.route('/nuevo/:idCliente')
    .post(crearCarrito)

router.route('/:idCarrito')
    .get(obtenerCarrito)
    .post(agregarArticulo, actualizarTotal)
    .delete(eliminarCarrito)

router.route('/:idCarrito/articulo/:idArticulo')
    .delete(eliminarArticulo, actualizarTotal)
    .put(modificarCantidadArticulo, actualizarTotal)

module.exports = router;