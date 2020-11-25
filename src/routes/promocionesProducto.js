const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const { createPromocionMasiva, getPromocionMasiva ,editPromocionMasiva, promocionLimitante,deletePromocionMasiva } = require('../controllers/promocionProductos.controllers');


router.route('/masiva/').get(auth,getPromocionMasiva).post(auth,createPromocionMasiva);

router.route('/masiva/:idPromocionMasiva').delete(auth,deletePromocionMasiva).put(auth,editPromocionMasiva)

router.route('/limitante/').post(promocionLimitante)

module.exports = router;