const { Schema, model } = require('mongoose');

const TiendaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    direccion: [
        {
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
    
        }
    ],
    telefono: {
        type: Number,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    mision: {
        type: String,
        required: true
    },
    vision: {
        type: String,
        required: true
    },
    politicas: {
        type: String,
        required: true
    },
    terminos: {
        type: String,
        required: true
    },
    activo: Boolean

});

module.exports = model('tienda', TiendaSchema);