const productosCtrl = {};
const imagen = require('./uploadFile.controllers');
const Producto = require('../models/Producto');
const promocionModel = require('../models/PromocionProducto');

productosCtrl.deleteImagen = async (req,res) => {
	try {
		const productoDeBase = await promocionModel.findById(req.params.id);
		if(productoDeBase.imagenPromocion){
			await promocionModel.updateOne({"_id":req.params.id},{$unset:{"imagenPromocion":""}},async (err, userStored) => {
				if (err) {
					res.status(500).json({ message: 'Ups, algo paso al eliminar la imagen', err});
				} else {
					if (!userStored) {
						res.status(404).json({ message: 'Error al eliminar la imagen' });
					} else {
						const promocionBase = await promocionModel.findById(userStored._id);
						res.status(200).json({ message: 'Imagen eliminada', promocionBase});
					}
				}
			});
		}else{
			res.status(500).json({ message: "Esta promocion no tiene imagen" })
		}
		
	} catch (error) {
		console.log(error);
		res.json({ error })
	}
}

productosCtrl.getPromociones = async (req,res) => {
	try {
		const promociones = await promocionModel.find().populate('productoPromocion');
		res.status(200).json(promociones);
	} catch (err) {
		res.status(500).send({ message: 'Ups, algo paso al obtener promocion', err });
        next();
	}
}

productosCtrl.getPromocion = async (req,res,next) => {
	try {
		const promociones = await promocionModel.findById(req.params.id).populate('productoPromocion');
		res.status(200).json(promociones);
	} catch (err) {
		res.status(500).send({ message: 'Ups, algo paso al obtener promocion', err });
        next();
	}
}

productosCtrl.getPromocionCarousel = async (req,res,next) => {
    try {
/* 		await promocionModel.aggregate([ { $sample: { size: 10 } }, ]).exec(async function(err, transactions) {
			if(err){
				res.send({ message: 'Ups, algo paso al obtenero el pedidos', err });
			}else{
				await Producto.populate(transactions, {path: 'productoPromocion'}, function(err, populatedTransactions) {
					// Your populated translactions are inside populatedTransactions
					if(err){
						res.send({ message: 'Ups, algo paso al obtenero el pedidos', err });
					}else{
						console.log(populatedTransactions)
						res.json(populatedTransactions);
					}
				});
			}			
		}); */

		const promocion = await promocionModel.find({imagenPromocion:{$exists:true}}).populate('productoPromocion').limit(10);
		res.status(200).send(promocion);
		/* promocion.aggregate([ { $sample: { size: 10 } } ]) */
    } catch (err) {
        res.status(500).send({ message: 'Ups, algo paso al obtener promociones', err });
        next();
    }
}


productosCtrl.crearPromocion = async (req,res) => {
	try {
		const newPromocion = new promocionModel(req.body);
		if (req.file) {
			newPromocion.imagenPromocion = req.file.key;
		}
		await newPromocion.save((err, userStored) => {
			if (err) {
				res.status(500).json({ message: 'Ups, algo paso al crear la promocion', err});
			} else {
				if (!userStored) {
					res.status(404).json({ message: 'Error al crear la promocion' });
				} else {
					res.status(400).json({ message: 'Promocion creada', userStored});
				}
			}
		});
	} catch (err) {
		res.status(500).send({ err })
	}
}


productosCtrl.actualizarPromocion = async (req, res) => {
	try {
		const promocionBase = await promocionModel.findById(req.params.id);
		const newPromocion = req.body;
		if(req.file){
			newPromocion.imagenPromocion = req.file.key;
			if(promocionBase.imagenPromocion){
				await imagen.eliminarImagen(promocionBase.imagenPromocion);
			}
		}else{
			newPromocion.imagenPromocion = promocionBase.imagenPromocion;
		}
		 await promocionModel.findByIdAndUpdate(req.params.id, newPromocion, async (err, userStored) => {
			if (err) {
				res.status(500).json({ message: 'Ups, algo paso al crear al actualizar la promocion', err});
			} else {
				if (!userStored) {
					res.status(404).json({ message: 'Error al actualizar promocion' });
				} else {
					const promocionBase = await promocionModel.findById(userStored._id);
					res.status(200).json({ message: 'Promocion actualizada', promocionBase});
				}
			}
		});
	} catch (err) {
		res.send({ err })
	}


	
}

productosCtrl.eliminarPromocion = async (req, res) => {
	try {
		const promocionBase = await promocionModel.findById(req.params.id);
		if (promocionBase.imagenPromocion) {
			await imagen.eliminarImagen(promocionBase.imagenPromocion);
		}
	
		const promocion = await promocionModel.findByIdAndDelete(req.params.id);
		if (!promocion) {
			res.status(404).json({ message: 'Este promocion no existe' });
		}
		res.status(200).json({ message: 'Promocion eliminada' });
	} catch (err) {
		res.status(500).send({ err })
	}

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
					res.status(500).send({ message: 'Ups algo paso al actualizar', err })
				} else {
					if (!response) {
						res.status(404).send({ message: 'Este apartado no existe' })
					} else {
						res.status(200).send({ message: 'Se actualizo con exito' })
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
					res.status(500).send({ message: 'Ups algo paso al actualizar',err })
				} else {
					if (!response) {
						res.status(404).send({ message: 'Este apartado no existe' })
					} else {
						res.status(200).send({ message: 'Se actualizo con exito' })
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
				res.status(500).send({ message: 'Ups, also paso en la base', err })
			} else {
				if (!response) {
					res.status(404).send({ message: 'esa talla no existe' })
				} else {
					res.status(200).send({ message: 'Talla eliminada' })
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
				res.status(500).send({ message: 'Ups, also paso en la base', err })
			} else {
				if (!response) {
					res.status(404).send({ message: 'esa numero no existe' })
				} else {
					res.status(200).send({ message: 'Numero eliminada' })
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
				res.status(500).send({ message: 'Ups, algo al guardar talla', err });
			} else {
				if (!response) {
					res.status(404).send({ message: 'Error al guardar' });
				} else {
					res.status(200).send({ message: 'talla guardada' });
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
				res.status(500).send({ message: 'Ups, algo al guardar numero', err });
			} else {
				if (!response) {
					res.status(404).send({ message: 'Error al guardar' });
				} else {
					res.status(200).send({ message: 'numero guardado' });
				}
			}
		}
	);
}

productosCtrl.subirImagen = (req, res, next) => {
	imagen.upload(req, res, function (err) {
		if (err) {
			res.status(500).send({ message: "formato de imagen no valido", err });
		}else{
			return next();
		}
	});
};

productosCtrl.getProductos = async (req, res) => {
	const { page = 1, limit = 10 } = req.query;

	const options = {
		page,
		limit: parseInt(limit)
	}
	await Producto.paginate({}, options, (err, postStored) => {
		if (err) {
			res.status(500).send({  message: "Error en el servidor", err });
		} else {
			if (!postStored) {
				res.status(404).send({ message: "Error al mostrar Blogs" })
			} else {
				res.status(200).send({ posts: postStored });
			}
		}
	});
};

productosCtrl.getProductosFiltrados = async (req, res) => {
	await Producto.find({nombre: { $regex: '.*' + req.params.search + '.*', $options: 'i' } },(err, postStored) => {
		if (err) {
			res.status(500).send({  message: "Error en el servidor", err });
		} else {
			if (!postStored) {
				res.status(404).send({ message: "Error al mostrar Productos" })
			} else {
				res.status(200).send({ posts: postStored });
			}
		}
	});
};

productosCtrl.createProducto = async (req, res) => {
	console.log(req.body)
	const newProducto = new Producto(req.body);
	newProducto.activo = true;
	if (req.file) {
		newProducto.imagen = req.file.key;
	}
	await newProducto.save((err, userStored) => {
		if (err) {
			res.status(500).json({ message: 'Ups, algo paso al registrar el producto', err});
		} else {
			if (!userStored) {
				res.status(404).json({ message: 'Error al crear el producto' });
			} else {
				res.status(200).json({ message: 'Producto almacenado', userStored});
			}
		}
	});
};

productosCtrl.getProducto = async (req, res, next) => {
	const producto = await Producto.findById(req.params.id);
	if (!producto) {
		res.status(404).json({ message: "Este producto no existe" });
		return next();
	}
	res.status(200).json(producto);
};

productosCtrl.updateProducto = async (req, res, next) => {
	try {
		const productoDeBase = await Producto.findById(req.params.id);
		//Construir nuevo producto
		const nuevoProducto = req.body;
		//Verificar si mandaron imagen
		if (req.file) {
			nuevoProducto.imagen = req.file.key;
			await imagen.eliminarImagen(productoDeBase.imagen);
		} else {
			nuevoProducto.imagen = productoDeBase.imagen;
		}
		const producto = await Producto.findByIdAndUpdate(req.params.id, nuevoProducto);
		res.status(200).json({message: 'Producto actualizado', producto});
	} catch (error) {
		console.log(error);
		next();
	}
};


productosCtrl.deleteProducto = async (req, res, next) => {
	const productoDeBase = await Producto.findById(req.params.id);
	if (productoDeBase.imagen) {
		await imagen.eliminarImagen(productoDeBase.imagen);
	}

	const producto = await Producto.findByIdAndDelete(req.params.id);
	if (!producto) {
		res.status(500).json({ message: 'Este producto no existe' });
	}
	res.status(200).json({ message: 'Producto eliminado' });


};

module.exports = productosCtrl;
