const carouselCtrl = {};
const Carousel = require('../models/Carousel');
const imagen = require('./uploadFile.controllers');

carouselCtrl.subirImagen = (req, res, next) => {
	imagen.upload(req, res, function (error) {
		if (error) {
			res.json({ message: error });
		}
		return next();
	});
};

carouselCtrl.crearCarousel = async (req, res) => {
    const newCarousel = new Carousel(req.body);
    if (req.file) {
		newCarousel.imagen = req.file.filename;
    }
    await newCarousel.save((err, response) => {
        if(err){
            res.status(500).send({message: 'Ups, hubo un error al crear el carousel'})
        }else{
            if(!response){
                res.status(404).send({message: 'Carousel NO creado (404)'})
            }else{
                res.status(200).send({message: 'Carousel creado'})
            }
        }
    })
}

carouselCtrl.obtenerCarousel = async (req, res) => {
    const carousel = await Carousel.findById(req.params.idCarousel).populate('producto', 'nombre')
    try {
        if(!carousel){
            res.status(404).send({message: 'Este carousel no existe'})
        }
        res.json(carousel)
    } catch (error) {
        res.status(500).send({message: 'Ups, hubo un error al obtener el carousel'})
    }
}

carouselCtrl.actualizarCarousel = async (req, res) => {
    try {
		const carouselDeBase = await Carousel.findById(req.params.idCarousel);
		//Construir nuevo producto
		const nuevoCarousel = req.body;
        //Verificar si mandaron imagen
		if (req.file) {
			nuevoCarousel.imagen = req.file.filename;
			await imagen.eliminarImagen(carouselDeBase.imagen);
		} else {
			nuevoCarousel.imagen = carouselDeBase.imagen;
		}
		await Carousel.findByIdAndUpdate(req.params.idCarousel, nuevoCarousel);
		res.status(200).send({message: 'Carousel actualizado'})
	} catch (error) {
		res.status(500).send({message: 'Error al actualizar Carousel'})
	}
}

carouselCtrl.eliminarCarousel = async (req, res) => {
    const carouselDeBase = await Carousel.findById(req.params.idCarousel);
	if (carouselDeBase.imagen) {
		await imagen.eliminarImagen(carouselDeBase.imagen);
	}

	const carousel = await Carousel.findByIdAndDelete(req.params.idCarousel);
	if (!carousel) {
		res.json({ message: 'Este carousel no existe' });
	}
	res.json({ message: 'Carousel eliminado' });
}

module.exports = carouselCtrl;