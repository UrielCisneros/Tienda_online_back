const { Schema, model } = require('mongoose');

const bcript = require('bcrypt');

const ClienteSchema = new Schema({
	nombre: {
		type: String,
		required: true,
		trim: true
	},
	apellido: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	telefono: {
		type: String
	},
	active: Boolean,
	direccion: [
		{
			calle_numero: {
				type: String
			},
			entre_calles: {
				type: String
			},
			cp: {
				type: String
			},
			colonia: {
				type: String
			},
			ciudad: {
				type: String
			},
			estado: {
				type: String
			}
		}
	],
	contrasena: {
		type: String,
		required: true
	},
	imagen: String
});

ClienteSchema.methods.encrypPassword = async (password) => {
	const salt = await bcript.genSalt(10);
	return await bcript.hash(password, salt);
};

ClienteSchema.methods.matchPassword = async function(password) {
	return await bcript.compare(password, this.password);
};

module.exports = model('cliente', ClienteSchema);
