//===========
//Veriricar token
//===========
const jwt = require('jsonwebtoken')
let verificaToken = (req, res, next) => { //next hace que continue con la funcionalidad del programa
    let token = req.get('token'); //Authorization
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decode.usuario; //decoded es el payload 
        next();
    })

};

//===========
//Veriricar admin_Role
//===========


let verificarAdminRole = (req, res, next) => { //next hace que continue con la funcionalidad del programa
    let usuario = req.usuario; //agarramos todo el payload de usuario
    if (usuario.role === 'USER_ROLE') {
        res.json({
            ok: false,
            err: {
                message: 'Usuario sin permisos de admin'
            }
        });
    }

    next();

};

// =====================
// Verifica token para imagen
// =====================
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


}
module.exports = {
    verificaToken,
    verificarAdminRole,
    verificaTokenImg
}