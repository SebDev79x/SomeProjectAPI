/* IMPORT MODULES NECESSAIRES */
const express = require('express')
const Movie = require('../models/movie')
const bcrypt = require('bcrypt')
const checkTokenMiddleWare = require('../jsonwebtoken/checkJWT')

/* RECUPERATION DU ROUTEUR EXPRESS */
let router = express.Router()

/* ROUTAGE de la ressource User */
// Récupérer ALL MOVIES
router.get('', (req, res) => {
    Movie.findAll()
        .then(movies => res.json({ data: movies }))
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err })) // Erreur interne
})
// Payload, charge utile => Les données se trouvent dans le corps de la requête.
// Pour récupérer UN film
router.get('/:id', (req, res) => {
    let movieId = parseInt(req.params.id)
    console.log("typeof",typeof movieId);
    // CHECK id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: "Paramètre manquant" })
    }
   
    // Récupération utilisateur
    Movie.findOne({ where: { id: movieId }, raw: true })
        .then(movie => {
            if (movie === null) {
                return res.status(404).json({ message: 'Ce film n\'existe pas Carpentier !' })
            }
            return res.json({ data: movie })
        })
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// Pour ajouter un film
router.put('', checkTokenMiddleWare, (req, res) => {
    // Isolation des variables de l'objet
    const { user_id, title, description, director_name, genre } = req.body
    // Validation données reçues, existent-elles ?
    if (!user_id || !title || !description || !director_name || !genre) {
        return res.status(400).json({ message: 'Certains champs sont manquants Carpentier !' })
    }
    Movie.findOne({ where: { title: title }, raw: true })
        .then(movie => {
            if (movie !== null) {
                return res.status(409).json({ message: `Adresse existe déjà Carpentier ${email} !` })
            }
            Movie.create(req.body)
        .then(user => res.json({ message: 'Film créé', data: user }))
        .catch(err => res.status(500).json({ message: 'Film non créé', error: err }))
        })
        .catch(err => res.status(500).json({ message: 'Erreur PB CREATION FILM', error: err }))
    
})
// Pour modifier
router.patch('/:id', checkTokenMiddleWare, (req, res) => {
    let movieId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    // On cherche l'utilisateur
    Movie.findOne({ where: { id: movieId }, raw: true })
        .then(movie => {
            if (movie === null) {
                return res.status(404).json({ message: 'Film inconnu' })
            }
            Movie.update(req.body, { where: { id: movieId } })
                .then(movie => res.json({ message: 'Utilisateur mis à jour', data: movie }))
                .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
        })
})
// SOFT DELETE Pour mettre à la poubelle un film TRASH
router.delete('/trash/:id', checkTokenMiddleWare, (req, res) => {
    let movieId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    // Suppression
    Movie.destroy({ where: { id: movieId } })
        .then(() => res.status(204).json({})) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// HARD DELETE Pour supprimer un utilisateur, suppression définitive
router.delete('/:id', checkTokenMiddleWare, (req, res) => {
    let movieId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    // Suppression
    Movie.destroy({ where: { id: movieId }, force: true })
        .then(() => res.status(204).json({})) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// UNTRASH
router.post('/untrash/:id', checkTokenMiddleWare, (req, res) => {
    let movieId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    User.restore({ where: { id: movieId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})

module.exports = router