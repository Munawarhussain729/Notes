import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utilities/helper'
import axios from 'axios'
import { toast } from 'react-toastify'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        email,
        password
      })
      if (response.data && response.data.error) {
        toast.error(response.data.message)
        return
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      console.error("Login failed error: ", error)
    }
  }
  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7'>Login</h4>
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
              Login
            </button>
            <p className='text-sm text-center mt-4'>Not registered yet? {" "}
              <Link to="/signup" className='font-medium text-primary underline'>
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
