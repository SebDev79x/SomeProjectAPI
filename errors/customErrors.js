class MainError extends Error {
    // 400 Bad Request
    // 401 Unauthorized
    // 404 Not found
    // 409 Conflict
    // 500 Internal Server Error
    // 501 Not implemented

    constructor(errorMessage, errorType = '') {
        super()
        this.name = this.constructor.name
        this.message = errorMessage
        this.errorType = errorType
        console.log("(this.constructor.name", this.constructor.name);
        switch (this.constructor.name) {
            case 'AuthError':
                this.errorType == 0 ? this.statusCode = 404 : this.statusCode = 409
                break
            case 'UserError':
                this.errorType == 0 ? this.statusCode = 404 : this.statusCode = 409

                break
            case 'MovieError':
                this.errorType == 0 ? this.statusCode = 404 : this.statusCode = 409
                break
            case 'RequestError':
                this.statusCode = 400
                break
            default:
                console.log('NOTHING TO HANDLE');
        }
    }
}
class AuthError extends MainError { }
class UserError extends MainError { }
class MovieError extends MainError { }
class RequestError extends MainError { }

module.exports = { MainError, AuthError, UserError, MovieError, RequestError }