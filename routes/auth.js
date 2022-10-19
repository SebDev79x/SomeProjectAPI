/* IMPORT MODULES NECESSAIRES */
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/* RECUPERATION DU ROUTEUR EXPRESS */
let router = express.Router()
/* ROUTAGE de la ressource Auth */
// POST car envoi de formulaire
router.post('/login', (req, res) => {
    const { email, password } = req.body
    // Validation données reçues, existent-elles ?
    if (!email || !password) {
        return res.status(400).json({ message: 'Données ne correspondant pas' })
    }
    User.findOne({ where: { email: email }, raw: true })
        .then(user => {
            // Validation USER existe
            if (user === null) {
                return res.status(401).json({ message: 'Ce compte n\'existe pas' })
            }
            // Validation password
            bcrypt.compare(password,user.password)
            .then(test =>{
                // Vérif  password
                if(!test){
                    return res.status(401).json({ message: 'Mot de passe non reconnu' })
                }
                // Génération du token
                const token = jwt.sign({
                    id:user.id,
                    firstname:user.firstname,
                    lastname:user.lastname,
                    username:user.username,
                    email:user.email

                },process.env.JWT_SECRET,{expiresIn:process.env.JWT_DURING})
//jwt;sign({payload},secret,duration)
return res.json({access_token:token})
            })
            .catch(err => res.status(500).json({message : 'Erreur lors de l\'identification',error:err}))
        })

        .catch(err => res.status(500).json({message : 'Erreur DB Authentification',error:err}))
})

module.exports = router