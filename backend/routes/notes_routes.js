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
    
    if(!note){
      return res.json({
        error:false,
        message:'Note not found'
      })
    }

    if(title) note.title = title
    if(content) note.content = content
    if(tags) note.tags = tags
    if(isPinned) note.isPinned = isPinned

    await note.save()

    return res.json({
      error:false,
      note,
      message:'Note updated successfully'
    })

  } catch (error) { 
    console.log("Error is ", error);
    return res.json({
      error:true,
      message:'Internal Server Error'
    })
  }
})

module.exports = router