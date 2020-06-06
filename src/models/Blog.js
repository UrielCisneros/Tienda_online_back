const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    administrador: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = model('Blog', blogSchema);