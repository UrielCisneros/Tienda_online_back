const { Schema, model } = require('mongoose');

const GaleriaSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'Producto'
    },
    imagenes: [{
        url: String
    }]
});

module.exports = model('galeria', GaleriaSchema);