/* IMPORT MODULES NECESSAIRES */
const express = require('express')
const userCtrl = require('../controllers/user')
/* RECUPERATION DU ROUTEUR EXPRESS */
let router = express.Router()
/* ROUTAGE de la ressource User */
/* TOUTES LES ROUTES User */
// Récupérer TOUS LES UTILISATEURS
router.get('/',userCtrl.getAllUsers)
// Récupérer 1 utilisateur
router.get('/:id', userCtrl.getUser)
// Payload, charge utile => Les données se trouvent dans le corps de la requête.
// Pour ajouter/créer (et non post, car RESTFUL)
router.put('',userCtrl.addUser)
// Pour modifier
router.patch('/:id',userCtrl.updateUser)
// SOFT DELETE Pour mettre à la poubelle un utilisateur TRASH
router.delete('/trash/:id', userCtrl.softDeleteUser)
// HARD DELETE Pour supprimer un utilisateur, suppression définitive
router.delete('/:id', userCtrl.hardDeleteUser)
// UNTRASH
router.post('/untrash/:id', userCtrl.restoreUser)

module.exports = router