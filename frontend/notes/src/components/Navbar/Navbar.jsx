import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'

const Navbar = ({ userInfo, handleSearch, onClearSearch }) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
    navigate('/login')
  }



  const handleClearSearch = () => {
    setSearchQuery("")
    onClearSearch()
  }

  const handleSearchQuery = (e)=>{
    if(!e.target.value){
      handleClearSearch()
      return
    }
    setSearchQuery(e.target.value)

  }
  const onSearch = () => {
    if (searchQuery) {
      handleSearch({ query: searchQuery })
    }
  }
  return (
    <div className='bg-white flex items-center justify-between drop-shadow px-6 py-2'>
      <h1 className='text-xl font-medium text-black py-2'>Notes</h1>
      <SearchBar
        value={searchQuery}
        onChange={handleSearchQuery}
        clearSearch={handleClearSearch}
        handleSearch={onSearch} 
      />
      <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
    </div>
  )
}

export default Navbar
