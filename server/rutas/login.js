const Usuario = require('../models/usuario')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
    /*For google    */
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
/*Configuraciones de google*/
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let google_user = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    Usuario.findOne({ email: google_user.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400)
                    .json({
                        ok: false,
                        message: 'Debe de usar su autenticacion normal'
                    });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else { // usuario no existe en nuestra DB
            console.log(google_user);
            let usuario = new Usuario();
            usuario.nombre = google_user.nombre;
            usuario.email = google_user.email;
            usuario.img = google_user.img;
            usuario.google = true;
            usuario.password = ':)';

            console.log(usuario);
            usuario.save((err, usuarioDb) => {
                if (err) {
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            });

        }

    });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}





/**Para poder utilizar todas las configuraciones que le haremos en app en otras paginas */
module.exports = app;