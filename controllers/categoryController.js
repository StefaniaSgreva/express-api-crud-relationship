const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const NotFoundException = require('../exceptions/NotFoundException');

// Recupera tutte le categorie
async function index(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

// Recupera una categoria tramite ID
async function show(req, res, next) {
  const id = parseInt(req.params.id);
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException();
    res.json(category);
  } catch (err) {
    next(err);
  }
}

// Crea una nuova categoria
async function store(req, res, next) {
  const data = req.body;
  try {
    const newCategory = await prisma.category.create({ data });
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
}

// Aggiorna una categoria tramite ID
async function update(req, res, next) {
  const id = parseInt(req.params.id);
  const data = req.body;
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException();

    const updatedCategory = await prisma.category.update({
      where: { id },
      data,
    });
    res.json(updatedCategory);
  } catch (err) {
    next(err);
  }
}

// Elimina una categoria tramite ID
async function destroy(req, res, next) {
  const id = parseInt(req.params.id);
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException();

    await prisma.category.delete({ where: { id } });
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
};
