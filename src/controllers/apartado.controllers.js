const apartadoCtrl = {};
const Apartado = require('../models/Apartado');
const Producto = require('../models/Producto')

apartadoCtrl.agregarApartado = async (req, res) => {
	const { producto, cliente, cantidad, estado } = req.body;
	const datosProducto = await Producto.find({_id: producto})
	datosProducto.map( async (productos) => {
		if(cantidad > productos.cantidad){
			res.status(404).json({ message: 'No puedes apartar mas de la cantidad del stock del producto' });
		}else{
			const newApartado = new Apartado({ producto, cliente, cantidad, estado });
			await newApartado.save((err, response) => {
				if(err){
					res.status(500).json({ message: 'Hubo un error al crear apartado', err });
				}else {
					if(!response){
						res.status(404).json({ message: 'Error al Crear apartado' });
					}else{
						res.status(200).json({ message: 'Apartado creado', response });
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
			res.status(404).json({ message: 'Apartados no Encontrados' });
		}
		res.status(200).json(apartado);
	} catch (error) {
		res.status(500).json({ message: 'Hubo un error al obtener los apartados', error });
	}
	
};

apartadoCtrl.obtenerApartado = async (req, res) => {
	try {
		const apartado = await Apartado.findOne({cliente: req.params.idCliente}).populate('cliente').populate('producto');
		if(!apartado){
			res.status(404).json({ message: 'Apartado no encontrado' });
		}
		res.status(200).json(apartado);
	} catch (error) {
		res.status(500).json({ message: 'Hubo un error al obtener apartado', error });
	}
	
};

apartadoCtrl.actualizarApartado = async (req, res) => {
	await Apartado.findByIdAndUpdate({cliente: req.params.idCliente}, req.body, (err, response) => {
		if(err){
			res.status(500).json({message: 'Hubo un error al actualizar el apartado', err})
		}else{
			if(!response){
				res.status(404).json({message: 'Apartado no encontrado'})
			}else{
				res.status(200).json({message: 'Apartado Actualizado', response})
			}
		}
	});
};

apartadoCtrl.eliminarApartado = async (req, res) => {
	await Apartado.findByIdAndDelete({cliente: req.params.idCliente}, (err, response) => {
		if(err){
			res.status(500).json({message: 'Hubo un error al eliminar apartado', err})
		}else if(!response){
			res.status(404).json({message: 'Apartado no encontrado'})
		}else{
			res.status(200).json({ message: 'Apartado eliminado' });
		}	
	});
};

module.exports = apartadoCtrl;
