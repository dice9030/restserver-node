const jwt = require('jsonwebtoken');

//===================
//VERIFICAR TOKEN
//===================

let verificaToken = (req,res, next) => {
    let token = req.get('token'); //AUTORIZACION
    jwt.verify(token,process.env.SEED ,(err , decoded)=>{
        if(err){
            return res.json({
                ok:false,
                err:{
                    message:'token invalido'
                }
            })
        }
      
        req.usuario = decoded.data;
        next();

    })
   
};

//=======================
// VERIFICA ADMINROLE
//=======================

let verificaAdmin_Role = (req,res,next) =>{
    
    let body = req.usuario;
     
    if( body.role === 'ADMIN_ROLE'){
        next();
    }else{
       
        return res.status(401).json({
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        })
      

    }
 
}



//=======================
// VERIFICA  TOKEN PARA IMG
//=======================

let verificaTokenImg = (req,res,next) =>{
    let token = req.query.token;
    jwt.verify(token,process.env.SEED ,(err , decoded)=>{
        if(err){
            return res.json({
                ok:false,
                err:{
                    message:'token invalido'
                }
            })
        }
      
        req.usuario = decoded.data;
        next();

    })
   

}



module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}