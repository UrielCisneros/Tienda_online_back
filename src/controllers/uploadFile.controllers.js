const subir = {};
const multer = require('multer');
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS,
    accessKeyId: process.env.AWS_ACCESS_ID,
    region: process.env.AWS_REGION
})

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        return cb(new Error('Formato no valido'));
    }
  }
  
  const configuracionMulter ={
    fileFilter,
    storage: multerS3({
      s3: s3,
      bucket: 'prueba-imagenes-uploads',
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: 'Testing_metadata'});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    }) 
  };

subir.eliminarImagen = (keyDeleted) => {
    s3.deleteObject({
      Bucket: 'prueba-imagenes-uploads',
      Key: keyDeleted
    },function(err, data) {
      if(err){
        throw err;
      } 
    })
  }

subir.upload = multer(configuracionMulter).single('imagen');


module.exports = subir;