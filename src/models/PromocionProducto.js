var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose,4);
const { Schema, model } = mongoose;

const PromocionSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'producto'
    },
    precioPromocion: Float,
    imagenPromocion: String
});

module.exports = model('carousel', PromocionSchema);