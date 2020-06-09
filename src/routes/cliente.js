const { Router } = require('express');
const router = Router();

const {
	getCliente,
	getClientes,
	createCliente,
	updateCliente,
	deleteCliente,
	subirImagen
} = require('../controllers/cliente.controllers');

router.route('/').get(getClientes).post(createCliente);

router.route('/:id').get(getCliente).put(subirImagen, updateCliente).delete(deleteCliente);


module.exports = router;
