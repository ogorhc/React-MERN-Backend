const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
const { jwtValidator } = require('./middlewares/jwt-validator');
require('dotenv').config();

const app = express();

dbConnection();

app.use(cors());

app.use(express.static('public'));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', [jwtValidator], require('./routes/events'));

app.listen(process.env.PORT ?? 4000, () => {
  console.log(`Server corriendo en puerto ${process.env.PORT}`);
});
