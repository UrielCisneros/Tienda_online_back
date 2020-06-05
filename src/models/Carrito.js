const { Schema, model } = require('mongoose');

const CarritoSchema = new Schema({
    cliente: {
        /* type: Schema.ObjectId,
        ref: 'Cliente' */
        type: String,
        required: true
    },
    articulos: [{
        idarticulo: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        precio: {
            type: Number,
            required: true
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
    total: {
        type: Number,
        required: true
    }
});

module.exports = model('carrito', CarritoSchema);