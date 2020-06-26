const { Schema, model } = require('mongoose');

const ApartadoSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'producto'
    },
    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente'
    },
    cantidad: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['PEDIDO', 'ACEPTADO', 'RECHAZADO'],
        default: 'PEDIDO'
    }

});

module.exports = model('apartado', ApartadoSchema);