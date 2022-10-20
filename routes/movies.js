/* IMPORT MODULES NECESSAIRES */
const express = require('express')
const Movie = require('../models/movie')
const movieCtrl = require('../controllers/movie')
const bcrypt = require('bcrypt')
const checkTokenMiddleWare = require('../jsonwebtoken/checkJWT')

/* RECUPERATION DU ROUTEUR EXPRESS */
let router = express.Router()

/* ROUTAGE de la ressource Movie */
// Récupérer TOUS LES FILMS
router.get('',movieCtrl.getAllMovies)
// Payload, charge utile => Les données se trouvent dans le corps de la requête.
// Pour récupérer UN SEUL FILM
router.get('/:id', movieCtrl.getMovie)
// Pour ajouter un film
router.put('', checkTokenMiddleWare, movieCtrl.addMovie)
// Pour modifier
router.patch('/:id', checkTokenMiddleWare,movieCtrl.updateMovie)
// SOFT DELETE Pour mettre à la poubelle un film
router.delete('/trash/:id', checkTokenMiddleWare,movieCtrl.softDeleteMovie)
// HARD DELETE Pour supprimer un utilisateur, suppression définitive
router.delete('/:id', checkTokenMiddleWare,movieCtrl.hardDeleteMovie)
// RESTORE/UNTRASH
router.post('/untrash/:id', checkTokenMiddleWare,movieCtrl.restoreMovie)

module.exports = router