const express = require('express')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const { authenticationToken } = require('./utils');
const User = require('./models/user_model');
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

app.post('/create-account', async (req, res) => {
  const { fullName, email, password } = req.body
  if (!fullName) {
    return res.status(400).json({ error: true, message: "Full name is required" })
  }
  if (!email) {
    return res.status(400).json({ error: true, message: 'Email is required' })
  }
  if (!password) {
    return res.status(400).json({ error: true, message: 'Password is required' })
  }
  const isUser = await User.findOne({ email: email })
  if (isUser) {
    return res.json({
      error: true,
      message: 'User already exist'
    })
  }
  const user = new User({
    fullName,
    email,
    password
  })
  await user.save()
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600m"
  })
  return res.json({
    error: false,
    user,
    accessToken,
    message: 'Registration Successful'
  })
})

app.post('/login', async(req, res) => {
  const {email, password} = req.body
  if (!email) {
    return res.status(400).json({ error: true, message: 'Email is required' })
  }
  if (!password) {
    return res.status(400).json({ error: true, message: 'Password is required' })
  }
  const userInfo = await User.findOne({ email: email })
  if (!userInfo) {
    return res.json({
      error: true,
      message: 'User not found'
    })
  }

  if(userInfo.email === email  && userInfo.password === password){
    const user = {user:userInfo}
    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'3600m'})
    return res.json({
      error: false,
      email,
      accessToken,
      message: 'Login Successful'
    })
  }else{
    return res.json({
      error: true,
      message: 'Invalid credentials'
    })
  }
})
app.listen(8080)
module.exports = app