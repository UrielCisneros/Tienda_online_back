const { Schema, model } = require('mongoose');

const CarouselSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'producto'
    },
    imagen: String
});

module.exports = model('carousel', CarouselSchema);