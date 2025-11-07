const NotFoundException = require("../exceptions/NotFoundException");
const { sendRes } = require("./path/to/errorsHandler"); // importa la funzione sendRes

function routeNotFound(req, res, next) {
    const notFoundError = new NotFoundException();
    // Usa direttamente sendRes per inviare la risposta 404
    return sendRes(notFoundError, res);
}

module.exports = routeNotFound;
