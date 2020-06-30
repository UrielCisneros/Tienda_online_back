const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { 
    agregarApartado,
    obtenerApartado, 
    actualizarApartado, 
/*     cambiarEstado, */ 
    eliminarApartado 
} = require('../controllers/apartado.controllers');

router.route('/nuevo/:idCliente')
    .post(auth,agregarApartado)
    
router.route('/:idApartado')
    .get(auth,obtenerApartado)
/*     .patch(cambiarEstado) */
    .put(auth,actualizarApartado)
    .delete(auth,eliminarApartado)

module.exports = router;