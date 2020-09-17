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
	getProductosFiltrados,
	crecarFiltrosNavbar,
	categoriasAgrupadas,
	subCategorias,
	getPromocionesPaginadas,
	getProductosSimilares,
	generoAgrupado
} = require('../controllers/productos.controllers');
const auth = require('../middleware/auth');
const { route } = require('./administrador');

router.route('/generos/').get(generoAgrupado);

router.route('/categorias/').get(auth,categoriasAgrupadas);

router.route('/Subcategorias/:idCategoria').get(auth,subCategorias);

router.route('/filtrosNavbar/').get(crecarFiltrosNavbar);




/* router.route('/similares/').get(getProductosSimilares) */

router.route('/promocion/carousel/').get(getPromocionCarousel)

router.route('/promocion/').post(auth,subirImagen,crearPromocion).get(getPromociones)

router.route('/promociones/').get(getPromocionesPaginadas)

router.route('/').get(getProductos).post(auth,subirImagen, createProducto);

router.route('/search').get(getProductosFiltrados)

router.route('/:id').get(getProducto).put(auth,subirImagen, updateProducto).delete(auth,deleteProducto);

router.route('/addTalla/:id').post(auth,addTalla);

router.route('/addNumero/:id').post(auth,addnumero);

router.route('/action/:id/talla/:idtalla').delete(auth,eliminarTalla).put(auth,actualizarTalla);

router.route('/action/:id/numero/:idnumero').delete(auth,eliminarNumero).put(auth,actualizarNumero);

router.route('/promocion/:id').put(auth,subirImagen,actualizarPromocion).delete(auth,eliminarPromocion).get(getPromocion);

router.route('/promocion/EliminarImagen/:id').delete(auth,deleteImagen);

module.exports = router;
