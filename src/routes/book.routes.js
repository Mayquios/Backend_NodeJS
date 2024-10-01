const express = require("express");
const router = express.Router();
const Book = require("../models/book.model");

/**
 * MIDDLEWARE
 */
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(404).json(
        {
            message: 'el ID del libro no es valido'
        }
    )
  }
  try {
    book = await Book.findById(id);
    if(!book){
        return res.status(404).json(
            {
                message: 'el libro no existe'
            }
        )
    }
  } catch (error) {
    return res.status(500).json(
        {
            message: error.message
        }
    )
  }
  res.book = book;
  next();
};

/**
 * (MOSTRAR) => METODO PARA MOSTRAR TODOS LOS LIBROS
 */
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    console.log("GET ALL", books);
    if (books.length === 0) {
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error al mostrar los libros de la base de datos", error);
  }
});

/**
 * (C) => METODO PARA CREAR Y ALMACENAR UN LIBRO EN LA DB
 */
router.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
})

/**
 * (R) => METODO PARA OBTENER DATOS DE X LIBRO
 */

/**
 * (U) => METODO PARA ACTUALIZAR DATOS DE X LIBRO
 */
router.post("/", async (req, res) => {
  const { title, author, genere, publication_date } = req?.body;
  if (!title || !author || !genere || !publication_date) {
    return res.status(400).json({
      message: "Faltan datos para crear un libro",
    });
  }
  const book = new Book({
    title,
    author,
    genere,
    publication_date,
  });
  try {
    const newBook = await book.save();
    console.log(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

/**
 * (actualizar) => METODO PARA actualizar
 */
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genere = req.body.genere || book.genere
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBook = await book.save()
        res.json(updateBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})


/**
 * (patch) => METODO PARA actualizar  datos de X LIBRO

 */
router.patch('/:id', getBook, async (req, res) => {
    if(!req.body.title && !req.body.author && !req.body.genere && !req.body.publication_date){
        res.status(400).json({
            message: "Faltan datos para actualizar un libro"
        })
    }
    try {
        const book = res.book;
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genere = req.body.genere || book.genere
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBook = await book.save()
        res.json(updateBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})


/**
 * (D) => METODO PARA ELIMINAR DATOS DE X LIBRO
 */
router.delete('/:id', getBook, async (req, res) => {

    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({
            message: `"Libro  ${book.title} eliminado con exito"`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router