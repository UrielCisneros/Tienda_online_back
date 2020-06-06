const subir = {};
const path = require('path');
const multer = require('multer');
const shortid = require('shortid');



const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/img/'));
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato no valido'));
        }
    }
};

subir.upload = multer(configuracionMulter).single('imagen');


module.exports = subir;