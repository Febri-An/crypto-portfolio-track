import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import '../styles/Login.css'

export default function Login() {
  const navigate = useNavigate()

  const [info, setInfo] = useState({
    username: '',
    password: '',
    email: ''
  })

  function handleChange(event) {
    const { name, value } = event.target
    setInfo(prevValue => {
        return {
            ...prevValue,
            [name]: value
        }
    })

  }

  async function handleClick() {
    const response = await fetch(`http://localhost:3001/add-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: info.username,
        password: info.password,
        email: info.email
      })
    })
    const data = await response.json()

    if (!data.error) {
      navigate('/')
    }
  }

    

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Register</h1>
        <div className="input-box">
          <input type="text" name='username' placeholder='Username' onChange={handleChange} required/>
          <FaUser className='icon'/>
          <input type="password" name='password' placeholder='Password' onChange={handleChange} required/>
          <FaLock className='icon'/>
          <input type="text" name='email' placeholder='Email' onChange={handleChange} required/>
          <FaEnvelope className='icon'/>
        </div>
        <button onClick={handleClick}>Sign Up</button>
        <div className="signup-link">
          <p>Have an account? <Link to={'/login'}>Login</Link></p>
        </div>
      </div>
    </div>
  )
}
