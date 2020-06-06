const { Schema, model } = require('mongoose');


const detallePedidoSchema = new Schema({
    id_pedido: {
        type: String,
        required: true
    },
    articulos: {
        idarticulo: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        },
        precio: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    },
    unidades: {
        type: String
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    total: Number
}, {
    timestamps: true
});

module.exports = model('DetallePedido', detallePedidoSchema);

