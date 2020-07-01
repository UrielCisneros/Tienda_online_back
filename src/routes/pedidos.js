const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth')

const { createPedido, getPedidos, updateEstadoPedido, getPedidosUser } = require('../controllers/pedido.controllers');

router.route('/')
    .post(auth,createPedido).get(auth,getPedidos);

router.route('/:id').get(auth,getPedidosUser);

router.route('/:id')
    .put(auth,updateEstadoPedido);





module.exports = router;