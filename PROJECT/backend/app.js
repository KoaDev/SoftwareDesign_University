const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const routes = require('./routes/route');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./scripts/swagger_output.json')


const app = express();


mongoose.connect(config.db.url)
    .then(() => console.log('Conection to database established'))
    .catch(err => console.log(`Error : ${err}`));

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(express.urlencoded({ extended: false }));

app.listen(config.port, () => {
  console.log(`Server started on port : ${config.port}`);
});
