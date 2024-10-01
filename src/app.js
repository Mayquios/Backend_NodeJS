const express = require('express');
const mongoose = require('mongoose');
const { config } = require('dotenv');
const bodyParser = require('body-parser');


config();

const bookRoutes = require('./routes/book.routes')


// vamos a parcear 
const app = express();
app.use(bodyParser.json());

//conectamos a la base de datos
mongoose.connect(process.env.MONGO_URL, {dbName:process.env.MONGO_DB_NAME})
const db = mongoose.connection;

//usamos las rutas para nuestras consultas
app.use('/books', bookRoutes);

app.use('/', (req, res) => {
    res.send('Servidor mongodb');
})

const port = process.env.PORT;
app.listen(port, () =>{
    console.log(`Servidor corriendo en el puerto ${port}`);
});