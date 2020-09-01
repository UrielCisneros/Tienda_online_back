const apartadoCtrl = {};
const Apartado = require('../models/Apartado');
const Producto = require('../models/Producto')
const mongoose = require('mongoose');
const { response } = require('express');

apartadoCtrl.agregarApartado = async (req, res) => {

	const { producto, cliente, cantidad, estado, medida,tipoEntrega } = req.body;
	const datosProducto = await Producto.find({_id: producto})
	const newApartado = new Apartado({ producto, cliente, cantidad, estado, medida, tipoEntrega });

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
		const { page = 1, limit = 10} = req.query;
		const options = {
			page,
            limit: parseInt(limit)
		}

		const aggregate = Apartado.aggregate([
			{
				$lookup: {
					from: 'productos',
					localField: 'producto',
					foreignField: '_id',
					as: 'producto'
				}
			},
			{
				$lookup: {
					from: 'clientes',
					localField: 'cliente',
					foreignField: '_id',
					as: 'cliente'
				}
			},
		]);

		await Apartado.aggregatePaginate(aggregate,options, (err, postStored) => {
			if (err) {
				res.status(500).json({ message: 'Error en el servidor', err });
			} else {
				if (!postStored) {
					res.status(404).json({ message: 'Error al mostrar Blogs' });
				} else {
					res.status(200).json({ posts: postStored });
				}
			}
		});


	} catch (error) {
		res.status(500).json({ message: 'Hubo un error al obtener los apartados', error });
	}
	
};

apartadoCtrl.obtenerApartado = async (req, res) => {
	try {
		await Apartado.aggregate([
            {
				$lookup: {
					from: 'promocions',
					localField: 'producto',
					foreignField: 'productoPromocion',
					as: 'promocion'
				}
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.idCliente)
                }
            }
		]).exec(async function(err, transactions) {
			if (err) {
				res.send({ message: 'Error al obtener apartado', err });
			} else {
				await Apartado.populate(transactions, { path: 'cliente producto' }, function(err, populatedTransactions
				) {
					// Your populated translactions are inside populatedTransactions
					if (err) {
						res.send({ message: 'Error al obtener apartado', err });
					} else {
						res.json(populatedTransactions[0]);
					}
				});
			}
		});
	} catch (error) {
		res.status(500).json({ message: 'Hubo un error al obtener apartado', error });
	}
	
};

apartadoCtrl.filtroApartadosCliente = async (req,res) => {

	await Apartado.aggregate(
		[
			{
				$lookup: {
					from: 'productos',
					localField: 'producto',
					foreignField: '_id',
					as: 'producto'
				}
			},
			{
				$lookup: {
					from: 'clientes',
					localField: 'cliente',
					foreignField: '_id',
					as: 'cliente'
				}
			},
			{
				$match: {
					$or: [
						{ 'cliente.nombre': { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ 'cliente.email': { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ tipoEntrega: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ estado: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ paqueteria: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ fecha_envio: { $regex: '.*' + req.params.filter + '.*', $options: 'i' } },
						{ 'producto.nombre': { $regex: '.*' + req.params.filter + '.*', $options: 'i' } }
					]
				}
			}
		],
		(err, postStored) => {
			if (err) {
				res.status(500).json({ message: 'Error en el servidor', err });
			} else {
				if (!postStored) {
					res.status(404).json({ message: 'Error al mostrar Productos' });
				} else {
					res.status(200).json(postStored);
				}
			}
		}
	);
}

/* apartadoCtrl.obtenerApartado = async (req, res) => {
	try {
		const apartado = await Apartado.find({cliente: req.params.idCliente}).populate('cliente').populate('producto');
		if(!apartado){
			res.status(404).json({ message: 'Apartado no encontrado' });
		}
		res.status(200).json(apartado);
	} catch (error) {
		res.status(500).json({ message: 'Hubo un error al obtener apartado', error });
	}
	
}; */

apartadoCtrl.actualizarApartado = async (req, res) => {
	const apatadoActualizado = req.body;
	apatadoActualizado.fecha_envio = new Date();
	await Apartado.findOneAndUpdate({_id: req.params.idCliente}, apatadoActualizado, (err, response) => {
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
	await Apartado.findOneAndDelete({cliente: req.params.idCliente}, (err, response) => {
		if(err){
			res.status(500).json({message: 'Hubo un error al eliminar apartado', err})
		}else if(!response){
			res.status(404).json({message: 'Apartado no encontrado'})
		}else{
			res.status(200).json({ message: 'Apartado eliminado' });
		}	
	});
};

apartadoCtrl.obtenerUnApartado = async (req, res) => {
	try {
		const apartado =  await Apartado.findById(req.params.id).populate('cliente').populate('producto');
		if(apartado){
			res.status(200).json(apartado);
		}
	} catch (err) {
		res.status(500).json({ message: 'Hubo un error al obtener apartado', err });
	}
	

}

module.exports = apartadoCtrl;
