class NotFoundException extends Error {
    constructor(message = "Risorsa non trovata") {
        super(message);
        this.name = "NotFoundException";
        this.status = 404;
    }
}

module.exports = NotFoundException;