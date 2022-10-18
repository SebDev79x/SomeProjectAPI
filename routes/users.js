/* IMPORT MODULES NECESSAIRES */
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')

/* RECUPERATION DU ROUTEUR EXPRESS */
let router = express.Router()

/* ROUTAGE de la ressource User */
// Récupérer ALL USERS
router.get('', (req, res) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err })) // Erreur interne
})
// Récupérer 1 utilisateur
router.get('/:id', (req, res) => {
    let userId = parseInt(req.params.id)
    // CHECK id est présent et cohérent
    if (!userId) {
        return res.json(400).json({ message: "Paramètre manquant" })
    }
    // Récupération utilisateur
    User.findOne({ Where: { id: userId, raw: true } })
        .then(user => {
            if (user === null) {
                return res.status(404).json({ message: 'Cet utilisateur n\'existe pas Carpentier !' })
            }
            return res.json({ data: user })
        })
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// Payload, charge utile => Les données se trouvent dans le corps de la requête.
// Pour ajouter/créer (et non post, car RESTFUL)
router.put('', (req, res) => {
    // Isolation des variables de l'objet
    const { firstname, lastname, username, email, password } = req.body
    // Validation données reçues, existent-elles ?
    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(404).json({ message: 'Certains champs sont manquants Carpentier !' })
    }
    // {Where:{email 1:email 2} => email 1 vient de Bdd, email 2 vient de la requête
    User.findOne({ Where: { email: email }, raw: true })
        .then(user => {
            // Vérification utilisateur, existe déjà ou pas ?
            if (user !== null) {
                return res.status(409).json({ message: `Adresse (${email}) existe déjà Carpentier !` })
            }
            // Hash du password, on le sale + hash
            // Carotte =>
            // Cryptage : 4 morceaux, on peut retrouver l'ordre et tout remettre en place
            // Hashage : râpée, clairement plus compliqué de la restituer
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash
                })
                .catch(err => res.status(500).json({ message: 'Le H est mauvais Carpentier !', error: err }))
            // Création utilisateur
            User.create(req.body)
                .then(user => res.json({ message: 'Utilisateur créé', data: user }))
                .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
        })
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// Pour modifier
router.patch('/:id', (req, res) => {
    let userId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    // On cherche l'utilisateur
    User.findOne({ Where: { id: userId }, raw: true })
        .then(user => {
            if (user === null) {
                return res.status(404).json({ message: 'Utilisateur inconnu' })
            }
            User.update(req.body, { Where: { id: userId } })
                .then(user => res.json({ message: 'Utilisateur mis à jour', data: user }))
                .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
        })
})
// SOFT DELETE Pour mettre à la poubelle un utilisateur TRASH
router.delete('/trash/:id', (req, res) => {
    let userId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    // Suppression
    User.destroy({ Where: { id: userId } })
        .then(() => res.status(204).json({})) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// HARD DELETE Pour supprimer un utilisateur, suppression définitive
router.delete('/:id', (req, res) => {
    let userId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    // Suppression
    User.destroy({ Where: { id: userId }, force: true })
        .then(() => res.status(204).json({})) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})
// UNTRASH
router.post('/untrash/:id', (req, res) => {
    let userId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Paramètre manquant' })
    }
    User.restore({ Where: { id: userId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err }))
})

module.exports = router