//==================
//Puerto
//==================
process.env.PORT = process.env.PORT || 3000;

//==================
//Entorno
//==================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==================
//Base de datos
//==================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
        //urlDB = 'mongodb+srv://mramos89:71o29seXDQDTvPWx@cluster0.d7evh.mongodb.net/cafe'

} else {
    urlDB = process.env.MONGO_URL
}
//'mongodb+srv://mramos89:FDc0KhssSDBUnLG6@cluster1.phxxn.mongodb.net/sample-cafe'
process.env.URLDB = urlDB;