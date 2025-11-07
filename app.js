const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const postRoutes = require('./routes/postRoutes');
const routeNotFound = require('./middleware/routeNotFound');
const errorsHandler = require('./middleware/errorsHandler');

// application/json
app.use(express.json());

// Monta le rotte dei post
app.use('/', postRoutes);

// Middleware per rotte non trovate (404)
app.use(routeNotFound);

// Middleware globale di gestione errori
app.use(errorsHandler);

app.listen(port, () => {
    console.log(`App attiva su http://localhost:${port}`);
});

