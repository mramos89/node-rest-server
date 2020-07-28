const express = require('express')
const app = express()
    /*Sirve para poder configurar las rutas / controllers*/
app.use(require('./usuario'))
app.use(require('./login'))
app.use(require('./categoria'))
app.use(require('./producto'))


module.exports = app;