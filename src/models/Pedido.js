const { Schema, model } = require('mongoose');

const pedidosSchema = new Schema(
	{
		cliente: {
			type: Schema.ObjectId,
			ref: 'cliente'
		},
		fecha_creacion: {
			type: Date,
			default: Date.now
		},
		fecha_envio: {
			type: Date
		},
		pedido: [
			{
				producto: {
					type: Schema.ObjectId,
					ref: 'producto'
				},
				cantidad: Number
			}
		],
		total: {
			type: Number
		},
		estado_pedido: {
			type: String,
			required: true
		},
		mensaje_admin: String
	},
	{
		timestamps: true
	}
);

module.exports = model('Pedidos', pedidosSchema);
