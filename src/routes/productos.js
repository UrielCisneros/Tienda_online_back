const { Router } = require('express');
const router = Router();

const {
	getProductos,
	createProducto,
	getProducto,
	updateProducto,
	updateProductoCantidad,
	deleteProducto,
	subirImagen,
	addTalla,
	addnumero,
	eliminarTalla,
	eliminarNumero,
	actualizarTalla,
	actualizarNumero
} = require('../controllers/productos.controllers');

router.route('/').get(getProductos).post(subirImagen, createProducto);

router.route('/:id').get(getProducto).put(subirImagen, updateProducto).delete(deleteProducto);

router.route('/stock/:id').put(updateProductoCantidad);

router.route('/addTalla/:id').post(addTalla);

router.route('/addNumero/:id').post(addnumero);

router.route('/action/:id/talla/:idtalla').delete(eliminarTalla).put(actualizarTalla);

router.route('/action/:id/numero/:idnumero').delete(eliminarNumero).put(actualizarNumero);

module.exports = router;
