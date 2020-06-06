const productosCtrl = {};
const imagen = require('./uploadFile.controllers');
const Producto = require('../models/Producto');
const path = require('path');

const fs = require('fs');




productosCtrl.subirImagen = (req, res, next) => {
	imagen.upload(req, res, function (error) {
		if (error) {
			res.json({ message: error });
		}
		return next();
	});
};

productosCtrl.getProductos = async (req, res) => {
	const productos = await Producto.find();
	res.json(productos);
};

productosCtrl.createProducto = async (req, res) => {
	const newProducto = new Producto(req.body);
	newProducto.activo = true;
	if (req.file.filename) {
		newProducto.imagen = req.file.filename;
	}
	await newProducto.save((err, userStored) => {
		if (err) {
			res.status(500).send({ messege: 'Ups, algo paso al registrar el producto' });
		} else {
			if (!userStored) {
				res.status(404).send({ message: 'Error al crear el producto' });
			} else {
				res.status(200).send({ message: 'Producto almacenado' });
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
		/* 		if (req.file && productoDeBase.imagen) {
					const imagenAnterior = await path.join(__dirname, `/../public/img/${productoDeBase.imagen}`);
					console.log("Rita se imagen de la base: " + imagenAnterior);
					await fs.unlink(imagenAnterior, (error) => {
						if (error) {
							console.log(error);
						}
						return
					});
				} */

		if (req.file) {
			nuevoProducto.imagen = req.file.filename;
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
		const imagenAnterior = path.join(__dirname, `/../public/img/${productoDeBase.imagen}`);
		await fs.unlink(imagenAnterior, (error) => {
			if (error) {
				console.log(error);
			}
			return
		});
	}

	const producto = await Producto.findByIdAndDelete(req.params.id);
	if (!producto) {
		res.json({ message: 'Este producto no existe' });
	}
	res.json({ message: 'Producto eliminado' });


};

module.exports = productosCtrl;
