const { Schema, model } = require('mongoose');

const TiendaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    direccion: [
        {
            calle_numero: {
                type: String
            },
            entre_calles: {
                type: String
            },
            cp: {
                type: String
            },
            colonia: {
                type: String
            },
            ciudad: {
                type: String
            },
            estado: {
                type: String
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
    activo: Boolean,
    imagenLogo:{
        type:String
    }
});

module.exports = model('tienda', TiendaSchema);