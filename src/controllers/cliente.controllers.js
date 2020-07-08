const clienteCtrl = {};
const imagen = require('./uploadFile.controllers');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken')
const clienteModel = require('../models/Cliente');
const adminModel = require('../models/Administrador');


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
		res.status(200).json(clientes);
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
	console.log(req.body)
	const repeatContrasena  = req.body.repeatContrasena;
	const contrasena = req.body.contrasena;
	console.log(contrasena, repeatContrasena)
	const newCliente = new clienteModel(req.body);
	newCliente.active = false;
	if (!contrasena || !repeatContrasena) {
		res.send({ message: 'Las contrasenas son obligatorias' });
	} else {
		if (contrasena !== repeatContrasena) {
			res.send({ message: 'Las contrasenas no son iguales' });
		} else {
			bcrypt.hash(contrasena, null, null, function (err, hash) {
				if (err) {
					res.send({ message: 'Error al encriptar la contrasena',err });
				} else {
					newCliente.contrasena = hash;
					newCliente.save((err, userStored) => {
						if (err) {
							res.send({ message: 'Ups, algo paso al registrar el usuario', err });
						} else {
							if (!userStored) {
								res.send({ message: 'Error al crear el usuario' });
							} else {
								const token = jwt.sign({
									email : newCliente.email,
									nombre: newCliente.nombre,
									_id: newCliente._id,
									role:"User"
								},
								'HiXYE@Ay%39e;',
								{
									expiresIn : '4h'
								});
								res.send({ user: token });
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
			await imagen.eliminarImagen(clienteBase.imagen);
		} else {
			nuevoCliente.imagen = clienteBase.imagen;
		}

		 await clienteModel.findByIdAndUpdate(req.params.id, nuevoCliente, async (err, userStored) => {
			if (err) {
				res.send({ messege: 'Ups, algo paso al registrar el usuario', err });
			} else {
				if (!userStored) {
					res.send({ message: 'Error al crear el usuario' });
				} else {
					const clienteBase = await clienteModel.findById(req.params.id);
					const token = jwt.sign({
						email : clienteBase.email,
						nombre: clienteBase.nombre,
						_id: clienteBase._id,
						imagen: clienteBase.imagen
					},
					"HiXYE@Ay%39e;",
					{
						expiresIn : '4h'
					});
					res.send({ user: token });
				}
			}
		});
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

clienteCtrl.deleteCliente = async (req, res, next) => {
	const clienteDeBase = await clienteModel.findById(req.params.id);
	if (clienteDeBase.imagen) {
		await imagen.eliminarImagen(clienteDeBase.imagen);
	}
	await clienteModel.findByIdAndDelete(req.params.id);
	res.json({ message: 'Cliente Deleted' });
};

clienteCtrl.authCliente = async (req, res, next) => {
	const { email } = req.body;
	console.log(req.body);
	const contrasena = req.body.contrasena;
	console.log("Pass: "+req.body.contrasena);
	const admin = await adminModel.findOne({email});
	console.log(admin);
	console.log(contrasena);
	if(admin){
		try {
			if(!bcrypt.compareSync(contrasena, admin.contrasena)){
				res.json({ message: 'Contraseña incorrecta' });
				next();
			}else{
				const token = jwt.sign({
					email : admin.email,
					nombre: admin.nombre,
					_id: admin._id,
					rol: true
				},
				'HiXYE@Ay%39e;'
				);
				//token
				res.json({token});
			}
		} catch (error) {
			console.log(error)
			 res.json({ message: 'Algo ocurrio',error });
		}
	}else{
		try {
			const cliente = await clienteModel.findOne({ email });
			console.log(cliente,contrasena);
			if(!cliente){
				 res.json({ message: 'Este usuario no existe' });
			}else{
				if(!bcrypt.compareSync(contrasena, cliente.contrasena)){
					console.log("entro")
					 res.json({ message: 'Contraseña incorrecta' });
					next();
				}else{
					const token = jwt.sign({
						email : cliente.email,
						nombre: cliente.nombre,
						_id: cliente._id,
						rol: false
					},
					'HiXYE@Ay%39e;',
					{ expiresIn: '1h' }
					);
					//token
					res.json({token});
				}
			}
		} catch (error) {
			console.log(error)
			 res.json({ message: 'Algo ocurrio',error });
		}
	}
}


clienteCtrl.authFirebase = async (req, res) => {
	const { email, nombre, imagen, token } = req.body;
	console.log(req.body)
	const cliente = await clienteModel.findOne({email});
	if(cliente){
		if(!bcrypt.compareSync(token, cliente.contrasena)){
			await res.json({ message: 'Contraseña incorrecta' });
			next();
		}else{
			const token = jwt.sign({
				email : cliente.email,
				nombre: cliente.nombre,
				_id: cliente._id,
				rol: false
			},
			'HiXYE@Ay%39e;'
			);
			//token
			res.json({token});
		}
	}else{
		try {
			const newcliente = new clienteModel();
			newcliente.nombre = nombre;
			newcliente.email = email;
			newcliente.imagen = imagen;
			bcrypt.hash(token, null, null, function(err, hash) {
				if (err) {
					res.send({ messege: 'Error al encriptar la contrasena',err });
				} else {
					newcliente.contrasena = hash;
					newcliente.save((err, userStored) => {
						if (err) {
							res.send({ messege: 'Ups, algo paso al registrar el usuario',err });
						} else {
							if (!userStored) {
								res.send({ message: 'Error al crear el usuario' });
							} else {
								const token = jwt.sign({
									email : newcliente.email,
									nombre: newcliente.nombre,
									_id: newcliente._id,
									rol: false
								},
								'HiXYE@Ay%39e;'
								);
								//token
								res.json({token});
							}
						}
					});
				}
			});
		} catch (err) {
			console.log(err);
			res.json({ message: 'Contraseña incorrecta', err });
		}
	}
}

module.exports = clienteCtrl;

