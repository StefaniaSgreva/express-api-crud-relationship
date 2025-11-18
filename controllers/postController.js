const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const NotFoundError = require("../exceptions/NotFoundError");

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
    if (!post) throw new NotFoundError();

    res.json(post);
  } catch (err) {
    next(err);
  }
}

// Crea un nuovo post
async function store(req, res, next) {
  try {
    const data = req.body;

    // Gestione tags relazione molti-a-molti
    // Se il client invia un array di ids: "tags": [1, 2]
    let tagsInput = undefined;
    if (Array.isArray(data.tags) && data.tags.length > 0) {
      tagsInput = {
        connect: data.tags.map(id => ({ id })),
      };
    }

    // AuthorId dal token JWT 
    const authorId = req.user.id;

    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        categoryId: data.categoryId,
        published: typeof data.published === 'boolean' ? data.published : false, // o true di default se si vuole pubblicare in automatico
        authorId, // User loggato
        // Solo aggiungi il campo tags se è presente
        ...(tagsInput && { tags: tagsInput }),
      },
      include: {
        category: true,
        tags: true
      }
    });

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
        if (!post) throw new NotFoundError();

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

    const post = await prisma.post.findUnique({
      where: { slug },
      include: { tags: true } // carichiamo i tag associati
    });
    if (!post) throw new NotFoundError();

    // Rimuoviamo tutte le relazioni many-to-many con i tag
    await prisma.post.update({
      where: { slug },
      data: { tags: { set: [] } } 
    });

    // Ora eliminiamo il post in modo sicuro
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