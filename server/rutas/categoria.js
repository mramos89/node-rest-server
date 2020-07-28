const express = require('express');

const { verificaToken, verificarAdminRole } = require('../middleware/autenticacion');
const app = express();
const Categoria = require('../models/categoria');


//========================
//======Get categorias====
//========================

app.get('/categoria', verificaToken, (req, res) => {


    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                categoria: categorias
            });

        })

});


//===============================
//======Get categorias por id====
//===============================

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categorias) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!categorias) {
            return res.status(400)
                .json({
                    ok: false,
                    message: 'Categoria no encontrada'
                })
        }

        res.json({
            ok: true,
            categoria: categorias
        });

    })

});


//=============================
//======Actualizar Categoria===
//=============================

app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let desCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }


        if (!categoriaDB) {
            return res.status(400)
                .json({
                    ok: false,
                    message: 'Categoria no encontrada'
                })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })



});


//=============================
//======New categorias=========
//=============================

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!categoriaDB) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

//=============================
//======Eliminar Categoria===
//=============================

app.delete('/categoria/:id', [verificaToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (categoriaDB === null) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
        }
        res.json({
            ok: true,
            message: 'Categoria borrada'
        });


    });
});
module.exports = app;