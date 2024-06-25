import React, { useState } from 'react'

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false)

  const toogleShowPassword = () => {
    setShowPassword(!showPassword)
  }
  return (
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
      <input
        value={value}
        onChange={onChange}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
        className='w-full text-sm bg-transparent py-3 mr-2 rounded outline-none'

      />
    </div>
  )
}

export default PasswordInput
