const productosCtrl = {};
const imagen = require('./uploadFile.controllers');
const Producto = require('../models/Producto');





productosCtrl.subirImagen = (req, res, next) => {
	imagen.upload(req, res, function (error) {
		if (error) {
			res.json({ message: error });
		}
		return next();
	});
};

productosCtrl.getProductos = async (req, res) => {
	const { page = 1, limit = 10 } = req.query;

	const options = {
		page,
		limit: parseInt(limit),
		sort: { date: "desc" }
	}
	Producto.paginate({}, options, (err, postStored) => {
		if (err) {
			res.status(500).send({ code: 500, messege: "Error en el servidor" });
		} else {
			if (!postStored) {
				res.status(404).send({ code: 404, messege: "Error al mostrar Blogs" })
			} else {
				res.status(200).send({ code: 200, posts: postStored });
			}
		}
	});
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
