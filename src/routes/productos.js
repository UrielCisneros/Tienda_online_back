const { Router } = require('express');
const router = Router();

const { getProductos, createProducto, getProducto, updateProducto, updateProductoCantidad, deleteProducto } = require('../controllers/productos.controllers');

router.route('/')
    .get(getProductos)
    .post(createProducto)

router.route('/:id')
    .get(getProducto)
    .put(updateProducto)
    .delete(deleteProducto)

router.route('/stock/:id')
    .put(updateProductoCantidad)

module.exports = router;