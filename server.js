/* IMPORT DES MODULES NECESSAIRES */
const express = require('express')
const cors = require('cors')
/* IMPORT CONNEXION Bdd */
let DB = require('./db.config')
/* INIT DE L'API */
const app = express()
/* Middleware */
app.use(cors())
/* API en json */
app.use(express.json())
/* Multiples endpoints */
app.use(express.urlencoded({ extended: true }))
/* IMPORT DES MODULES DE ROUTAGE */
// On se branche
const user_router = require('./routes/users')
const movie_router = require('./routes/movies')

/* Mise en place du ROUTAGE */
app.get('/', (req, res) => res.send('Youpi ! oui !'))
app.use('/users',user_router)
app.use('/movies',movie_router)

app.get('*', (res, req) => res.status(501).send('c\'est quoi c\' bordel Carpentier !??'))

/* DEMARRAGE SERVEUR avec test db */
DB.authenticate()
.then(()=>console.log("Connexion DB OKKKKK"))
.then(()=>app.listen(process.env.SERVER_PORT, () => console.log(`Application NODE démarrée sur http://localhost:${process.env.SERVER_PORT}`)))
.catch((err)=>console.log("OUPS ERREUR CONNEXION BDD",err))