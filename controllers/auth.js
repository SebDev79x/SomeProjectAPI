/* IMPORT MODULES NECESSAIRES */
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { RequestError, AuthError } = require('../errors/customErrors')

/* ROUTAGE de la ressource Auth */
// Récupérer TOUS LES FILMS
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        // Validation données reçues, existent-elles ?
        console.log(email, password);
        if (!email || !password) {
            throw new AuthError('Email ou mot de passe incorrect/ ou non valide',0)
        }
        // Vérification existence utilisateur
        let user = await User.findOne({ where: { email: email }, raw: true })
        if (user === null) {
            throw new AuthError('Ce compte n\existe pas',1)
        }
        // Vérification mot de passe
        let test = await User.checkPassword(password,user.password)
/*         let test = await bcrypt.compare(password, user.password)
 */        if (!test) {
            throw new AuthError('Mauvais mot de passe',2)
        }
        // Génération TOKEN
        const token = jwt.sign({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })
        return res.json({ access_token: token })
    } catch (err) {
        next(err)
        /* if (err.name === "SequelizeDatabaseError") {
            return res.status(500).json({ message: 'Erreur DB Authentification', error: err })
        }
        return res.status(500).json({ message: 'Erreur lors de l\'identification', error: err }) */
    }
}
/* router.post('/login', (req, res) => {
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
}) */
