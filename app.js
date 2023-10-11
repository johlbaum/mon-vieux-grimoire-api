const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const userRoutes = require('./routes/user');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());

app.use('/api/auth', userRoutes);

module.exports = app;
