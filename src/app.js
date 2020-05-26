const express = require('express');
const cors = require('cors');
const app = express();


//settings
app.set('port', process.env.PORT || 4000);

//middlewares
app.use(cors());
app.use(express.json());

//rutes
app.use('/api/blog', require('./routes/blog'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/admin', require('./routes/administrador'));
app.use('/api/pago', require('./routes/pagos'));
app.use('/api/detalle-de-pedido', require('./routes/detallePedido'));

module.exports = app;