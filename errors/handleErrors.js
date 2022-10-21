const handleErrors = (err, req, res, next) => {
    //0 Message simple
    //1 Message sans erreur
    //2 All
    debugLevel = 0
    mesage = {}
    console.log('HANDLEERROR MODULE');

    switch (debugLevel) {
        case 0:
            if (err.name == "SequelizeDatabaseError") {
                message = { message: 'DB erreur' }
            }
            message = { message: err.message }

            break
        case 1:
            message = { message: err.message }

            break
        case 2:
            message = { message: err.message, error: err }

            break
        default:
            console.log('Bad debug level');
    }

    return res.status(err.statusCode || 500).json( {message})
}
module.exports = handleErrors