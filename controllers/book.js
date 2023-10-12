const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Livre enregistré' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
