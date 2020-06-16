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
					res.status(500).send({ message: 'Error, algo paso al crear apartado' });
				}else {
					if(!response){
						res.status(404).send({ message: 'Error al Crear apartado (404)' });
					}else{
						res.status(200).send({ message: 'Apartado creado' });
					}
				}
			})
		}
	})
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

/* apartadoCtrl.cambiarEstado = async (req, res) => {
	await Apartado.findByIdAndUpdate(req.params.idApartado, req.body, function(err, response) {
		if(err){
			res.status(500).send({message: 'Hubo un error al cambiar el estado'});
		}else{
			if(!response){
				res.status(404).send({ message: 'Error al cambiar estado (404)' });
			}else{
				res.status(200).send({message: 'Estado Actualizado'})
			}
		}
	});
}; */

apartadoCtrl.actualizarApartado = async (req, res) => {
	await Apartado.findByIdAndUpdate(req.params.idApartado, req.body, (err, response) => {
		if(err){
			res.status(500).send({message: 'Hubo un error al actualizar el apartado'})
		}else{
			if(!response){
				res.status(404).send({message: 'Error al actualizar apartado (404)'})
			}else{
				res.status(200).json(response)
			}
		}
	});
};

apartadoCtrl.eliminarApartado = async (req, res) => {
	await Apartado.findByIdAndDelete(req.params.idApartado, (err, response) => {
		if(err){
			res.status(500).send({message: 'Error al eliminar apartado'})
		}else if(!response){
			res.status(404).send({message: 'El apartado no existe'})
		}else{
			res.json({ message: 'Apartado eliminado' });
		}	
	});
};

module.exports = apartadoCtrl;
