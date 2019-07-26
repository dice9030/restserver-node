const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express()
let Producto = require('../models/producto');

//==============================================
// Obtener productos
//==============================================
app.get('/productos',(req,res)=>{
    // trae todos los productos
    // polulate: usuario categoria
    // paginado
    
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limit = req.query.limit || 5;
    limit = Number(limit)
    
    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(limit)
        .populate('usuario', 'nombre email')    
        .populate('categoria', 'descripcion')    
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



})

//==============================================
// Obtener producto por ID
//==============================================
app.get('/productos/:id',(req,res)=>{  
     let id = req.params.id;   
     Producto.findOne({ _id: id}, (err, productoDB) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 err
             })
         }
         if (!productoDB) {
             return res.status(400).json({
                 ok: false,
                 err: {
                     message: 'Producto no encontrado'
                 }
             })
         }
         return res.json({
                     ok: true,
                     categoria:productoDB
                 })
     })

})


app.get('/productos/buscar/:termino',verificaToken,(req,res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');
    Producto.find({ nombre: regex})
            .populate('categoria','descripcion')
            .exec((err,productos) =>{

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
               
                res.json({
                    ok:true,
                    productos
                })
            })
})


//==============================================
// Crear un nuevo producto 
//==============================================
app.post('/productos',verificaToken,(req,res)=>{
    // Grabar el usuario
    // grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({    
        nombre: body.nombre,
        precioUni: body.preciouni ,
        descripcion: body.descripcion ,
        categoria: body.categoria,
        usuario: req.usuario._id                
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error sql'
                }
            })
        }

        //usuarioDB.password = null;
        return res.json({
            success: true,
            usuario: productoDB
        })
    });



})



//==============================================
// Actualizar un producto 
//==============================================
app.put('/productos/:id',verificaToken,(req,res)=>{
    // Grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    let detProductos = {
        nombre : body.nombre,
        precioUni : body.preciouni,
        descripcion : body.descripcion,        
        categoria : body.categoria
    }
    Producto.findByIdAndUpdate(id, detProductos, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error sql'
                }
            })
        }
        res.json({ ok: true, productos: productoDB })
    })
})


//==============================================
// Borrar un producto 
//==============================================
app.delete('/productos/:id',(req,res)=>{
    // borrar el usuario 
    // borrar un producto del listado

    //finById()
    //save
    let id = req.params.id;


    let cambiardisponible = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiardisponible, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrado'
                }
            });
        }

        res.json({ ok: true, producto: productoBorrado });
    })
})


module.exports = app