const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('./config/config');

const routes = require('./routes/route');

const app = express();

// Connexion à la base de données
mongoose.connect(config.db.url)
    .then(() => console.log('Connexion à la base de données réussie'))
    .catch(err => console.log(`Erreur lors de la connexion à la base de données : ${err}`));

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);
app.use(express.urlencoded({ extended: false }));

app.listen(config.port, () => {
  console.log(`Serveur démarré sur le port ${config.port}`);
});
