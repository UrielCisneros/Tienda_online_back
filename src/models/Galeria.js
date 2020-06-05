const { Schema, model } = require('mongoose');

const GaleriaSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'Producto'
    },
    imagenes: [{
        numero_imagen: Number,
        url: String
    }]
});

module.exports = model('galeria', GaleriaSchema);