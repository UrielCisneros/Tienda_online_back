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
		trim: true
	},
	tallas: [{
		talla: String,
		cantidad: Number
	}],
	numeros: [{
		numero: String,
		cantidad: Number
	}],
	color: String,
	cantidad: {
		type: Number,
		required: true
	},
	precio: {
		type: String,
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
