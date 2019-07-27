const express = require('express');
const fs = require('fs');
const path = require('path');
const {verificaTokenImg} = require('../middlewares/autenticacion')
let app = express();


app.get('/imagen/:tipo/:img',verificaTokenImg ,(req,res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImg = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
    console.log(pathImg);

    if (fs.existsSync(pathImg)){
        res.sendFile(pathImg)
        
    }else{
        let noImagePath = path.resolve(__dirname,'../assets/not-found.png')
        //retorna el valor que le envias
        res.sendFile(noImagePath);
    }

})


module.exports = app;