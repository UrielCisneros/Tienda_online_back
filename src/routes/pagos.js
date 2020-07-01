const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth')

const { createPago } = require('../controllers/pagos.controllers')

router.route('/').post(auth,createPago);

module.exports = router;