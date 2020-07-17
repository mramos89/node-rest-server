const express = require('express')
const bodyParser = require('body-parser')
require('./config/config');
const app = express()
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/usuario', function(req, res) {
    res.json('get usuario')
})

app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400)
            .json({
                ok: false,
                mensaje: 'El nombre es necesario'
            });
    } else {
        res.json(body)
    }

})

app.put('/usuario', function(req, res) {
    res.json('get usuario')
})

app.delete('/usuario/:idUsuario', function(req, res) {
    let id = req.param.idUsuario;
    res.json({
        id
    });

})

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el ', process.env.PORT);
})