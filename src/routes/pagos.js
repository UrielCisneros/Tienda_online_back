const { Router } = require('express');
const router = Router();

const { createPago } = require('../controllers/pagos.controllers')

router.route('/').post(createPago);

module.exports = router;