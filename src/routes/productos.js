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
	actualizarNumero,
	agregarPromocion,
	eliminarPromocion,
	promocion
} = require('../controllers/productos.controllers');
const auth = require('../middleware/auth');
const { route } = require('./administrador');

router.route('/').get(getProductos).post(auth,subirImagen, createProducto);

router.route('/:id').get(getProducto).put(auth,subirImagen, updateProducto).delete(auth,deleteProducto);

router.route('/stock/:id').put(auth,updateProductoCantidad);

router.route('/addTalla/:id').post(auth,addTalla);

router.route('/addNumero/:id').post(auth,addnumero);

router.route('/action/:id/talla/:idtalla').delete(auth,eliminarTalla).put(auth,actualizarTalla);

router.route('/action/:id/numero/:idnumero').delete(auth,eliminarNumero).put(auth,actualizarNumero);

router.route('/promocion/:id/idPromo/:idPromocion').put(auth,subirImagen,agregarPromocion).delete(auth,eliminarPromocion);

router.route('/promociones').get(promocion);

module.exports = router;
