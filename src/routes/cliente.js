const { Router } = require('express');
const router = Router();

const {
	getCliente,
	getClientes,
	createCliente,
	updateCliente,
	deleteCliente,
	uploadAvatar
} = require('../controllers/cliente.controllers');

router.route('/').get(getClientes).post(createCliente);

router.route('/:id').get(getCliente).put(updateCliente).delete(deleteCliente);

router.route('/upload-image/:id').put(uploadAvatar);

module.exports = router;
