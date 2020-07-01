const { Router } = require('express');
const router = Router();

const { 
    crearTienda,
    obtenerTienda,
    actualizarTienda,
    eliminarTienda
} = require('../controllers/tienda.controllers');
const auth = require('../middleware/auth');

router.route('/')
    .post(auth,crearTienda)

router.route('/:idTienda')
    .get(obtenerTienda)
    .put(auth,actualizarTienda)
    .delete(auth,eliminarTienda)

module.exports = router;