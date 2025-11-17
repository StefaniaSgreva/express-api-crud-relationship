const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AuthError = require('../exceptions/AuthError');

/**
 * Middleware per autorizzare modifica/cancellazione solo al proprietario del post.
 * 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authorizePostOwner(req, res, next) {
  try {
    const postSlug = req.params.slug;
    const userId = req.user.id;

    // Recupera il post dal DB con lo slug fornito
    const post = await prisma.post.findUnique({
      where: { slug: postSlug }
    });

    if (!post) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    // Controlla che il post appartenga all'utente attualmente autenticato
    if (post.authorId !== userId) {
      return res.status(403).json({ message: 'Attenzione! Non si possiedono le credenziali necessari per cancellare questo post' });
    }

    // Passa il controllo al middleware successivo / controller
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authorizePostOwner;
