const express = require('express')

const { verificaToken } = require('../middleware/autenticacion');

const app = express();
const Producto = require('../models/producto');
const _ = require('underscore')

//========================
//======Buscar productos====
//========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion ')
        .exec((err, productos) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                productos,
            });

        })
});
//========================
//======Get productos====
//========================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos 
    //populate usuario , categoria
    //paginado
    let desde = req.query.desde || 0; //parametros opcionales ?
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre descripcion precioUni categoria usuario')
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion ')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            Producto.count({ disponible: true }, (err, total) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: total
                });
            });

        })

});


//========================
//======Get productos por id====
//========================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            if (!productoDB) {
                return res.status(400)
                    .json({
                        ok: false,
                        message: 'producto no encontrado'
                    })
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        }).populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion ')

});


//========================
//======Crear productos====
//========================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });





});


//========================
//======Actualizar productos====
//========================
app.put('/productos/:id', (req, res) => {
    let body = req.body;
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!productoDB) {
            return res.status(400)
                .json({
                    ok: false,
                    message: "No existe el producto en la BD"
                })
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.precioUni;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    })
            }

            res.status(201).json({
                ok: true,
                producto: productoGuardado
            });

        });

    });


});


//========================
//======Borrar productos====
//========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, body, (err, productoDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (productoDB === null) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Producto  no encontrado'
                    }
                });
        }
        res.json({
            ok: true,
            producto: "Producto deshabilitado correctamente"
        });


    });


});


module.exports = app;