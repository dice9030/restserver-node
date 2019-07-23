
// ===================================
//  Puerto
// ===================================


process.env.PORT = process.env.PORT || 3000;

// ===================================
//  ENTORNO
// ===================================

process.env.NODE_ENV = 'PROD'; //process.env.NODE_ENV || 'dev';


// ===================================
//  BASE DE DATOS
// ===================================


let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://dice9030:JqG3973vA7hH58C@cluster0-6p8qf.gcp.mongodb.net/cafe';
}
process.env.URLDB = urlDB;

