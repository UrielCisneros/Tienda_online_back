const clienteCtrl = {};
const imagen = require('./uploadFile.controllers');
const path = require('path');
const fs = require('fs');
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
	const newCliente = new clienteModel(req.body);
	const { contrasena, repeatContrasena } = req.body;
	newCliente.active = false;
	if (req.file.filename) {
		newProducto.imagen = req.file.filename;
	}
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
		const cliente = clienteModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
			new: true
		});
		res.json(cliente);
	} catch (error) {
		console.log(error);
		next();
	}
};

clienteCtrl.deleteCliente = async (req, res) => {
	await clienteModel.findByIdAndDelete(req.params.id);
	res.json({ message: 'Cliente Deleted' });
};

clienteCtrl.uploadAvatar = (req, res) => {
	const params = req.params;
};

module.exports = clienteCtrl;
