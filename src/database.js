const mongoose = require('mongoose');


const URI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost/databasefiled';


mongoose.connect(URI, {
    useNewUrlParser: true, useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('database is connected');
});