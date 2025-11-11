const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const NotFoundException = require("../exceptions/NotFoundException");
const ValidationError = require("../exceptions/ValidationError");

// Recupera tutti i post (con filtri opzionali) e paginazione + (con categoria e tag)
async function index(req, res, next) {
    const { published, search, page = 1, limit = 10 } = req.query;
    // Calcola quanti record saltare
    const skip = (page - 1) * limit;

    // Costruisci il filtro where per Prisma
    let where = {};

    if (published !== undefined) {
        where.published = published === 'true';
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
        ];
    }

    try {
        const posts = await prisma.post.findMany({ 
            where,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: {createdAt: 'desc'},
            include: {           // Include category e tags
              category: true,
              tags: true
            }

    });

    // Conta il totale dei post che rispettano il filtro
    const totalCount = await prisma.post.count({ where });

    res.json({
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        data: posts,
    });
  } catch (err) {
    next(err);
  }
}

// Recupera un post tramite slug (con categoria e tag)
async function show(req, res, next) {
  try {
    const post = await prisma.post.findUnique({ 
        where: { slug: req.params.slug },
        include: {
          category: true,
          tags: true
        }
     });
    if (!post) throw new NotFoundException();

    res.json(post);
  } catch (err) {
    next(err);
  }
}

// Crea un nuovo post
async function store(req, res, next) {
  try {
    const data = req.body;

    const newPost = await prisma.post.create({ data });
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
}

// Aggiorna un post tramite slug
async function update(req, res, next) {
  try {
        const slug = req.params.slug;
        const incomingData = req.body;

        const post = await prisma.post.findUnique({ where: { slug } });
        if (!post) throw new NotFoundException();

        // Aggiorna il post con i nuovi dati
        const updatedPost = await prisma.post.update({
            where: { slug },
            data: incomingData,
        });

        return res.json(updatedPost);
  } catch (err) {
        next(err);
  }
}

// Elimina un post tramite slug
async function destroy(req, res, next) {
  try {
        const slug = req.params.slug;

        const post = await prisma.post.findUnique({ where: { slug } });
        if (!post) throw new NotFoundException();

        await prisma.post.delete({ where: { slug } });
        res.status(204).send();
  } catch (err) {
        next(err);
  }
}

module.exports = {
    index,
    show,
    store, 
    update,
    destroy
}