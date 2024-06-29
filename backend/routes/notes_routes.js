const express = require('express')
const Note = require('./../models/notes_model')
const { authenticateToken } = require('../utils')
const router = express.Router()

router.get('/get-notes', authenticateToken, async (req, res) => {
  const { user } = req.user
  try {
    if (!user) {
      return res.status(400).json({ error: true, message: 'Please signIn first' })
    }

    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 })

    return res.json({
      error: false,
      notes,
      message: 'All notes retrieved successfully'
    })

  } catch (error) {
    console.error("1-notes get-all error is: ", error);
    return res.json({
      error: true,
      message: 'Internal Server Error'
    })
  }
})

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
    console.error("2-notes add-note error is: ", error);
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error'
    })
  }

})

router.patch('/edit-note/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId
  const { title, content, tags, isPinned } = req.body
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res.status(400).json({
      error: true,
      message: 'No changes provided'
    })
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id })

    if (!note) {
      return res.json({
        error: false,
        message: 'Note not found'
      })
    }

    if (title) note.title = title
    if (content) note.content = content
    if (tags) note.tags = tags
    if (isPinned) note.isPinned = isPinned

    await note.save()

    return res.json({
      error: false,
      note,
      message: 'Note updated successfully'
    })

  } catch (error) {
    console.error("3-notes edit-note error is: ", error);
    return res.json({
      error: true,
      message: 'Internal Server Error'
    })
  }
})

router.delete('/:noteId', authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.noteId
    const { user } = req.user
    if (!user) {
      return res.status(400).json({
        error: true,
        message: 'Please signIn first'
      })
    }
    const note = await Note.findOne({ _id: noteId, userId: user._id })
    if (!note) {
      return res.status(400).json({
        error: true,
        message: 'Note not found'
      })
    }

    await Note.deleteOne({ _id: noteId, userId: user._id })

    return res.json({
      error: false,
      message: 'Note deleted successfully'
    })
  } catch (error) {
    console.error("4-notes delete error is: ", error);
    return res.json({
      error: true,
      message: 'Internal Server Error'
    })

  }
})

router.patch('/updated-note-pinned/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId
  const { isPinned } = req.body
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id })
    if (!note) {
      return res.json({
        error: false,
        message: 'Note not found'
      })
    }
    if (isPinned){
      note.isPinned = isPinned
    }else{
      note.isPinned = false
    }

    await note.save()

    return res.json({
      error: false,
      note,
      message: 'Note updated successfully'
    })

  } catch (error) {
    console.error("5-notes add-note error is: ", error);
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error'
    })
  }
})


module.exports = router