const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const fs = require('fs');
const Productos = require('../models/producto');
const path = require('path');
app.use(fileUpload())

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;
    //valida el archivo
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado'
                }
            });
    }

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
                },
                ext: tipo
            });
    }

    //archivo
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1];
    //extensiones permitida
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpge'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extesiones validas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if(tipo === 'usuarios'){
            imagenUsuario(id,res,nombreArchivo);
        }else{
            imagenProducto(id,res,nombreArchivo);
        }
        /*
        res.json({
            ok: true,
            message: 'img subida correcta mente'
        });
        */
    });
});


function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id, (err,usuarioDB) =>{
        
        if(err){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        //Borrar arhivo
        borraArchivo(usuarioDB.img, 'usuarios');
        /*
        let pathImagen = path.resolve(__dirname,`../../uploads/usuarios/${ usuarioDB.img }`);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
        */

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario:usuarioGuardado,
                img:nombreArchivo
            })
        })
    })
}

function imagenProducto(id,res,nombreArchivo){
    Productos.findById(id, (err,productosDB) =>{
        
        if(err){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productosDB){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        //Borrar arhivo
        borraArchivo(productosDB.img, 'productos');
       

        productosDB.img = nombreArchivo;

        productosDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto:productoGuardado,
                img:nombreArchivo
            })
        })
    })
}

function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${ nombreImagen }`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }

}


app.put('/upload', (req, res) => {


    //valida el archivo
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado'
                }
            });
    }
    //archivo
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1];
    //extensiones permitida
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpge'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extesiones validas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }
    archivo.mv(`uploads/${archivo.name}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            message: 'img subida correcta mente'
        });
    });
});

module.exports = app