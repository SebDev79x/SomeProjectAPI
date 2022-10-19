/* IMPORT MODULES NECESSAIRES */
const jwt = require('jsonwebtoken')
/* Extraction du token */
const extractBearer = authorization => {
    if (typeof authorization !== 'string') false
    // Isolation du token
    const matches = authorization.match(/(bearer)\s+(\S+)/i)
    /*     console.log("authorization",authorization);
    console.log("PREMIER MATCHES",matches);
    console.log("DEUXIEME MATCHES",matches[2]); */
    return matches && matches[2]
}
/* CHECK présence du token */
const checkTokenMiddleWare = (req, res, next) => {
    const token = req.headers.authorization && extractBearer(req.headers.authorization)
    if (!token) {
        return res.status(401).json({ message: 'Tentative de fraude !? PAS DE TOKEN' })
    }
    // Check la validité
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Token tout pourri' })
        }
        next()
    })
}
module.exports = checkTokenMiddleWare