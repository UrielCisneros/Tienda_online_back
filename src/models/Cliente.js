const { Schema, model } = require('mongoose');

const ClienteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: String,
        required: true,
        unique: true
    },
    direccion: {
        calle_numero: {
            type: String,
            required: true
        },
        entre_calles: {
            type: String,
            required: true
        },
        cp: {
            type: String,
            required: true
        },
        colonia: {
            type: String,
            required: true
        },
        ciudad: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            required: true
        }

    },
    contrasena: {
        type: String,
        required: true
    },
    imagen: String
});
module.exports = model('cliente', ClienteSchema);