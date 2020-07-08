
var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose,4);

const pedidosSchema = new mongoose.Schema(
	{
		cliente: {
			type: mongoose.Schema.ObjectId,
			ref: 'cliente'
		},
		fecha_envio: {
			type: Date
		},
		pedido: [
			{
				producto: {
					type: mongoose.Schema.ObjectId,
					ref: 'producto'
				},
				cantidad: Number,
				talla: String,
				numero: String
			}
		],
		total: {
			type: Float
		},
		estado_pedido: {
			type: String
		},
		mensaje_admin: String,
		pagado: Boolean
	
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Pedidos', pedidosSchema);
