const galeriaCtrl = {};
const Galeria = require('../models/Galeria');
const imagen = require('./uploadFile.controllers');

galeriaCtrl.subirImagen = (req, res, next) => {
	imagen.upload(req, res, function (err) {
		if (err) {
			res.json({ message: "Formato de imagen no valido", err });
		}else{
            return next();
        }	
	});
};

galeriaCtrl.crearGaleria = async (req, res, next) => {
    const galeria = await Galeria.findOne({ producto: req.params.idProducto})
    if(!galeria){
        const {producto} = req.body;
        if(!req.file){
            res.json({message: 'La Galeria al menos debe tener una imagen'})
        }else{
            const newGaleria = new Galeria({
                producto: producto,
                imagenes: [{
                    url: req.file.key
                }]
            });
            await newGaleria.save((err, userStored) => {
                if (err) {
                    res.send({ message: 'Ups, algo paso al registrar la galeria', err });
                } else {
                    if (!userStored) {
                        res.send({ message: 'Error al crear la galeria' });
                    } else {
                        res.json(userStored);
                    }
                }
            });
        }
    }else{
        next();
    }
}

galeriaCtrl.obtenerGaleria = async (req, res) => {
    try {
        const galeria = await Galeria.findOne({ producto: req.params.idProducto}).populate('producto', 'nombre');
        if(!galeria){
            res.send({ message: 'Esta galeria no existe' });
        }else{
            res.json(galeria);
        }   
    } catch (error) {
        res.json({ mensaje: 'Error al obtener esta galeria' });
    }
}

galeriaCtrl.crearImagen = async (req, res) => {
    const producto = await Galeria.findOne({ producto: req.params.idProducto})
    await Galeria.findOneAndUpdate(
        {
            _id: producto._id
        },
        {
            $addToSet:
            {
                imagenes:
                {
                    url: req.file.key
                }
            }
        }, async (err, userStored) => {
            if (err) {
                res.send({ messege: 'Ups, algo paso al crear la imagen', err });
            } else {
                if (!userStored) {
                    res.send({ message: 'Error al crear la imagen' });
                } else {
                    const galeria = await Galeria.findOne({_id: producto._id})
                    res.json(galeria);
                }
            }
        }
    );
 
}


galeriaCtrl.actualizarImagen = async (req, res) => {
        const datos = await Galeria.findOne({ producto: req.params.idProducto});        
        const imagenes = datos.imagenes
        const urlB = imagenes.filter(x => x._id == req.params.idImagen)
        urlB.map( async (urlBase) => {
            if (req.file) {
                url = req.file.key;
                await imagen.eliminarImagen(urlBase.url);
            } else {
                url = urlBase.url;
            }

            await Galeria.updateOne(
                {
                    'imagenes._id': req.params.idImagen
                },
                {
                    $set: { 'imagenes.$': { url : url } }
                }, (err, response) => {
                    if(err){
                        res.send({message: 'Ups, algo paso al actualizar imagen', err})
                    }else{
                        if(!response){
                            res.send({message: 'imagen no existe'})
                        }else{
                            res.send({message: 'Imagen actualizada'})
                        }
                    }
                }
            ); 
        })
}


galeriaCtrl.eliminarImagen = async (req, res) => {
    const datos = await Galeria.findOne({ producto: req.params.idProducto});  
    const imagenes = datos.imagenes
    const urlB = imagenes.filter(x => x._id == req.params.idImagen)
    urlB.map( async (urlBase) => {
        await imagen.eliminarImagen(urlBase.url);
        await Galeria.updateOne(
        {
            producto: req.params.idProducto
        },
        {
            $pull:
            {
                imagenes:
                {
                    _id: req.params.idImagen
                }
            }
        }, (err, response) => {
            if(err){
                res.send({message: 'Ups, algo paso al eliminar imagen', err})
            }else{
                if(!response){
                    res.send({message: 'imagen no existe'})
                }else{
                    res.send({message: 'Imagen Eliminada'})
                }
            }
        });
    })
}

galeriaCtrl.eliminarGaleria = async (req, res) => {
    const datos = await Galeria.findOne({ producto: req.params.idProducto});  
    datos.imagenes.map( async (imagenes) => {
       try {
            await imagen.eliminarImagen(imagenes.url);
       } catch (error) {
           res.send({message: 'Ups, algo paso al eliminar imagen', err})
       }
    })
    await Galeria.findByIdAndDelete(req.params.idGaleria, (err, response) => {
        if(err){
            res.send({message: 'Esta galeria no existe'})  
        }else{
            res.send({message: 'Galeria Eliminada'})
        }
    })  
}

module.exports = galeriaCtrl;