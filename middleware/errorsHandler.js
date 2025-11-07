/**
 * Middleware globale per la gestione degli errori.
 */
function errorsHandler(err, req, res, next) {
    // Stampa lo stack trace dell'errore per debug
    console.error(err.stack);
    sendRes(err, res);
}

/**
 * Funzione riutilizzabile per inviare la risposta di errore.
 * 
 * @param {Object} err - Oggetto errore
 * @param {Object} res - Oggetto risposta Express
 */
function sendRes(err, res) {
    // Imposta lo status code, il messaggio e altri dettagli
    return res.status(err.status ?? 500).json({
        message: err.message || "Errore interno del server",
        error: err.constructor?.name || "Error",
        errors: err.errors ?? [],
    });
}

// Esporta sia il middleware che la funzione di invio risposta
module.exports = errorsHandler;
module.exports.sendRes = sendRes;
