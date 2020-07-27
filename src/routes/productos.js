const { Router } = require('express');
const router = Router();

const {
	getProductos,
	createProducto,
	getProducto,
	updateProducto,
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
	getPromocion,
	deleteImagen,
	getProductosFiltrados
} = require('../controllers/productos.controllers');
const auth = require('../middleware/auth')

router.route('/promocion/carousel/').get(getPromocionCarousel)

router.route('/promocion/').post(auth,subirImagen,crearPromocion).get(getPromociones)

router.route('/').get(getProductos).post(subirImagen, createProducto);

router.route('/search/:search').get(getProductosFiltrados)

router.route('/:id').get(getProducto).put(auth,subirImagen, updateProducto).delete(auth,deleteProducto);

router.route('/addTalla/:id').post(auth,addTalla);

router.route('/addNumero/:id').post(auth,addnumero);

router.route('/action/:id/talla/:idtalla').delete(auth,eliminarTalla).put(auth,actualizarTalla);

router.route('/action/:id/numero/:idnumero').delete(auth,eliminarNumero).put(auth,actualizarNumero);



router.route('/promocion/:id').put(auth,subirImagen,actualizarPromocion).delete(auth,eliminarPromocion).get(getPromocion);

router.route('/promocion/EliminarImagen/:id').delete(auth,deleteImagen);

module.exports = router;
