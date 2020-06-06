const { Schema, model } = require('mongoose');

const ApartadoSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'Producto'
    },
    cliente: {
        type: Schema.ObjectId,
        ref: 'Cliente'
    },
    cantidad: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['PEDIDO', 'EN PROCESO', 'ENVIADO'],
        default: 'APARTADO'
    }

});

module.exports = model('apartado', ApartadoSchema);