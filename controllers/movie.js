/* IMPORT MODULES NECESSAIRES */
const Movie = require('../models/movie')
const bcrypt = require('bcrypt')
const { RequestError, MovieError } = require('../errors/customErrors')
/* ROUTAGE de la ressource Movie */
// Récupérer TOUS LES FILMS
exports.getAllMovies = async (req, res, next) => {
  try{
   let movies = await Movie.findAll()
    return res.json({ data: movies })
  }catch(err){
    next(err)
  }
}
// Pour récupérer UN film
exports.getMovie = async (req, res, next) => {
    try {
        let movieId = parseInt(req.params.id)
        // CHECK if id est présent et cohérent    
        if (!movieId) {
            throw new RequestError('Paramètre manquant')
        }
        // Récupération film
        let movie = await Movie.findOne({ where: { id: movieId }, raw: true })
        // Test si film existe
        if (movie === null) {
            throw new MovieError('Ce film n\'existe pas Carpentier !', 0)
        }
        // Envoi film trouvé
        return res.json({ data: movie })
    } catch (err) {
        next(err)
    }
    // Récupération film
    /* Movie.findOne({ where: { id: movieId }, raw: true })
        .then(movie => {
            if (movie === null) {
                return res.status(404).json({ message: 'Ce film n\'existe pas Carpentier !' })
            }
            return res.json({ data: movie })
        })
        .catch(err => res.status(500).json({ message: 'Erreur DB CARPENTIER', error: err })) */
}
// Pour ajouter un film
exports.addMovie = async (req, res, next) => {
    try {
        // Isolation des variables de l'objet
        const { user_id, title, description, director_name, genre } = req.body
        // Validation données reçues, existent-elles ?
        if (!user_id || !title || !description || !director_name || !genre) {
            throw new RequestError('Certains champs sont manquants !')
        }
        // Validation si film existe
        let movie = await Movie.findOne({ where: { title: title }, raw: true })
        if (movie !== null) {
            throw new MovieError('Ce film n\'existe pas', 0)
        }
        // Création du film
        movie = await Movie.create(req.body)
        // Retour de la réponse pour créer film et message confirmation
        return res.json({ message: 'Film créé', data: movie })
    } catch (err) {
        next(err)
    }
}
// Pour modifier
exports.updateMovie = async (req, res, next) => {

    try {
        let movieId = parseInt(req.params.id)
        // Vérif si champ id est présent et cohérent
        if (!movieId) {
            throw new RequestError('Certains paramètres sont manquants !')
        }
        // On cherche le film
        let movie = Movie.findOne({ where: { id: movieId } })
        if (movie === null) {
            throw new MovieError('Ce film n\'existe pas Carpentier !', 0)
        }
        // On cherche le film et on le vérifie
        movie = await Movie.update(req.body, { where: { id: movieId }, raw: true })
        return res.json({ message: 'Utilisateur mis à jour', data: movie })
    } catch (err) {
        next(err)
    }
}
// SOFT DELETE Pour mettre à la poubelle un film TRASH
exports.softDeleteMovie = async (req, res, next) => {
    try {
        let movieId = parseInt(req.params.id)
        // Vérif si champ id est présent et cohérent
        if (!movieId) {
            throw new RequestError('Certains paramètres sont manquants !')
        }
        // Suppression
        await Movie.destroy({ where: { id: movieId } })
        return res.status(204).json({}) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
    } catch (err) {
        next(err)
    }
}
// RESTORE/UNTRASH
exports.restoreMovie = async (req, res, next) => {
    try {
        let movieId = parseInt(req.params.id)
        // Vérif si champ id est présent et cohérent
        if (!movieId) {
            throw new RequestError('Certains paramètres sont manquants !')
        }
        await Movie.restore({ where: { id: movieId }, message: "Film untrashed" })
        return res.status(204).json({})
    } catch (err) {
        next(err)
    }
}
// HARD DELETE Pour supprimer un utilisateur, suppression définitive
exports.hardDeleteMovie = async (req, res, next) => {
    try {
        let movieId = parseInt(req.params.id)
        // Vérif si champ id est présent et cohérent
        if (!movieId) {
            throw new RequestError('Certains paramètres sont manquants !')
        }
        // Suppression
        await Movie.destroy({ where: { id: movieId }, force: true })
        return res.status(204).json({}) //  res.status(200).json({message:'Utilisateur supprimé})) ICI pour coller au restful
    } catch (err) {
        next(err)
    }
}