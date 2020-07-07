const productosCtrl = {};
const imagen = require('./uploadFile.controllers');
const Producto = require('../models/Producto');


productosCtrl.agregarPromocion = async (req, res) => {
	const datos = await Producto.findById(req.params.id);

	const promocionProducto = datos.promocion;
	const promocion = promocionProducto.filter(x => x._id == req.params.idPromocion);
	
	promocion.map(async (promocionArray) => {
		let imagenPromocion = "";
		console.log(promocionArray.precio);
		const {precio = promocionArray.precio } = req.body;
		if(req.file){
			imagenPromocion = req.file.filename
		}else{
			imagenPromocion = promocionArray.imagen
		}
		await Producto.updateOne(
			{
				'promocion._id': req.params.idPromocion
			},
			{
				$set: { 'promocion.$': { imagenPromocion, precio } }
			}, (err, response) => {
				if (err) {
					res.send({ message: 'Ups algo paso al actualizar',err })
				} else {
					if (!response) {
						res.send({ message: 'Este apartado no existe' })
					} else {
						res.send({ message: 'Se actualizo con exito' })
					}
				}
			}
		);
	})
}

productosCtrl.eliminarPromocion = async (req, res) => {
	await Producto.updateOne(
		{
			_id: req.params.id
		},
		{
			$pull:
			{
				promocion:
				{
					_id: req.params.idPromocion
				}
			}
		}, (err, response) => {
			if (err) {
				res.send({ message: 'Ups, also paso en la base',err })
			} else {
				if (!response) {
					res.send({ message: 'Esta promocion no existe' })
				} else {
					res.send({ message: 'Promocion eliminada' })
				}
			}
		});
}

productosCtrl.actualizarNumero = async (req, res) => {
	const datos = await Producto.findById(req.params.id);

	const numerosProducto = datos.numeros;
	const numeros = numerosProducto.filter(x => x._id == req.params.idnumero);
	numeros.map(async (numerosArray) => {
		console.log(req.body);
		const { numero = numerosArray.numero, cantidad = numerosArray.cantidad } = req.body;
		await Producto.updateOne(
			{
				'numeros._id': req.params.idnumero
			},
			{
				$set: { 'numeros.$': { numero, cantidad } }
			}, (err, response) => {
				if (err) {
					res.send({ message: 'Ups algo paso al actualizar' })
				} else {
					if (!response) {
						res.send({ message: 'Este apartado no existe' })
					} else {
						res.send({ message: 'Se actualizo con exito' })
					}
				}
			}
		);
	})
}

productosCtrl.actualizarTalla = async (req, res) => {
	const datos = await Producto.findById(req.params.id);

	const tallasProducto = datos.tallas;
	const tallas = tallasProducto.filter(x => x._id == req.params.idtalla);
	tallas.map(async (tallaArray) => {
		console.log(req.body);
		const { talla = tallaArray.talla, cantidad = tallaArray.cantidad } = req.body;
		await Producto.updateOne(
			{
				'tallas._id': req.params.idtalla
			},
			{
				$set: { 'tallas.$': { talla, cantidad } }
			}, (err, response) => {
				if (err) {
					res.send({ message: 'Ups algo paso al actualizar' })
				} else {
					if (!response) {
						res.send({ message: 'Este apartado no existe' })
					} else {
						res.send({ message: 'Se actualizo con exito' })
					}
				}
			}
		);
	})
}

productosCtrl.eliminarTalla = async (req, res) => {
	await Producto.updateOne(
		{
			_id: req.params.id
		},
		{
			$pull:
			{
				tallas:
				{
					_id: req.params.idtalla
				}
			}
		}, (err, response) => {
			if (err) {
				res.send({ message: 'Ups, also paso en la base' })
			} else {
				if (!response) {
					res.send({ message: 'esa talla no existe' })
				} else {
					res.send({ message: 'Talla eliminada' })
				}
			}
		});
}

productosCtrl.eliminarNumero = async (req, res) => {
	await Producto.updateOne(
		{
			_id: req.params.id
		},
		{
			$pull:
			{
				numeros:
				{
					_id: req.params.idnumero
				}
			}
		}, (err, response) => {
			if (err) {
				res.send({ message: 'Ups, also paso en la base' })
			} else {
				if (!response) {
					res.send({ message: 'esa numero no existe' })
				} else {
					res.send({ message: 'Numero eliminada' })
				}
			}
		});
}

productosCtrl.addTalla = async (req, res, next) => {
	const { talla, cantidad } = req.body;
	console.log(req.body)
	await Producto.updateOne(
		{
			_id: req.params.id
		},
		{
			$addToSet:
			{
				tallas:
				[{
					talla: talla,
					cantidad: cantidad
				}]
			}
		}, (err, response) => {
			if (err) {
				res.send({ messege: 'Ups, algo al guardar talla' });
			} else {
				if (!response) {
					res.send({ message: 'Error al guardar' });
				} else {
					res.send({ message: 'talla guardada' });
				}
			}
		}
	);
}

productosCtrl.addnumero = async (req, res, next) => {
	const { numero, cantidad } = req.body;
	console.log(req.body)
	await Producto.updateOne(
		{
			_id: req.params.id
		},
		{
			$addToSet:
			{
				numeros:
				{
					numero: numero,
					cantidad: cantidad
				}
			}
		}, (err, response) => {
			if (err) {
				res.send({ messege: 'Ups, algo al guardar numero' });
			} else {
				if (!response) {
					res.send({ message: 'Error al guardar' });
				} else {
					res.send({ message: 'numero guardado' });
				}
			}
		}
	);
}

productosCtrl.subirImagen = (req, res, next) => {
	imagen.upload(req, res, function (error) {
		if (error) {
			res.json({ message: "Ups algo salio mal",error });
		}
		return next();
	});
};

productosCtrl.getProductos = async (req, res) => {
	const { page = 1, limit = 10 } = req.query;

	const options = {
		page,
		limit: parseInt(limit)
	}
	Producto.paginate({}, options, (err, postStored) => {
		if (err) {
			res.send({  messege: "Error en el servidor" });
		} else {
			if (!postStored) {
				res.send({ messege: "Error al mostrar Blogs" })
			} else {
				res.send({ posts: postStored });
			}
		}
	});
};

productosCtrl.createProducto = async (req, res) => {
	const newProducto = new Producto(req.body);
	newProducto.activo = true;
	if (req.file) {
		newProducto.imagen = req.file.filename;
	}
	await newProducto.save((err, userStored) => {
		if (err) {
			res.json({ message: 'Ups, algo paso al registrar el producto', err});
		} else {
			if (!userStored) {
				res.send({ message: 'Error al crear el producto' });
			} else {
				res.send({ message: 'Producto almacenado', userStored});
			}
		}
	});
};

productosCtrl.getProducto = async (req, res, next) => {
	const producto = await Producto.findById(req.params.id);
	if (!producto) {
		res.json({ message: "Este producto no existe" });
		return next();
	}
	res.json(producto);
};

productosCtrl.updateProducto = async (req, res, next) => {
	try {
		const productoDeBase = await Producto.findById(req.params.id);
		//Construir nuevo producto
		const nuevoProducto = req.body;
		//Verificar si mandaron imagen
		if (req.file) {
			nuevoProducto.imagen = req.file.filename;
			await imagen.eliminarImagen(productoDeBase.imagen);
		} else {
			nuevoProducto.imagen = productoDeBase.imagen;
		}
		const producto = await Producto.findByIdAndUpdate(req.params.id, nuevoProducto);
		res.json(producto);
	} catch (error) {
		console.log(error);
		next();
	}
};

productosCtrl.updateProductoCantidad = async (req, res) => {
	const { cantidad, operacion } = req.body;
	const query = await Producto.findById(req.params.id).select('cantidad -_id');
	switch (operacion) {
		case '+':
			await Producto.findByIdAndUpdate(req.params.id, { $set: { cantidad: query.cantidad + cantidad } });
			res.json({ message: `Se sumaron ${cantidad} productos del stock ` });
			break;

		case '-':
			if (cantidad <= query.cantidad) {
				await Producto.findByIdAndUpdate(req.params.id, { $set: { cantidad: query.cantidad - cantidad } });
				res.json({ message: `Se restaron ${cantidad} productos del stock ` });
			} else {
				res.json({ message: 'Cantidad no disponible' });
			}
			break;

		default:
			res.json({ message: 'Se esperaba una operacion valida' });
			break;
	}
};

productosCtrl.deleteProducto = async (req, res, next) => {
	const productoDeBase = await Producto.findById(req.params.id);
	if (productoDeBase.imagen) {
		await imagen.eliminarImagen(productoDeBase.imagen);
	}

	const producto = await Producto.findByIdAndDelete(req.params.id);
	if (!producto) {
		res.json({ message: 'Este producto no existe' });
	}
	res.json({ message: 'Producto eliminado' });


};

module.exports = productosCtrl;
