const { Schema, model } = require('mongoose');

const pedidosSchema = new Schema(
	{
		cliente: {
			type: Schema.ObjectId
		},
		telefono: {
			type: String
		},
		fecha_creacion: {
			type: Date,
			default: Date.now
		},
		fecha_envio: {
			type: String,
			required: false
		},
		direccion: {
			calle_numero: {
				type: String,
				required: true
			},
			entre_calles: {
				type: String,
				required: true
			},
			cp: {
				type: String,
				required: true
			},
			colonia: {
				type: String,
				required: true
			},
			ciudad: {
				type: String,
				required: true
			},
			estado: {
				type: String,
				required: true
			}
		},
		referencia: [
			{
				producto: {
					type: Schema.ObjectId,
					ref: 'Producto'
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
