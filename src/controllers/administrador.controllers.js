const adminCtrl = {};
const bcrypt = require('bcrypt-nodejs');
const adminModel = require('../models/Administrador');
const jwt = require('jsonwebtoken')

adminCtrl.getAdmins = async (req, res) => {
	const admins = await adminModel.find();
	res.json(admins);
};

adminCtrl.createAdmin = async (req, res) => {
	const newAdmin = new adminModel();
	const { nombre, email, contrasena, repeatContrasena } = req.body;

	newAdmin.nombre = nombre;
	newAdmin.email = email;
	newAdmin.rol = true;
	newAdmin.activo = false;

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
					newAdmin.contrasena = hash;
					newAdmin.save((err, userStored) => {
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

adminCtrl.updateAdmin = async (req, res) => {
	const { nombre, email, contrasena, imagen } = req.body;
	const admin = await adminModel.findById(req.params.id);
	if (imagen == null && admin.imagen != null) {
		newimagen = admin.imagen;
		await adminModel.findByIdAndUpdate(req.params.id, {
			nombre,
			email,
			contrasena,
			imagen: admin.imagen
		});
	} else {
		await adminModel.findByIdAndUpdate(req.params.id, {
			nombre,
			email,
			contrasena,
			imagen
		});
	}
	res.json({ messege: 'Admin Update' });
};

adminCtrl.getAdmin = async (req, res) => {
	const admin = await adminModel.findById(req.params.id);
	res.json(admin);
};

adminCtrl.deleteAdmin = async (req, res) => {
	await adminModel.findByIdAndDelete(req.params.id);
	res.json({ message: 'Admin Deleted' });
};

adminCtrl.authAdmin = async (req, res, next) => {
	const { email, contrasena } = req.body;
	const admin = await adminModel.findOne({ email });

	if(!admin){
		await res.status(401).json({ message: 'Este usuario no existe' });
	}else{
		if(!bcrypt.compareSync(contrasena, admin.contrasena)){
			await res.status(401).json({ message: 'Contraseña incorrecta' });
			next();
		}else{
			const token = jwt.sign({
				email : admin.email,
				nombre: admin.nombre,
				_id: admin._id,
				rol: admin.rol
			},
			process.env.AUTH_KEY,
			{
				expiresIn : '1h'
			});
			//token
			res.json(token);
		}
	}
}

module.exports = adminCtrl;
