const { Router } = require('express');
const auth = require('../middleware/auth')
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
    .post(auth,crearCarrito, agregarArticulo)

router.route('/:idCarrito', auth)
    .get(auth,obtenerCarrito)
    .delete(auth,eliminarCarrito)

router.route('/:idCarrito/articulo/:idArticulo')
    .delete(auth,eliminarArticulo)
    .put(auth,modificarCantidadArticulo)

module.exports = router;