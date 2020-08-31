const carritoCtrl = {};
const Carrito = require('../models/Carrito');
const Producto = require('../models/Producto');
const mongoose = require('mongoose');

carritoCtrl.crearCarrito = async (req, res, next) => {
	const carrito = await Carrito.findOne({ cliente: req.params.idCliente });
	if (!carrito) {
		const { cliente, articulos: [ { idarticulo, cantidad, medida } ] } = req.body;
		const articulos = await Producto.aggregate([
			{
				$lookup: {
					from: 'promocions',
					localField: '_id',
					foreignField: 'productoPromocion',
					as: 'promocion'
				}
			},
			{
				$match: {
					_id: mongoose.Types.ObjectId(idarticulo)
				}
			}
		]);
		articulos.map(async (productos) => {
			if (!medida) {
				if (cantidad > productos.cantidad) {
					res.status(404).json({ messege: 'Cantidad de articulos es mayor al stock' });
				} else {
					if (productos.promocion.length) {
						var precio = productos.promocion[0].precioPromocion;
					} else {
						var precio = productos.precio;
					}
					const subtotal = precio * cantidad;
					const newCarrito = new Carrito({
						cliente,
						articulos: [ { idarticulo, cantidad, medida, subtotal } ]
					});

					await newCarrito.save((err, response) => {
						if (err) {
							res.status(500).json({ messege: 'Hubo un error al crear el Carrito', err });
						} else {
							if (!response) {
								res.status(404).json({ message: 'Error al crear el Carrito' });
							} else {
								res.status(200).json({ message: 'Carrito creado', response });
							}
						}
					});
				}
			} else {
				if (!productos.numeros.length) {
					productos.tallas.map(async (talla) => {
						if (medida === talla.talla && cantidad > talla.cantidad) {
							res.status(404).json({ messege: 'Cantidad de articulos es mayor al stock (talla)' });
						} else if (medida === talla.talla && cantidad < talla.cantidad) {
							if (productos.promocion.length) {
								var precio = productos.promocion[0].precioPromocion;
							} else {
								var precio = productos.precio;
							}
							/* const precio = productos.precio; */
							const subtotal = precio * cantidad;
							const newCarrito = new Carrito({
								cliente,
								articulos: [ { idarticulo, cantidad, medida, subtotal } ]
							});

							await newCarrito.save((err, response) => {
								if (err) {
									res.status(500).json({ messege: 'Hubo un error al crear el Carrito', err });
								} else {
									res.status(200).json({ message: 'Carrito creado', response });
								}
							});
						}
					});
				} else if (!productos.tallas.length) {
					productos.numeros.map(async (numero) => {
						if (medida === numero.numero && cantidad > numero.cantidad) {
							res.status(404).json({ messege: 'Cantidad de articulos es mayor al stock (numero)' });
						} else if (medida === numero.numero && cantidad < numero.cantidad) {
							console.log(productos.promocion);
							if (productos.promocion.length) {
								console.log('hay promocion');
								var precio = productos.promocion[0].precioPromocion;
							} else {
								console.log('no hay promocion');
								var precio = productos.precio;
							}
							console.log(precio);
							/* const precio = productos.precio; */
							const subtotal = precio * cantidad;
							const newCarrito = new Carrito({
								cliente,
								articulos: [ { idarticulo, cantidad, medida, subtotal } ]
							});

							await newCarrito.save((err, response) => {
								if (err) {
									res.status(500).json({ messege: 'Hubo un error al crear el Carrito', err });
								} else {
									res.status(200).json({ message: 'Carrito creado', response });
								}
							});
						}
					});
				}
			}
		});
	} else {
		next();
	}
};

carritoCtrl.obtenerCarrito = async (req, res) => {
	try {
		const carrito = await Carrito.findOne({ cliente: req.params.idCliente })
			.populate('cliente', 'nombre apellido')
			.populate('articulos.idarticulo', 'nombre precio imagen');

		if (!carrito) {
			res.status(200).json([]);
		} else {
			res.status(200).json(carrito);
		}
	} catch (error) {
		res.status(500).json({ mensaje: 'Error al obtener carrito', error });
	}
};

carritoCtrl.agregarArticulo = async (req, res) => {
	const carrito = await Carrito.findOne({ cliente: req.params.idCliente });
	const { articulos: [ { idarticulo, cantidad, medida } ] } = req.body;
	const articulos = await Producto.aggregate([
		{
			$lookup: {
				from: 'promocions',
				localField: '_id',
				foreignField: 'productoPromocion',
				as: 'promocion'
			}
		},
		{
			$match: {
				_id: mongoose.Types.ObjectId(idarticulo)
			}
		}
	]);
	articulos.map(async (productos) => {
		if (!medida) {
			if (cantidad > productos.cantidad) {
				res.status(404).json({ messege: 'Cantidad de articulos es mayor al stock' });
			} else {
				if (productos.promocion.length) {
					var precio = productos.promocion[0].precioPromocion;
				} else {
					var precio = productos.precio;
				}
				/* const precio = productos.precio; */
				const subtotal = precio * cantidad;
				await Carrito.updateOne(
					{
						_id: carrito._id
					},
					{
						$addToSet: {
							articulos: [
								{
									idarticulo,
									cantidad,
									medida,
									subtotal
								}
							]
						}
					},
					(err, response) => {
						if (err) {
							res.status(500).json({ messege: 'Hubo un error al agregar articulo', err });
						} else {
							if (!response) {
								res.status(404).json({ message: 'Error al crear el articulo' });
							} else {
								res.status(200).json({ message: 'Articulo agregado', response });
							}
						}
					}
				);
			}
		} else {
			if (!productos.numeros.length) {
				productos.tallas.map(async (talla) => {
					if (medida === talla.talla && cantidad > talla.cantidad) {
						res.status(404).json({ messege: 'Cantidad de articulos es mayor al stock' });
					} else if (medida === talla.talla && cantidad <= talla.cantidad) {
						if (productos.promocion.length) {
							var precio = productos.promocion[0].precioPromocion;
						} else {
							var precio = productos.precio;
						}
						/* const precio = productos.precio; */
						const subtotal = precio * cantidad;
						await Carrito.updateOne(
							{
								_id: carrito._id
							},
							{
								$addToSet: {
									articulos: [
										{
											idarticulo,
											cantidad,
											medida,
											subtotal
										}
									]
								}
							},
							(err, response) => {
								if (err) {
									res.status(500).json({ messege: 'Hubo un error al agregar articulo', err });
								} else {
									if (!response) {
										res.status(404).json({ message: 'Error al crear el articulo' });
									} else {
										res.status(200).json({ message: 'Articulo agregado', response });
									}
								}
							}
						);
					}
				});
			} else if (!productos.tallas.length) {
				productos.numeros.map(async (numero) => {
					if (medida === numero.numero && cantidad > numero.cantidad) {
						res.status(404).json({ messege: 'Cantidad de articulos es mayor al stock' });
					} else if (medida === numero.numero && cantidad <= numero.cantidad) {
						if (productos.promocion.length) {
							var precio = productos.promocion[0].precioPromocion;
						} else {
							var precio = productos.precio;
						}
						/* const precio = productos.precio; */
						const subtotal = precio * cantidad;
						await Carrito.updateOne(
							{
								_id: carrito._id
							},
							{
								$addToSet: {
									articulos: [
										{
											idarticulo,
											cantidad,
											medida,
											subtotal
										}
									]
								}
							},
							(err, response) => {
								if (err) {
									res.status(500).json({ messege: 'Hubo un error al agregar articulo', err });
								} else {
									if (!response) {
										res.status(404).json({ message: 'Error al crear el articulo' });
									} else {
										res.status(200).json({ message: 'Articulo agregado', response });
									}
								}
							}
						);
					}
				});
			}
		}
	});
};

carritoCtrl.eliminarCarrito = async (req, res) => {
	await Carrito.findOneAndDelete({ cliente: req.params.idCliente }, (err, response) => {
		if (err) {
			res.status(500).json({ messege: 'hubo un error al eliminar el Carrito', err });
		} else {
			if (!response) {
				res.status(404).json({ message: 'Carrito no encontrado' });
			} else {
				res.status(200).json({ message: 'Carrito eliminado' });
			}
		}
	});
};

carritoCtrl.eliminarArticulo = async (req, res) => {
	await Carrito.updateOne(
		{
			cliente: req.params.idCliente
		},
		{ $pull: { articulos: { _id: req.params.idArticulo } } },
		(err, response) => {
			if (err) {
				res.status(500).json({ messege: 'Hubo un error al eliminar articulo', err });
			} else {
				if (!response) {
					res.status(404).json({ message: 'Articulo no encontrado' });
				} else {
					res.status(200).json({ message: 'Articulo eliminado' });
				}
			}
		}
	);
};

carritoCtrl.modificarCantidadArticulo = async (req, res) => {
	const { articulos } = await Carrito.findOne({ cliente: req.params.idCliente });
	const articuloFiltrado = articulos.filter((x) => x._id == req.params.idArticulo);

	articuloFiltrado.map(async (articulo) => {
		const idarticulo = articulo.idarticulo;
		const productos = await Producto.find({ _id: idarticulo });
		const { cantidad } = req.body;
		productos.map(async (producto) => {
			if (cantidad > producto.cantidad) {
				res.status(404).json({ messege: 'Cantidad de articulos es mayor al stock' });
			} else {
				const precio = producto.precio;
				const subtotal = cantidad * precio;
				await Carrito.updateOne(
					{
						'articulos._id': req.params.idArticulo
					},
					{
						$set: { 'articulos.$': { idarticulo, cantidad, subtotal } }
					},
					(err, response) => {
						if (err) {
							res.status(500).json({ message: 'Hubo un error al modificar la cantidad', err });
						} else {
							if (!response) {
								res.status(404).json({ message: 'Error al modificar la cantidad' });
							} else {
								res.status(200).json({ message: 'Cantidad Modificada', response });
							}
						}
					}
				);
			}
		});
	});
};

module.exports = carritoCtrl;
