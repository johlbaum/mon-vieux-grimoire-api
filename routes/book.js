const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

router.get('/books', bookCtrl.getAllBooks);
router.post('/books', auth, multer, bookCtrl.createBook);
router.get('/books/bestrating', bookCtrl.getBestRating);
router.get('/books/:id', bookCtrl.getOneBook);
router.delete('/books/:id', auth, bookCtrl.deleteBook);
router.put('/books/:id', auth, multer, bookCtrl.updateBook);

module.exports = router;
