const { Schema, model } = require('mongoose');

const CarritoSchema = new Schema({
    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente'
    },
    articulos: [{
        idarticulo: {
            type: Schema.ObjectId,
            ref: "producto"
        },
        cantidad: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
/*     total: {
        type: Number,
        required: true
    } */
});

module.exports = model('carrito', CarritoSchema);