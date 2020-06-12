const galeriaCtrl = {};
const Galeria = require('../models/Galeria');
const imagen = require('./uploadFile.controllers');
const path = require('path');
const fs = require('fs');

galeriaCtrl.subirImagen = (req, res, next) => {
	imagen.upload(req, res, function (error) {
		if (error) {
			res.json({ message: error });
		}
		return next();
	});
};

galeriaCtrl.crearGaleria = async (req, res) => {
    const {producto} = req.body;
    if(!req.file){
        res.json({message: 'La Galeria al menos debe tener una imagen'})
    }else{
        const newGaleria = new Galeria({
            producto: producto,
            imagenes: [{
                url: req.file.filename
            }]
        });
        await newGaleria.save((err, userStored) => {
            if (err) {
                res.status(500).send({ messege: 'Ups, algo paso al registrar la galeria' });
            } else {
                if (!userStored) {
                    res.status(404).send({ message: 'Error al crear la galeria' });
                } else {
                    res.status(200).send({ message: 'Galeria creada' });
                }
            }
        });
    }
}

galeriaCtrl.obtenerGaleria = async (req, res) => {
    try {
        const galeria = await Galeria.findById(req.params.idGaleria);
        if(!galeria){
            res.status(404).send({ message: 'Esta galeria no existe' });
        }
        res.json(galeria);
    } catch (error) {
        res.json({ mensaje: 'Error al obtener esta galeria' });
    }
}

galeriaCtrl.crearImagen = async (req, res) => {
    await Galeria.updateOne(
        {
            _id: req.params.idGaleria
        },
        {
            $addToSet:
            {
                imagenes:
                {
                    url: req.file.filename
                }
            }
        }, (err, response) => {
            if (err) {
                res.status(500).send({ messege: 'Ups, algo paso al crear la imagen' });
            } else {
                if (!response) {
                    res.status(404).send({ message: 'Error al crear la imagen' });
                } else {
                    res.status(200).send({ message: 'Imagen guardada' });
                }
            }
        }
    );
 
}


galeriaCtrl.actualizarImagen = async (req, res) => {
        const datos = await Galeria.findById(req.params.idGaleria);        
        const imagenes = datos.imagenes
        const urlB = imagenes.filter(x => x._id == req.params.idImagen)
        urlB.map( async (urlBase) => {
            if (req.file) {
                url = req.file.filename;
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
                        res.status(500).send({message: 'Ups, algo paso al actualizar imagen'})
                    }else{
                        if(!response){
                            res.status(404).send({message: 'error al actualizar imagen(404)'})
                        }else{
                            res.status(200).send({message: 'Imagen actualizada'})
                        }
                    }
                }
            ); 
        })
}


galeriaCtrl.eliminarImagen = async (req, res) => {
    const datos = await Galeria.findById(req.params.idGaleria);  
    const imagenes = datos.imagenes
    const urlB = imagenes.filter(x => x._id == req.params.idImagen)
    urlB.map( async (urlBase) => {
        await imagen.eliminarImagen(urlBase.url);
        await Galeria.updateOne(
        {
            _id: req.params.idGaleria
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
                res.status(500).send({message: 'Ups, algo paso al actualizar imagen'})
            }else{
                if(!response){
                    res.status(404).send({message: 'error al eliminar imagen(404)'})
                }else{
                    res.status(200).send({message: 'Imagen Eliminada'})
                }
            }
        });
    })
}

module.exports = galeriaCtrl;