const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { createDetalle, getDetalle, getDetalleUser } = require('../controllers/detallePedido.controllers');



router.route('/')
.get(auth,getDetalle)
    .post(auth,createDetalle);//Add a new blog

    router.route('/:idUser').get(auth,getDetalleUser)


module.exports = router;