/* IMPORT MODULES NECESSAIRES */
/* MODELE = représentation de l'objet de façon unitaire */
const { DataTypes } = require('sequelize')
const DB = require('../db.config')
const bcrypt = require('bcrypt')

/* DEFINITION DU MODELE USER */
const User = DB.define('User', {
    id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true // Validation de données
        }
    },
    password: {
        type: DataTypes.STRING(64), // Hash = 64 caractères
        is: /^[0-9a-f]{64}$/i // Contrainte
    }
}, { paranoid: true }) // softDelete

User.beforeCreate(async(user,options)=>{
    let hash = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUND))
    user.password = hash
})
User.checkPassword = async (password,passwordInDb) =>{
    return  await bcrypt.compare(password, passwordInDb)
}
/* Synchronisation du modèle */
/* User.sync()
 *//* User.sync({force:true})
User.sync({alter:true})

User.sync(err=>{
   console.log(err,"DB SYNCED ERROR");
}) */
module.exports = User
