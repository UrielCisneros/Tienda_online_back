const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    categoria: {
        type: String,
        required: true,
        trim: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    promocion: {
        imagen: String,
        precio: Number
    },
    description: {
        type: String,
        trim: true
    },
    activo: Boolean

});

module.exports = model('producto', ProductoSchema);