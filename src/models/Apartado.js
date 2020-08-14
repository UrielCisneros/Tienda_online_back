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
    medida:{
        talla: String,
        numero: String
    },
    estado: {
        type: String,
        required: true
    }

});

module.exports = model('apartado', ApartadoSchema);