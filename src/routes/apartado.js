const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { 
    agregarApartado,
    obtenerApartado, 
    actualizarApartado, 
    obtenerApartados,
    eliminarApartado 
} = require('../controllers/apartado.controllers');

router.route('/')
    .get(obtenerApartados)

router.route('/nuevo/:idCliente')
    .post(auth,agregarApartado)
    
router.route('/:idCliente')
    .get(auth,obtenerApartado)
    .put(auth,actualizarApartado)
    .delete(auth,eliminarApartado)

module.exports = router;