const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const {subirImagen,createBanner,getBanners,editBanner,deleteBanner} = require('../controllers/bannerCategoria');

router.route('/')
    .get(getBanners)
    .post(subirImagen,createBanner)

router.route('/:idBanner')
    .put(subirImagen,editBanner)
    .delete(deleteBanner)


module.exports = router;