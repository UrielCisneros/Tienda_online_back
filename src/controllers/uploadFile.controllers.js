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

//Filtros que se aceptaran en los archivos
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        return cb(new Error('Formato no valido'));
    }
  }
  

  //Aqui es donde conectamos al Bucket de Amazon S3 y le damos los filtros
  const configuracionMulter ={
    fileFilter,
    storage: multerS3({
      s3: s3,
      bucket: 'prueba-imagenes-uploads',
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: 'Testing_metadata'});
      },
      Key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    }) 
  };


//Funcion que elimina la imagen den Bucked
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