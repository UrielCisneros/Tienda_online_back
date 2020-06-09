const galeriaCtrl = {};
const Galeria = require('../models/Galeria');
const imagen = require('./uploadFile.controllers');
const path = require('path');
const fs = require('fs');

galeriaCtrl.createGaleria = async (req, res, next) => {

    const newGaleria = new Galeria(req.body);
    if (req.file.filename) {
		newGaleria.imagenes.url = req.file.filename;
	}
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
    /* try {
        await newGaleria.save();
        res.json({ message: 'Galeria Creada' });
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error al crear Galeria' });
        next()
    }     */
}

galeriaCtrl.getGaleria = async (req, res, next) => {
    try {
        const galeria = await Galeria.findById(req.params.idGaleria);
        res.json(galeria);
    } catch (error) {
        console.log(error)
        res.json({ mensaje: 'Esta galeria no existe' });
        next()
    }
}

galeriaCtrl.createImagen = async (req, res, next) => {
    try {
        await Galeria.updateOne(
            {
                _id: req.params.idGaleria
            },
            {
                $push:
                {
                    imagenes:
                    {
                        numero_imagen: req.body.numero_imagen,
                        url: req.body.url
                    }
                }
            });
        res.json({ message: 'Imagen guardada' })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error al guardar imagen' });
        next()
    }
    Galeria.updateOne({ _id: req.params.idGaleria},
    { $push: 
        { imagenes: { url } } }, (err, userStored) => {
		if (err) {
			res.status(500).send({ messege: 'Ups, algo paso al crear la imagen' });
		} else {
			if (!userStored) {
				res.status(404).send({ message: 'Error al crear la imagen' });
			} else {
				res.status(200).send({ message: 'Imagen guardada' });
			}
		}
	});
}

galeriaCtrl.updateGaleria = async (req, res, next) => {
    try {
        await Galeria.findOneAndUpdate(
            {
                _id: req.params.idGaleria
            },
            {
                $set: { imagenes: { numero_imagen: req.params.num_imagen, url: req.body.url } }
            });

        res.json({ message: 'Galeria actualizada' });

    } catch (error) {
        console.log(error)
        res.json({ message: 'Error al actualizar la galeria' });
        next()
    }
}


galeriaCtrl.deleteImagen = async (req, res) => {
    try {
        await Galeria.updateOne(
            {
                _id: req.params.idGaleria
            },
            {
                $pull:
                {
                    imagenes:
                    {
                        numero_imagen: req.params.num_imagen
                    }
                }
            });
        res.json({ message: 'Imagen eliminada' })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error al eliminar imagen' });
        next()
    }
}

module.exports = galeriaCtrl;