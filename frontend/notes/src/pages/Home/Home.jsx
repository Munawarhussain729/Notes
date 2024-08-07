import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utilities/axiosInstance'
import { formatDate } from '../../utilities/helper'
import { toast } from 'react-toastify'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import AddNoteImg from '../../assets/add-note.svg'
import NoData from '../../assets/search-icon.svg'

Modal.setAppElement('#root');
function Home() {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: 'add',
    data: null
  })
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState()
  const [allNotes, setAllNotes] = useState([])
  const [isSearch, setIsSearch] = useState(false)


  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/auth/get-user');
      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem('accessToken')
        navigate('/login')
      }
      toast.error('Error while fetching user info')
    }
  }

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/notes/get-notes')
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.error("Error while fetching notes: ", error)
      toast.error('Unable to fetch notes')
    }
  }

  const handleEdit = (noteDetail) => {
    setOpenAddEditModel({ isShown: true, data: noteDetail, type: 'edit' })
  }

  const handleDeleteNote = async (noteDetail) => {
    try {
      const noteId = noteDetail._id
      const response = await axiosInstance.delete(`/notes/${noteId}`)
      if (response.data && response.data.message) {
        toast.success(response.data.message)
        getAllNotes()
      }
    } catch (error) {
      if (error.response &&
        error.response.data &&
        error.response.data.message) {
        toast.error(error.response.data.message)
      }
      console.log("An unexpected error occure. Please try agian!")
    }
  }

  const handlePinNote = async (noteDetail) => {
    try {
      const noteId = noteDetail._id
      const response = await axiosInstance.patch(`/notes/updated-note-pinned/${noteId}`, {
        isPinned: !noteDetail.isPinned
      })
      if (response.data && response.data.message) {
        toast.success(response.data.message)
        getAllNotes()
      }
    } catch (error) {
      if (error.response &&
        error.response.data &&
        error.response.data.message) {
        toast.error(error.response.data.message)
      }
      console.log("An unexpected error occure. Please try agian!")
    }
  }

  const handleSearch = async ({ query }) => {
    try {
      const response = await axiosInstance.get("/notes/search-notes", {
        params: { query }
      })
      if (response.data && response.data.notes) {
        setIsSearch(true)
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      if (error.response &&
        error.response.data &&
        error.response.data.message) {
        toast.error(error.response.data.message)
      }
      console.log("An unexpected error occure in search ", error)
    }
  }

  const handleClearSearch = () => {
    setIsSearch(false)
    getAllNotes()
  }
  useEffect(() => {
    getUserInfo()
    getAllNotes()
    return () => { }
  }, [])


  return (
    <div>
      <Navbar
        userInfo={userInfo}
        handleSearch={handleSearch}
        onClearSearch={handleClearSearch}
      />
      <div className='container px-5 md:px-0 py-8 mx-auto'>
        {allNotes.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8'>
            {allNotes.map((note, index) => (
              <NoteCard
                key={index}
                title={note.title}
                date={formatDate(note.createdOn)}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDeleteNote(note)}
                onPinNote={() => handlePinNote(note)}
              />
            ))}
          </div>) : (
          <EmptyCard
            imgSrc={isSearch ? NoData : AddNoteImg}
            message={isSearch ? 'Oops! No notes found matching your search.' : `Start creating your first note! Click the 'Add' to write down your thoughts and ideas. Lets get started'`} />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: 'add', data: null })
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: 'rgb(0,0,0,0.2)',
          }
        }}
        contentLabel=''
        className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 '
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          onClose={() => (setOpenAddEditModel({ isShown: false, type: 'add', data: null }))}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </div>
  )
}

export default Home
