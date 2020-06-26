const { Schema, model } = require('mongoose');

const pagoSchema = new Schema({
    id_objeto_sesion_stripe: {
        type: String
    },
    intento_pago: {
        type: String
    },
    orden: {
        type: String
    },
    cliente: {
        type: String
    },
    email_cliente: {
        type: String
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = model('Pago', pagoSchema);