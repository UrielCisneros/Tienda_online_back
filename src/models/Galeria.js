const { Schema, model } = require('mongoose');

const GaleriaSchema = new Schema({
    iddocumento: {
        type: String,
        required: true
    },
    imagenes: [{
        numero_imagen: Number,
        url: String
    }]
});

module.exports = model('galeria', GaleriaSchema);