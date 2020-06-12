const { Router } = require('express');
const router = Router();

const { 
    agregarApartado,
    obtenerApartado, 
    actualizarApartado, 
    cambiarEstado, 
    eliminarApartado 
} = require('../controllers/apartado.controllers');

router.route('/nuevo/:idCliente')
    .post(agregarApartado)
    
router.route('/:idApartado')
    .get(obtenerApartado)
    .patch(cambiarEstado)
    .put(actualizarApartado)
    .delete(eliminarApartado)

module.exports = router;