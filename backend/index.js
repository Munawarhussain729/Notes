const express = require('express')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const { authenticationToken } = require('./utils');
const routes = require('./routes/index')

require('dotenv').config();

app.use(express.json())

app.use(cors({ origin: '*' }))

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas', error);
});

app.get('/', (req, res) => {
  res.json({ data: "Hello" })
})

app.use('/', routes)

app.listen(8080)
module.exports = app