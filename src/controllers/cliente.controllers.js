const clienteCtrl = {};
const imagen = require('./uploadFile.controllers');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const clienteModel = require('../models/Cliente');


clienteCtrl.subirImagen = async (req, res, next) => {
	await imagen.upload(req, res, function (error) {
		if (error) {
			res.json({ message: error });
		}
		return next();
	});
};

clienteCtrl.getClientes = async (req, res, next) => {
	try {
		const clientes = await clienteModel.find();
		res.json(clientes);
	} catch (error) {
		console.log(error);
		next();
	}
};

clienteCtrl.getCliente = async (req, res, next) => {
	const cliente = await clienteModel.findById(req.params.id);
	if (!cliente) {
		res.json({ messege: 'Este cliente no existe' });
		next();
	}
	res.json(cliente);
};

clienteCtrl.createCliente = (req, res) => {
	const { contrasena, repeatContrasena } = req.body;
	const newCliente = new clienteModel(req.body);
	newCliente.active = false;
	console.log(req.body);
	if (!contrasena || !repeatContrasena) {
		res.status(404).send({ messege: 'Las contrasenas son obligatorias' });
	} else {
		if (contrasena !== repeatContrasena) {
			res.status(404).send({ message: 'Las contrasenas no son iguales' });
		} else {
			bcrypt.hash(contrasena, null, null, function (err, hash) {
				if (err) {
					res.status(500).send({ messege: 'Error al encriptar la contrasena' });
				} else {
					newCliente.contrasena = hash;
					newCliente.save((err, userStored) => {
						if (err) {
							res.status(500).send({ messege: 'Ups, algo paso al registrar el usuario' });
						} else {
							if (!userStored) {
								res.status(404).send({ message: 'Error al crear el usuario' });
							} else {
								res.status(200).send({ user: userStored });
							}
						}
					});
				}
			});
		}
	}
};



clienteCtrl.updateCliente = async (req, res, next) => {
	try {
		const clienteBase = await clienteModel.findById(req.params.id);
		const nuevoCliente = req.body;
		const { contrasena, repeatContrasena } = req.body;

		await verificarPass(nuevoCliente, contrasena, repeatContrasena);

		if (req.file) {
			nuevoCliente.imagen = req.file.filename;
			await imagen.eliminarImagen(clienteBase);
		} else {
			nuevoCliente.imagen = clienteBase.imagen;
		}

		const cliente = await clienteModel.findByIdAndUpdate(req.params.id, nuevoCliente);
		res.json(cliente);
	} catch (error) {
		console.log(error);
		next();
	}
};

function verificarPass(nuevoCliente, contrasena, repeatContrasena) {
	if (contrasena && repeatContrasena) {
		if (contrasena !== repeatContrasena) {
			res.status(404).send({ message: 'Las contrasenas no son iguales' });
		} else {
			verificarPass
			bcrypt.hash(contrasena, null, null, function (err, hash) {
				if (err) {
					res.status(500).send({ messege: 'Error al encriptar la contrasena' });
				} else {
					nuevoCliente.contrasena = hash;
				}
			});
		}
	}
}

clienteCtrl.deleteCliente = async (req, res) => {
	const clienteDeBase = await clienteModel.findById(req.params.id);
	if (clienteDeBase.imagen) {
		await imagen.eliminarImagen(clienteDeBase);
	}
	await clienteModel.findByIdAndDelete(req.params.id);
	res.json({ message: 'Cliente Deleted' });
};

module.exports = clienteCtrl;
