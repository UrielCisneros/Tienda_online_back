const mongoose = require('mongoose');

const URI = 'mongodb://localhost/tiendaonline';


mongoose.connect(URI, {
    useNewUrlParser: true, useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('database is connected');
});