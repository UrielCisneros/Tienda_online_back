const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const { createPromocionMasiva, getPromocionMasiva ,editPromocionMasiva, promocionLimitante,deletePromocionMasiva } = require('../controllers/promocionProductos.controllers');


router.route('/masiva/').get(getPromocionMasiva).post(createPromocionMasiva).put(editPromocionMasiva);

router.route('/masiva/:idPromocionMasiva').delete(deletePromocionMasiva)

router.route('/limitante/').post(promocionLimitante)

module.exports = router;