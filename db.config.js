/* FICHIER CONNEXION Bdd */
/* IMPORT DES MODULES NECESSAIRES */
const { Sequelize } = require('sequelize')

/* CONNEXION Bdd */
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
}
)
/* Synchronisation des modèles */
/*  sequelize.sync(err=>{
    console.log(err,"DB SYNCED ERROR");
 }) */

module.exports = sequelize


