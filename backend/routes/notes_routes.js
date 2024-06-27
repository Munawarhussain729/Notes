const express = require('express')
const Note = require('./../models/notes_model')
const { authenticateToken } = require('../utils')
const router = express.Router()

router.post('/add-note', authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body
  const { user } = req.user

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" })
  }
  if (!content) {
    return res.status(400).json({ error: true, message: 'Content is required' })
  }
  if (!user) {
    return res.status(400).json({ error: true, message: 'Please signIn first' })
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    })

    await note.save()

    return res.json({
      error: false,
      note,
      message: 'Note Added successfully'
    })
  } catch (error) {
    console.log("Error is ", error);
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error'
    })
  }

})


module.exports = router