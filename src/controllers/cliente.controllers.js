const clienteCtrl = {};
const bcrypt = require('bcrypt-nodejs');
const clienteModel = require('../models/Cliente');

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
	console.log(req.body);
	const newCliente = new clienteModel();
	const { nombre, apellido, email, contrasena, repeatContrasena } = req.body;

	newCliente.nombre = nombre;
	newCliente.apellido = apellido;
	newCliente.email = email;
	newCliente.active = false;

	if (!contrasena || !repeatContrasena) {
		res.status(404).send({ messege: 'Las contrasenas son obligatorias' });
	} else {
		if (contrasena !== repeatContrasena) {
			res.status(404).send({ message: 'Las contrasenas no son iguales' });
		} else {
			bcrypt.hash(contrasena, null, null, function(err, hash) {
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
