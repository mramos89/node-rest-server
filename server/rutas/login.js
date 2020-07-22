const Usuario = require('../models/usuario')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()

app.post('/login', (req, res) => {
    let body = req.body; //correo y password

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!usuarioDB) {
            return res.status(500)
                .json({
                    ok: false,
                    err: {
                        message: 'El Usuario o contraseña no es valido'
                    }
                });
        }
        /*Validando si las contraseñas son iguales */
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(500)
                .json({
                    ok: false,
                    err: {
                        message: 'El Usuario o contraseña no es valido'
                    }
                });
        }
        //Creando el sign del token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })

    });
});






/**Para poder utilizar todas las configuraciones que le haremos en app en otras paginas */
module.exports = app;