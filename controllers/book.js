const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.createBook = (req, res) => {
  const bookObject = JSON.parse(req.body.book);

  if (bookObject.userId != req.auth.userId) {
    return res.status(403).json({ error: "unauthorized request" });
  }

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
      res.status(201).json({ message: 'book saved' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

exports.getBestRating = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'unauthorized request' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'book deleted' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.updateBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'unauthorized request' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];

        const updataBookData = (imageUrl) => {
          Book.updateOne(
            { _id: req.params.id },
            {
              ...req.body,
              _id: req.params.id,
              imageUrl: imageUrl,
            },
          )
            .then(() => {
              res.status(200).json({ message: 'book updated' });
            })
            .catch((error) => res.status(401).json({ error }));
        };

        if (req.file !== undefined) {
          fs.unlink(`images/${filename}`, () => {
            updataBookData(
              `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
              }`,
            );
          });
        } else {
          updataBookData(book.imageUrl);
        }
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.postRating = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const userEverRated = book.ratings.some(
        (user) => req.auth.userId === user.userId,
      );
      if (!userEverRated) {
        const totalRatings = book.ratings.reduce(
          (sum, rating) => sum + rating.grade,
          0,
        );
        const newAverageRating =
          (totalRatings + req.body.rating) /
          (book.ratings.length + 1).toFixed(1);

        const updatedRating = {
          averageRating: newAverageRating,
          ratings: [
            ...book.ratings,
            {
              userId: req.auth.userId,
              grade: req.body.rating,
            },
          ],
        };
        Book.updateOne({ _id: req.params.id }, updatedRating)
          .then(() => {
            return Book.findOne({ _id: req.params.id });
          })
          .then((updatedBook) => res.status(200).json(updatedBook))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(409).json({ message: 'user has already rated this book' });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
