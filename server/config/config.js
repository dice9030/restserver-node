
// ===================================
//  Puerto
// ===================================


process.env.PORT = process.env.PORT || 3000;

// ===================================
//  ENTORNO
// ===================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ===================================
//  FECHA DE VENCIMIENTO
// ===================================
//60 SEGUNDOS
//60 MINTUS
//24 HORAS
//30 DIAS


process.env.CADUCIDAD_TOKEN =  60 * 60 * 24 * 30;


// ===================================
//  SEED DE AUTENTICACIÓN
// ===================================
process.env.SEED =  process.env.SEED ||'este-es-prueba'; 

// ===================================
//  BASE DE DATOS
// ===================================


let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

