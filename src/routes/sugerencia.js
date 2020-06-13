const { Router } = require('express');
const router = Router();

const { 
    crearSugerencia,
    obtenerSugerencia,
    actualizarSugerencia, 
    eliminarSugerencia
} = require('../controllers/sugerencia.controllers');

router.route('/nueva/:idProducto')
    .post(crearSugerencia)

router.route('/:idSugerencia')
    .get(obtenerSugerencia)
    .put(actualizarSugerencia)
    .delete(eliminarSugerencia)


module.exports = router;