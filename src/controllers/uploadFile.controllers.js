const subir = {};
const path = require('path');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');



const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../../uploads/'));
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
            cb(null, true);
        } else {
            cb(new Error('Formato no valido'));
        }
    }
};

subir.eliminarImagen = (infoBase) => {
    const imagenAnterior = path.join(__dirname, `/../public/img/${infoBase}`);
    fs.unlink(imagenAnterior, (error) => {
        if (error) {
            console.log(error);
        }
        return
    });
}

subir.upload = multer(configuracionMulter).single('imagen');




module.exports = subir;