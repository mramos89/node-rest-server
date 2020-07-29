const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload()); // todos los archivos que se carguen caen dentro del req.files

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'No se ha cargado ningun archivo'
        });
    }

    //Validar tipo
    let tiposPermitidos = ['productos', 'usuarios'];

    if (tiposPermitidos.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            message: 'el tipo de archivo no es permitido, las permitidos son ' + tiposPermitidos.join()
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1]
        //Restringir extension
    let extensionesPermitidas = ['PNG', 'jpg', 'gif', 'jpeg']
    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            message: 'la extension no es permitida, las permitidas son ' + extensionesPermitidas.join()
        });
    }
    //Cambiar nombre archivo
    let nombreArchivoOr = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivoOr}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        //Guardar imagen
        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivoOr);
        } else {
            imagenProducto(id, res, nombreArchivoOr);
        }



    });
});

function imagenUsuario(id, res, nombreArchivoOr) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivoOr, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {

            borrarArchivo(nombreArchivoOr, 'usuarios');
            return res.status(400).json({
                ok: false,
                message: 'No existe usuario con ese id'
            });
        }
        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivoOr;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivoOr
            });
        })

    });
}


function imagenProducto(id, res, nombreArchivoOr) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivoOr, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            borrarArchivo(nombreArchivoOr, 'productos');
            return res.status(400).json({
                ok: false,
                message: 'No existe Producto con ese id'
            });
        }
        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivoOr;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivoOr
            });
        })

    });
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;