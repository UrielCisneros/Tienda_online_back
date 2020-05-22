const { Schema, model } = require('mongoose');

const ApartadoSchema = new Schema({
    producto: {
        type: String,
        required: true
    },
    cliente: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    estado: Boolean

});

module.exports = model('apartado', ApartadoSchema);