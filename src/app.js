const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const app = express();

//settings
app.set('port', process.env.PORT || 4000);

//middlewares

app.use(cors());
app.use(express.json());

//rutes
app.use('/api/admin', require('./routes/administrador'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/pago', require('./routes/pagos'));
app.use('/api/detalle-de-pedido', require('./routes/detallePedido'));
app.use('/api/cliente', require('./routes/cliente'));
//routes
app.use('/api/productos', require('./routes/productos'));
app.use('/api/galeria', require('./routes/galeria'));
app.use('/api/tienda', require('./routes/tienda'));
app.use('/api/apartado', require('./routes/apartado'));
app.use('/api/carrito', require('./routes/carrito'));
app.use('/api/sugerencia', require('./routes/sugerencia'));
app.use('/api/carousel', require('./routes/carousel'))

module.exports = app;
