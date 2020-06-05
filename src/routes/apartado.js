const { Router } = require('express');
const router = Router();

const { agregarApartado, obtenerApartado, actualizarApartado, cambiarEstado, eliminarApartado } = require('../controllers/apartado.controllers');

router.route('/')
    .post(agregarApartado)
    .get(obtenerApartado)

router.route('/:id')
    .patch(cambiarEstado)
    .put(actualizarApartado)
    .delete(eliminarApartado)

module.exports = router;