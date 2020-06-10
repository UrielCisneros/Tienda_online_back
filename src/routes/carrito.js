const { Router } = require('express');
const router = Router();

const { 
    crearCarrito,
    agregarArticulo,
    obtenerCarrito,
    eliminarCarrito, 
    eliminarArticulo,
    modificarCantidadArticulo
} = require('../controllers/carrito.controllers');


router.route('/nuevo/:idCliente')
    .post(crearCarrito)

router.route('/:idCarrito')
    .get(obtenerCarrito)
    .post(agregarArticulo)
    .delete(eliminarCarrito)

router.route('/:idCarrito/articulo/:idArticulo')
    .delete(eliminarArticulo)
    .put(modificarCantidadArticulo)

module.exports = router;