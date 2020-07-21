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
	actualizarPromocion,
	eliminarPromocion,
	crearPromocion,
	getPromocionCarousel,
	getPromociones,
	getPromocion
} = require('../controllers/productos.controllers');
const auth = require('../middleware/auth')

router.route('/promocion/carousel/').get(getPromocionCarousel)

router.route('/promocion/').post(subirImagen,crearPromocion).get(getPromociones)

router.route('/').get(getProductos).post(subirImagen, createProducto);

router.route('/:id').get(getProducto).put(auth,subirImagen, updateProducto).delete(auth,deleteProducto);

router.route('/addTalla/:id').post(auth,addTalla);

router.route('/addNumero/:id').post(auth,addnumero);

router.route('/action/:id/talla/:idtalla').delete(auth,eliminarTalla).put(auth,actualizarTalla);

router.route('/action/:id/numero/:idnumero').delete(auth,eliminarNumero).put(auth,actualizarNumero);



router.route('/promocion/:id').put(auth,subirImagen,actualizarPromocion).delete(auth,eliminarPromocion).get(getPromocion);

module.exports = router;
