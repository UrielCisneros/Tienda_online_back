const { Schema, model } = require('mongoose');

const mongoodePaginate = require('mongoose-paginate-v2');

const ProductoSchema = new Schema({
	nombre: {
		type: String,
		required: true,
		trim: true
	},
	categoria: {
		type: String,
		required: true,
		trim: true
	},
	talla: {
		type: String,
		required: false
	},
	numero: {
		type: String,
		required: false
	},
	cantidad: {
		type: Number,
		required: true
	},
	precio: {
		type: Number,
		required: true
	},
	imagen: {
		type: String
	},
	promocion: [
		{
			imagen: {
				type: String
			},
			precio: {
				type: Number
			}
		}
	],
	descripcion: {
		type: String,
		trim: true
	},
	activo: Boolean
});

ProductoSchema.plugin(mongoodePaginate);

module.exports = model('producto', ProductoSchema);
