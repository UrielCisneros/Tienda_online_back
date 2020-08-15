const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { 
    agregarApartado,
    obtenerApartado, 
    actualizarApartado, 
    obtenerApartados,
    eliminarApartado,
    obtenerUnApartado
} = require('../controllers/apartado.controllers');

router.route('/')
    .get(obtenerApartados)

router.route('/nuevo/:idCliente')
    .post(auth,agregarApartado)
    
router.route('/:idCliente')
    .get(auth,obtenerApartado)
    .put(auth,actualizarApartado)
    .delete(auth,eliminarApartado)

router.route('/traer/:id').get(auth,obtenerUnApartado)

module.exports = router;