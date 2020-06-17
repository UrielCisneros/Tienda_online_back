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
    .post(crearCarrito, agregarArticulo)

router.route('/:idCarrito')
    .get(obtenerCarrito)
    .delete(eliminarCarrito)

router.route('/:idCarrito/articulo/:idArticulo')
    .delete(eliminarArticulo)
    .put(modificarCantidadArticulo)

module.exports = router;