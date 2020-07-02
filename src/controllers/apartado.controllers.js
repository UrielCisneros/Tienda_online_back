const apartadoCtrl = {};
const Apartado = require('../models/Apartado');
const Producto = require('../models/Producto')

apartadoCtrl.agregarApartado = async (req, res) => {
	const { producto, cliente, cantidad, estado } = req.body;
	const datosProducto = await Producto.find({_id: producto})
	datosProducto.map( async (productos) => {
		if(cantidad > productos.cantidad){
			res.send({ message: 'no puedes apartar mas de la cantidad del stock del producto' });
		}else{
			const newApartado = new Apartado({ producto, cliente, cantidad, estado });
			await newApartado.save((err, response) => {
				if(err){
					res.send({ message: 'Error, algo paso al crear apartado', err });
				}else {
					if(!response){
						res.send({ message: 'Error al Crear apartado (404)' });
					}else{
						res.send({ message: 'Apartado creado' });
					}
				}
			})
		}
	})
};

apartadoCtrl.obtenerApartados = async (req, res) => {
	try {
		const apartado = await Apartado.find().populate('cliente').populate('producto');
		if(!apartado){
			res.json({ message: 'No existen apartados' });
		}
		res.json(apartado);
	} catch (error) {
		res.json({ message: 'error al obtener los apartados' });
	}
	
};

apartadoCtrl.obtenerApartado = async (req, res) => {
	try {
		const apartado = await Apartado.findById(req.params.idApartado).populate('cliente').populate('producto');
		if(!apartado){
			res.json({ message: 'El apartado que busca no existe' });
		}
		res.json(apartado);
	} catch (error) {
		res.json({ message: 'error al obtener apartado' });
	}
	
};

apartadoCtrl.actualizarApartado = async (req, res) => {
	await Apartado.findByIdAndUpdate(req.params.idApartado, req.body, (err, response) => {
		if(err){
			res.send({message: 'Hubo un error al actualizar el apartado', err})
		}else{
			if(!response){
				res.send({message: 'Error al actualizar apartado'})
			}else{
				res.json(response)
			}
		}
	});
};

apartadoCtrl.eliminarApartado = async (req, res) => {
	await Apartado.findByIdAndDelete(req.params.idApartado, (err, response) => {
		if(err){
			res.send({message: 'Error al eliminar apartado', err})
		}else if(!response){
			res.send({message: 'El apartado no existe'})
		}else{
			res.json({ message: 'Apartado eliminado' });
		}	
	});
};

module.exports = apartadoCtrl;
