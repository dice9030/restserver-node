const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');

const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
app.get('/usuario', verificaToken, (req, res) => {


    let desde = req.query.desde || 0
    desde = Number(desde)
    let limit = req.query.limit || 5;
    limit = Number(limit)
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                })
            })

        })

    //res.json('get usuario')
})

app.post('/usuario', [verificaToken,verificaAdmin_Role], function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                success: false,
                err
            });
        }

        //usuarioDB.password = null;
        return res.json({
            success: true,
            usuario: usuarioDB
        })
    });
})

app.put('/usuario/:id', verificaToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({ ok: true, usuario: usuarioDB })
    })
})


app.delete('/usuarioeliminar/:id', verificaToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['estado']);
    body.estado = false;

    let cambiarEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioborrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioborrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }

        res.json({ ok: true, usuario: usuarioborrado });
    })
})



app.delete('/usuario/:id', verificaToken, function (req, res) {

    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioborrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioborrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            });
        }

        res.json({ ok: true, usuario: usuarioborrado });
    })

    // res.json('delete usuario')
})


module.exports = app;