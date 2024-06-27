const express = require('express')
const jwt = require("jsonwebtoken")
const User = require('./../models/user_model');
const router = express.Router()

router.post('/create-account', async (req, res) => {
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


router.post('/login', async (req, res) => {
  const { email, password } = req.body
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

  if (userInfo.email === email && userInfo.password === password) {
    const user = { user: userInfo }
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600m' })
    return res.json({
      error: false,
      email,
      accessToken,
      message: 'Login Successful'
    })
  } else {
    return res.json({
      error: true,
      message: 'Invalid credentials'
    })
  }
})


module.exports = router