import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utilities/helper'
import { toast } from 'react-toastify'
import axiosInstance from '../../utilities/axiosInstance'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!name) {
      setError('Please enter your name')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (!password) {
      setError('Please enter a password')
      return
    }
    setError("")
    try {
      const response = await axiosInstance.post("/auth/create-account", {
        fullName: name,
        email: email,
        password: password
      })

      if (response.data && response.data.error) {
        toast.error(response.data.message)
      }
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken)
        toast.success('Congratualtions! Signup successfull')
        navigate('/login')
      }
    } catch (error) {
      console.error("Login failed error: ", error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('An unexpected error occurred. Please try again!')
      }
    }
  }
  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignup}>
            <h4 className='text-2xl mb-7'>SignUp</h4>
            <input type='text'
              value={name}
              onChange={(e) => { setName(e.target.value) }}
              placeholder='Name'
              className='input-box'
            />
            <input type='text'
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              placeholder='Email'
              className='input-box'
            />
            <PasswordInput
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type='submit' className='btn-primary'>
              Create Account
            </button>
            <p className='text-sm text-center mt-4'>Already have an account? {" "}
              <Link to="/login" className='font-medium text-primary underline'>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
