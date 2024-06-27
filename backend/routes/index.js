const express = require('express')
const User = require('./../models/user_model')
const router = express.Router()
const userRoutes = require('./user_routes')
const noteRoutes = require('./notes_routes')

router.use('/auth', userRoutes)
router.use('/notes', noteRoutes)

module.exports = router