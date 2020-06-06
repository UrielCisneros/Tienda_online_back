const { Router } = require('express');
const router = Router();

const {
	getProductos,
	createProducto,
	getProducto,
	updateProducto,
	updateProductoCantidad,
	deleteProducto,
	subirImagen
} = require('../controllers/productos.controllers');

router.route('/').get(getProductos).post(subirImagen, createProducto);

router.route('/:id').get(getProducto).put(subirImagen, updateProducto).delete(deleteProducto);

router.route('/stock/:id').put(updateProductoCantidad);

module.exports = router;
