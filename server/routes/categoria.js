const express = require('express')

let { verificaToken } = require('../middlewares/autenticacion');
//const _ = require('underscore');
let app = express();

let Categoria = require('../models/categoria');


//==================================
//Mostrar todas las categorias
//==================================
app.get('/categoria',verificaToken, (req, res) => {

 
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')    
        .exec((err,categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok:true,
                categorias
            })
      
        })

     
});

//==================================
//Mostrar una categoria por ID
//==================================
app.get('/categoria/:id', (req, res) => {
    //Categoria.findById(.....)

    let id = req.params.id;
    console.log(id)
    //buscar un registro
    
    Categoria.findOne({ _id: id}, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecta'
                }
            })
        }
        return res.json({
                    ok: true,
                    categoria:usuarioDB
                })
      

    })

});

//==================================
//Crear nueva categoria
//==================================
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let id = req.usuario._id;
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error sql'
                }
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

//==================================
//Actualizar categoria
//==================================
app.put('/categoria/:id', (req, res) => {
    
    let id = req.params.id;
    let body = req.body; //_.pick(req.body, ['descripcion']);

    let descCategoria = {
        descripcion : body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error sql'
                }
            })
        }
        res.json({ ok: true, categoria: categoriaDB })
    })
})


//==================================
//Eliminar categoria
//==================================
app.delete('/categoria/:id',verificaToken ,(req, res) => {
    //solo el administraro puede eliminar la categoria
    //Categoria.findByIdAndRemove

    //console.log(req.usuario.role);
    let role = req.usuario.role
    let id = req.params.id;
    
    if(req.usuario.role === 'ADMIN_ROLE'){
        Categoria.findByIdAndRemove(id, (err, categoriadelet) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!categoriadelet) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'categoria no encontrado'
                    }
                });
            }
    
            res.json({ ok: true, categoria: categoriadelet });
        })
    }else{
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Debe ser de role administrativo'
            }
        });
    }
});

module.exports = app;


