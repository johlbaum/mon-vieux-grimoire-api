const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

const processImage = (req, res, next) => {
  const name = req.file.originalname
    .split('.')
    .slice(0, -1)
    .join('.')
    .replace(/\s+/g, '_');

  const newFileName = name + Date.now() + '.' + 'webp';

  sharp(req.file.buffer)
    .webp({ quality: 20 })
    .resize(800)
    .toFile(`images/${newFileName}`, () => {
      req.file.filename = newFileName;
      next();
    });
};

module.exports = { upload, processImage };
