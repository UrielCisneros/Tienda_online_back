const { Router } = require('express');
const router = Router();

const { crearCarrito, agregarArticulo, obtenerCarrito, actualizarCarrito, eliminarCarrito, eliminarArticulo } = require('../controllers/carrito.controllers');

router.route('/')
    .post(crearCarrito)

router.route('/:idCarrito')
    .get(obtenerCarrito)
    .post(agregarArticulo)
    .delete(eliminarCarrito)

router.route('/:idCarrito/articulos/:idArticulo')
    .delete(eliminarArticulo)

module.exports = router;