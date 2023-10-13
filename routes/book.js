const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

router.get('/books', bookCtrl.getAllBooks);
router.post(
  '/books',
  auth,
  multer.upload,
  multer.processImage,
  bookCtrl.createBook,
);
router.get('/books/bestrating', bookCtrl.getBestRating);
router.post('/books/:id/rating', auth, bookCtrl.postRating);
router.get('/books/:id', bookCtrl.getOneBook);
router.put(
  '/books/:id',
  auth,
  multer.upload,
  multer.processImage,
  bookCtrl.updateBook,
);
router.delete('/books/:id', auth, bookCtrl.deleteBook);

module.exports = router;
