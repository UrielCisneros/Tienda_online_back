const apartadoCtrl = {};
const Apartado = require('../models/Apartado');
const Producto = require('../models/Producto')

apartadoCtrl.agregarApartado = async (req, res) => {
	const { producto, cliente, cantidad, estado, medida } = req.body;
	const datosProducto = await Producto.find({_id: producto})
	const newApartado = new Apartado({ producto, cliente, cantidad, estado, medida });

	if(req.body.medida){
		if(medida[0].numero){
			datosProducto[0].numeros.map(async (numero) => {
				if(numero.numero == medida[0].numero){
					if(cantidad > numero.cantidad){
						res.status(500).send({ message: 'No existen suficientes productos en el inventario' })
					}else{
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
				}
			})
		}else if(medida[0].talla){
			datosProducto[0].tallas.map(async (talla) => {
				if(talla.talla == medida[0].talla){
					if(cantidad > talla.cantidad){
						res.status(500).send({ message: 'No existen suficientes productos en el inventario' })
					}else{
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
				}
			})
		}
	}else{
		console.log(datosProducto);
		if(cantidad > datosProducto[0].cantidad){
			res.status(500).send({ message: 'No existen suficientes productos en el inventario' })
		}else{
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
	}
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
		const apartado = await Apartado.find({cliente: req.params.idCliente}).populate('cliente').populate('producto');
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
