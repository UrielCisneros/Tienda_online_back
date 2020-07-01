const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');

const {
	getCliente,
	getClientes,
	createCliente,
	updateCliente,
	deleteCliente,
	subirImagen,
	authCliente
} = require('../controllers/cliente.controllers');

router.route('/auth').post(authCliente);

router.route('/').get(auth,getClientes).post(createCliente);

router.route('/:id').get(auth,getCliente).put(auth,subirImagen, updateCliente).delete(auth,deleteCliente);


module.exports = router;
