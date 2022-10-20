/* IMPORT MODULES NECESSAIRES */
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { RequestError, UserError } = require('../errors/customErrors')

/* ROUTAGE de la ressource User */
// Récupérer TOUS LES UTILISATEURS
exports.getAllUsers = (req, res, next) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => next(err)) // Erreur interne
}
// Récupérer 1 utilisateur
exports.getUser = (req, res) => {
    let userId = parseInt(req.params.id)
    // CHECK id est présent et cohérent
    if (!userId) {
        throw new RequestError('Paramètre manquant')
    }
    // Récupération utilisateur
    User.findOne({ where: { id: userId }, raw: true })
        .then(user => {
            if (user === null) {
                throw new UserError('Cet utilisateur n\'existe pas Carpentier !', 0)
            }
            return res.json({ data: user })
        })
        .catch(err => next(err))
}
// Pour ajouter/créer (et non post, car RESTFUL)
exports.addUser = (req, res) => {
    // Isolation des variables de l'objet
    const { firstname, lastname, username, email, password } = req.body
    console.log("re.body", req.body);
    // Validation données reçues, existent-elles ?
    if (!firstname || !lastname || !username || !email || !password) {
        throw new RequestError('Paramètre manquant')
    }
    // {where:{email 1:email 2} => email 1 vient de Bdd, email 2 vient de la requête
    User.findOne({ where: { email: email }, raw: true })
        .then(user => {
            // Vérification utilisateur, existe déjà ou pas ?
            console.log("user", user);
            if (user !== null) {
                throw new UserError('Cet utilisateur existe déjà Carpentier !')
            }
            // Hash du password, on le sale + hash
            // Carotte =>
            // Cryptage : 4 morceaux, on peut retrouver l'ordre et tout remettre en place
            // Hashage : râpée, clairement plus compliqué de la restituer
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash
                    // Création utilisateur
                    User.create(req.body)
                        .then(user => res.json({ message: 'Utilisateur créé', data: user }))
                        .catch(err => next(err))
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
}
// Pour modifier
exports.updateUser = (req, res) => {
    let userId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!userId) {
        throw new RequestError('Paramètre manquant')
    }
    // On cherche l'utilisateur
    User.findOne({ where: { id: userId }, raw: true })
        .then(user => {
            if (user === null) {
                throw new UserError('Cet utilisateur n\'existe pas Carpentier !',0)
            }
            User.update(req.body, { where: { id: userId } })
                .then(user => res.json({ message: 'Utilisateur mis à jour', data: user }))
                .catch(err => next(err))
        })
}
// SOFT DELETE Pour mettre à la poubelle un utilisateur
exports.softDeleteUser = (req, res) => {
    let userId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!userId) {
        throw new RequestError('Paramètre manquant')
    }
    // Suppression
    User.destroy({ where: { id: userId } })
        .then(() => res.status(204).json({})) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
        .catch(err => next(err))
}
// HARD DELETE Pour supprimer définitivement un utilisateur 
exports.hardDeleteUser = (req, res) => {
    let userId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!userId) {
        throw new RequestError('Paramètre manquant')
    }
    // Suppression
    User.destroy({ where: { id: userId }, force: true })
        .then(() => {
            return res.status(204).json({})
        }) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
        .catch(err => next(err))
}
// UNTRASH
exports.restoreUser = (req, res) => {
    let userId = parseInt(req.params.id)
    // Vérif si champ id est présent et cohérent
    if (!userId) {
        throw new RequestError('Paramètre manquant')
    }
    User.restore({ where: { id: userId } })
        .then(() => res.status(204).json({}))
        .catch(err => next(err))
}