import React from 'react'
import ProfileInfo from '../Cards/ProfileInfo'

const Navbar = () => {
  return (
    <div className='bg-white flex items-center justify-between drop-shadow px-6 py-2'>
      <h1 className='text-xl font-medium text-black py-2'>Notes</h1>

      <ProfileInfo/>
    </div>
  )
}

export default Navbar
