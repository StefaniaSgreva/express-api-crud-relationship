const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
// validazione
const { body, validationResult } = require('express-validator');
const validationMiddleware = require('./path/to/validationMiddleware');


// GET /posts
// // Recupera tutti i post con eventuali filtri
router.get('/posts', postController.index);

// GET /posts/:slug
// Recupera un singolo post tramite slug
router.get('/posts/:slug', postController.show);

// POST /posts
// Crea un nuovo post
// router.post('/posts', postController.store);
router.post(
    '/posts', 
    body("title")
        .notEmpty().withMessage('Il titolo è obbligatorio')
        .isLength({ max: 100 }).withMessage('Il titolo deve contenere massimo 100 caratteri'),
    body('slug')
        .notEmpty().withMessage('Lo slug è obbligatorio')
        .isSlug().withMessage('Lo Slug deve essere uno slug valido'),    
    body('content')
        .notEmpty().withMessage('Il contenuto è obbligatorio'),
    body('categoryId')
        .optional()
        .isInt().withMessage('Category ID deve essere un numero intero'),
    body('tags')
            .optional()
            .isArray().withMessage('Tags deve essere un array'),
    validationMiddleware,
    postController.store
);

// PUT /posts/:slug
// Aggiorna un post tramite slug
// router.put('/posts/:slug', postController.update);
router.put(
    '/posts/:slug',
    body("title")
        .optional()
        .notEmpty().withMessage('Il titolo è obbligatorio se fornito')
        .isLength({ max: 100 }).withMessage('Il titolo deve contenere massimo 100 caratteri'),
    body('slug')
        .optional()
        .notEmpty().withMessage('Lo slug è obbligatorio se fornito')
        .isSlug().withMessage('Lo Slug deve essere uno slug valido'),
    body('content')
        .optional()
        .notEmpty().withMessage('Il contenuto è obbligatorio se fornito'),
    body('categoryId')
        .optional()
        .isInt().withMessage('Category ID deve essere un numero intero'),
    body('tags')
        .optional()
        .isArray().withMessage('Tags deve essere un array'),
    validationMiddleware,
    postController.update
);


// DELETE /posts/:slug
// Elimina un post tramite slug
router.delete('/posts/:slug', postController.destroy);

module.exports = router;