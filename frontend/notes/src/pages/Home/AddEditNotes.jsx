import React, { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md'

const AddEditNotes = ({ noteData, type, onClose }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState([])
  const [error, setError] = useState(null)

  const addNote = async () => { }

  const editNote = async () => { }

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title")
      return
    }

    if (!content) {
      setError("Please enter the content")
      return
    }
    if(type === 'add'){
      addNote()
    }else{
      editNote()
    }
  }

  return (
    <div className='relative'>
      <button
        onClick={onClose}
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'>
        <MdClose className='text-xl text-slate-400' />
      </button>
      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input
          type='text'
          className='text-2xl text-slate-950 outline-none'
          placeholder='Go to Gym '
          value={title}
          onChange={(e) => { setTitle(e.target.value) }}
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='input-label'>CONTENT</label>
        <textarea
          type='text'
          className='text-sm text-slate-950 outline-none bg-slate-50 p-3 rounded'
          placeholder='Content'
          rows={10}
          value={content}
          onChange={(e) => { setContent(e.target.value) }}
        />

        <div className='mt-3'>
          <label className='input-label'>TAGS</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>
        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}
        <button
          className='btn-primary font-medium mt-5 p-3'
          onClick={handleAddNote}
        >
          ADD
        </button>
      </div>
    </div>
  )
}

export default AddEditNotes
