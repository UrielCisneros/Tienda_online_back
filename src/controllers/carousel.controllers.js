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
		newCarousel.imagen = req.file.key;
    }
    await newCarousel.save((err, response) => {
        if(err){
            res.send({message: 'Ups, hubo un error al crear el carousel', err})
        }else{
            if(!response){
                res.send({message: 'Carousel NO creado (404)'})
            }else{
                res.json(response)
            }
        }
    })
}

carouselCtrl.obtenerTodosCarousels = async (req, res, next) => {
    try {
		const carousel = await Carousel.find().populate('producto').limit(10);
		res.json(carousel);
    } catch (err) {
        res.json({ message: 'Ups, algo paso al obtener carouseles', err });
        next();
    }
}

carouselCtrl.obtenerCarousel = async (req, res) => {
    const carousel = await Carousel.findOne({producto: req.params.idProducto}).populate('producto')
    try {
        if(!carousel){
            res.send({message: 'Este carousel no existe'})
        }
        res.json(carousel)
    } catch (err) {
        res.send({message: 'Ups, hubo un error al obtener el carousel', err})
    }
}

carouselCtrl.actualizarCarousel = async (req, res) => {
    try {
		const carouselDeBase = await Carousel.findOne({producto: req.params.idProducto});
		if(!carouselDeBase){
			res.send({message: 'Este carousel no existe'})
		}else{
			//Construir nuevo producto
			const nuevoCarousel = req.body;
			//Verificar si mandaron imagen
			if (req.file) {
				nuevoCarousel.imagen = req.file.key;
				await imagen.eliminarImagen(carouselDeBase.imagen);
			} else {
				nuevoCarousel.imagen = carouselDeBase.imagen;
			}
			const carousel = await Carousel.findOneAndUpdate({producto: req.params.idProducto}, nuevoCarousel);
			res.json(carousel)
		}
		
	} catch (err) {
		res.send({message: 'Error al actualizar Carousel', err})
	}
}

carouselCtrl.eliminarCarousel = async (req, res) => {
    const carouselDeBase = await Carousel.findOne({producto: req.params.idProducto});
	try {
		if (!carouselDeBase) {
			res.json({ message: 'Este carousel no existe' });
		}else{
			if (carouselDeBase.imagen) {
				await imagen.eliminarImagen(carouselDeBase.imagen);
			}
		
			const carousel = await Carousel.findOneAndDelete({producto: req.params.idProducto});
			if (!carousel) {
				res.json({ message: 'Este carousel no existe' });
			}
			res.json({ message: 'Carousel eliminado' });
		}		
	} catch (err) {
		res.send({message: 'Error al eliminar Carousel', err})
	}
}

module.exports = carouselCtrl;
