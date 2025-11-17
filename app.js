// CORS
const cors = require('cors');

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Dotenv
const dotenv = require("dotenv");
dotenv.config();

// Rotte
const postRoutes = require('./router/postRoutes');
const categoryRoutes = require('./router/categoryRoutes');
const tagRoutes = require('./router/tagRoutes');
const authRoutes = require('./router/authRoutes');

// Middleware
const routeNotFound = require('./middleware/routeNotFound');
const errorsHandler = require('./middleware/errorsHandler');

// CORS: permette richieste da qualunque origine (da usare in sviluppo, da restringere in produzione)
//  es. produzione: app.use(cors({ origin: 'https://tuodominio.com' })); 
app.use(cors()); 

// Serve per leggere JSON nel corpo delle richieste
app.use(express.json()); // Serve per elaborare payload JSON

// Monta le rotte dei post su /posts
app.use('/posts', postRoutes);
// Monta le rotte delle categorie su /categories
app.use('/categories', categoryRoutes);
// Monta le rotte dei tags su /tags
app.use('/tags', tagRoutes);
// Registriamo le rotte di autenticazione senza alcun prefisso
app.use('', authRoutes); 


// Middleware per rotte non trovate (404)
app.use(routeNotFound);

// Middleware globale di gestione errori
app.use(errorsHandler);

app.listen(port, () => {
    console.log(`App attiva su http://localhost:${port}`);
});

