const express = require('express')
const mongoose = require('mongoose');
const app = express()
const path = require('path') // esto sirve para mapear url 
require('./config/config');

/*Configuracion global de rutas */
app.use(require('./rutas/index.js'))

/*Conexión con mongo*/
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (error) {
        throw new error
    }

    console.log("Base de datos Online");
});
mongoose.set('useCreateIndex', true);

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el ', process.env.PORT);
})

//*Habilitar paginas web */

app.use(express.static(path.resolve(__dirname, '../public'))); //invextigar sobre express.static en clases anteriores.