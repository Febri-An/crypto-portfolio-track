import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert';
import { FaUser, FaLock } from "react-icons/fa";
import '../styles/Login.css'

export default function Login() {
  const [isCorrect, setIsCorrect] = useState({
    status: null,
    message: ''
  })

  const nameRef = useRef(null)
  const passRef = useRef(null)

  const navigate = useNavigate()

  async function handleClick() {
    const username = nameRef.current.value
    const password = passRef.current.value

    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    const result = await response.json()

    if (result.error) {
      setIsCorrect({
        status: false,
        message: result.error
      })
    }
    else {
      setIsCorrect({
        status: true,
        message: username 
      })
      navigate('/', { state: { username: username, body: result } })
    }
  }

  return (
    <div className="login-container">

      { 
        isCorrect.status !== null && (
          <Alert className="alert" severity={isCorrect.status === true ? "success" : "error"}>
            {isCorrect.message}.
          </Alert>
        )
      }

      <div className="login-box">
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" name='username' placeholder='Username' ref={nameRef} required/>
          <FaUser className='icon'/>
          <input type="password" name='password' placeholder='Password' ref={passRef} required/>
          <FaLock className='icon'/>
        </div>
        <div className="remember-forgot">
          <label><input type="checkbox"/>Remember me</label>
          <a href='#'>Forgot Password?</a>
        </div>
        <button onClick={handleClick}>Login</button>
        <div className="signup-link">
          <p>Don't have account? <Link to={'/sign-up'}>Sign-up</Link></p>
        </div>
      </div>
    </div>
  )
}
