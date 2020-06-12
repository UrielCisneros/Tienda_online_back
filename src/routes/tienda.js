const { Router } = require('express');
const router = Router();

const { 
    crearTienda,
    obtenerTienda,
    actualizarTienda,
    eliminarTienda
} = require('../controllers/tienda.controllers');


router.route('/')
    .post(crearTienda)

router.route('/:idTienda')
    .get(obtenerTienda)
    .put(actualizarTienda)
    .delete(eliminarTienda)

module.exports = router;