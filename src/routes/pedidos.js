const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth')

const { createPedido, getPedidos, updateEstadoPedido, getPedidosUser, getPedido, getPedidosAdmin } = require('../controllers/pedido.controllers');

router.route('/').post(auth,createPedido).get(auth,getPedidos);

router.route('/admin/').get(auth,getPedidosAdmin);

router.route('/:id').get(auth,getPedidosUser);

router.route('/pedido/:id').get(auth,getPedido);

router.route('/info/:id')
    .put(auth,updateEstadoPedido);





module.exports = router;