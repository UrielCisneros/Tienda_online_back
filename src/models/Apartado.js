const { Schema, model } = require('mongoose');
const mongoodePaginate = require('mongoose-paginate-v2');

const ApartadoSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'producto'
    },
    cliente: {
        type: Schema.ObjectId,
        ref: 'cliente'
    },
    cantidad: {
        type: Number,
        required: true
    },
    medida: [{
        talla: String,
        numero: String
    }],
    estado: {
        type: String,
        required: true
    },
    tipoEntrega: {
        type: String,
        required: true
    },
    url:{
        type: String
    },
    servicio: {
        type: String
    },
    codigo_seguimiento: {
        type: String
    }

},
{
    timestamps: true
});

ApartadoSchema.plugin(mongoodePaginate);

module.exports = model('apartado', ApartadoSchema);