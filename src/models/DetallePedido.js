
var mongoose = require('mongoose');
const { Schema, model } = mongoose;


const detallePedidoSchema = new Schema({
    id_pedido: {
        type: Schema.ObjectId,
        ref: 'Pedidos'
    },
    id_pago: {
        type: Schema.ObjectId,
        ref: 'Pago'
    },
    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente'
    }
}, {
    timestamps: true
});

module.exports = model('DetallePedido', detallePedidoSchema);

