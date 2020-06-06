const { Schema, model } = require('mongoose');

const pagoSchema = new Schema({
    id_objeto_sesion_stripe: {
        type: String,
        required: true
    },
    intento_pago: {
        type: String
    },
    orden: {
        type: String,
        required: true
    },
    cliente: {
        type: String,
        required: true
    },
    email_cliente: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    hora: {
        type: TimeRanges,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Pago', pagoSchema);