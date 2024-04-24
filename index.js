require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const appRoutes = require('./src/routes/routes');
const mongoose = require("mongoose");
const DATA_BASE_URI = process.env.MONGO_URI;
const bodyParser = require('body-parser');
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// connect database
mongoose.connect(DATA_BASE_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Database connection successful');
})
  .catch((err) => {
    console.error('Database connection error');
  });

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
