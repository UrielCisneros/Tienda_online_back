var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose,4);
const mongoodePaginate = require('mongoose-paginate-v2');

const ProductoSchema = new mongoose.Schema({
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
		type: Number
	},
	precio: {
		type: Float,
		required: true
	},
	imagen: {
		type: String
	},
	promocion: [
		{
			imagenPromocion: {
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
	codigo: {
		type: String, 
		trim: true
	},
	activo: Boolean
});

ProductoSchema.plugin(mongoodePaginate);

module.exports = mongoose.model('producto', ProductoSchema);
