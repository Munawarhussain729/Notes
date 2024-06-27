const express = require('express')
const jwt = require("jsonwebtoken")
const User = require('./../models/user_model');
const { authenticateToken } = require('../utils');
const router = express.Router()

router.post('/create-account', async (req, res) => {
  const { fullName, email, password } = req.body
  try {
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
  } catch (error) {
    console.error("1-users create-account error is ", error)
    return res.json({
      error: true,
      message: 'Internal Server Error'
    })
  }

})

router.get('/get-user', authenticateToken, async (req, res) => {
  try {
    const { user } = req.user
    const isUser = await User.findOne({ _id: user._id })
    if (!isUser) {
      return res.status(404).json({
        error: true,
        message: 'No user found'
      })
    } 

    return res.json({
      error: false,
      user: isUser,
      message: 'User fetched successfully'
    })

  } catch (error) {
    console.error("3-users get user error is ", error)
    return res.json({
      error: true,
      message: 'Internal Server Error'
    })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email) {
      return res.status(400).json({ error: true, message: 'Email is required' })
    }
    if (!password) {
      return res.status(400).json({ error: true, message: 'Password is required' })
    }
    const userInfo = await User.findOne({ email: email })
    if (!userInfo) {
      return res.status(404).json({
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
  } catch (error) {
    console.error("2-users login error is ", error)
    return res.json({
      error: true,
      message: "Internal Server Error"
    })
  }
})


module.exports = router