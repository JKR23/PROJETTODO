const prisma = require("../prismaClient"); // Import du client Prisma

// Fonction pour ajouter un livre
const addBook = async (title, author, isbn, description) => {
 const book = await prisma.book.create({
  data: {
   title,
   author,
   isbn,
   description,
  },
 });
 return book;
};

// Fonction pour rechercher un livre par son titre
const findBookByTitle = async (title) => {
 const book = await prisma.book.findMany({
  where: { title: { contains: title, mode: "insensitive" } },
 });
 return book;
};

// Fonction pour modifier un livre par ID
const updateBook = async (id, title, author, isbn, description, stock) => {
 const updatedBook = await prisma.book.update({
  where: { id: parseInt(id) }, // Recherche par ID
  data: {
   title,
   author,
   isbn,
   description,
   stock, // Met à jour le livre avec les nouvelles données
  },
 });
 return updatedBook;
};

// Fonction pour supprimer un livre par ID
const deleteBook = async (id) => {
 await prisma.book.delete({
  where: { id: parseInt(id) }, // Recherche par ID pour supprimer le livre
 });
 return { message: "Livre supprimé avec succès" };
};

module.exports = {
 addBook,
 findBookByTitle,
 updateBook,
 deleteBook,
};
