/*Similiar al entity*/

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}
let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'el correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos

    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject
}
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser Unico' })
module.exports = mongoose.model('Usuario', usuarioSchema);