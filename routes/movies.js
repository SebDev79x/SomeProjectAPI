/* IMPORT MODULES NECESSAIRES */
const express = require('express')
const Movie = require('../models/movie')
const bcrypt = require('bcrypt')

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
// Pour ajouter/créer (et non post, car RESTFUL)
router.get('/:id', (req, res) => {
    let movieId = parseInt(req.params.id)
    // CHECK id est présent et cohérent
    if (!movieId) {
        return res.json(400).json({ message: "Paramètre manquant" })
    }
    // Récupération utilisateur
    Movie.findOne({ Where: { id: movieId, raw: true } })
        .then(movie => {
            if (movie === null) {
                return res.status(404).json({ message: 'Ce film n\'existe pas Carpentier !' })
            }
            return res.json({ data: movie })
        })
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// Pour modifier
router.patch('/:id', (req, res) => {
    let movieId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    // On cherche l'utilisateur
    Movie.findOne({ Where: { id: movieId }, raw: true })
        .then(movie => {
            if (movie === null) {
                return res.status(404).json({ message: 'Film inconnu' })
            }
            Movie.update(req.body, { Where: { id: movieId } })
                .then(movie => res.json({ message: 'Utilisateur mis à jour', data: movie }))
                .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
        })
})
// SOFT DELETE Pour mettre à la poubelle un film TRASH
router.delete('/trash/:id', (req, res) => {
    let movieId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    // Suppression
    Movie.destroy({ Where: { id: movieId } })
        .then(() => res.status(204).json({})) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// HARD DELETE Pour supprimer un utilisateur, suppression définitive
router.delete('/:id', (req, res) => {
    let movieId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    // Suppression
    Movie.destroy({ Where: { id: movieId }, force: true })
        .then(() => res.status(204).json({})) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// UNTRASH
router.post('/untrash/:id', (req, res) => {
    let movieId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!movieId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    User.restore({ Where: { id: movieId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})

module.exports = router