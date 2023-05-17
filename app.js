const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {routes} = require('./routes');
// const {favoriteRoute} = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

module.exports= app