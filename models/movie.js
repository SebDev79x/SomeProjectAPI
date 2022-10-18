/* IMPORT MODULES NECESSAIRES */
/* MODELE = représentation de la ressource de façon unitaire */
const {DataTypes}= require('sequelize')
const DB = require('../db.config')

/* DEFINITION DU MODELE USER */
const Movie = DB.define('Movie',{
    id:{
        type:DataTypes.INTEGER(10),
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER(10),
        allowNull:false
    },
  
    title:{
        type:DataTypes.STRING(100),
        defaultValue:'',
        allowNull:false
    },
    year:{
        type:DataTypes.STRING(4),
        allowNull:false,
    },
    description:{
        type:DataTypes.TEXT,
        defaultValue:'',
    },
    director_name:{
        type:DataTypes.STRING(30),
        allowNull:false,
    },
    genre:{
        type:DataTypes.STRING(30),
        allowNull:false,
    },
   
},{paranoid:true}) // softDelete

/* Synchronisation du modèle */
Movie.sync()
/* Movie.sync({force:true})
Movie.sync({alter:true})

Movie.sync(err=>{
    console.log(err,"DB SYNCED ERROR");
 }) */
module.exports = Movie
