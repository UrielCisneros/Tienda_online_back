const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');

const { 
    crearSugerencia,
    obtenerSugerencia,
    actualizarSugerencia, 
    eliminarSugerencia
} = require('../controllers/sugerencia.controllers');

router.route('/nueva/:idProducto')
    .post(auth,crearSugerencia)

router.route('/:idSugerencia')
    .get(obtenerSugerencia)
    .put(auth,actualizarSugerencia)
    .delete(auth,eliminarSugerencia)


module.exports = router;