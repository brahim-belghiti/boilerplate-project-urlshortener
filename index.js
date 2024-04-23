require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const appRoutes = require('./src/routes/routes');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use('/api', appRoutes);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
