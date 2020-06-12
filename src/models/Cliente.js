const { Schema, model } = require('mongoose');

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
			},
			pais: {
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

module.exports = model('cliente', ClienteSchema);
