const { Router } = require('express');
const router = Router();

const { createPedido, updateEstadoPedido, updateMensajePedido } = require('../controllers/pedido.controllers');

router.route('/:id')
    .post(createPedido);

router.route('/estado/:id')
    .put(updateEstadoPedido);

router.route('/mensaje/:id')
    .put(updateMensajePedido);




module.exports = router;