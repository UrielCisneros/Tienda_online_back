const { Router } = require('express');
const router = Router();

const { createPedido, getPedidos, updateEstadoPedido, getPedidosUser } = require('../controllers/pedido.controllers');

router.route('/')
    .post(createPedido).get(getPedidos);

router.route('/:id').get(getPedidosUser);

router.route('/:id')
    .put(updateEstadoPedido);





module.exports = router;