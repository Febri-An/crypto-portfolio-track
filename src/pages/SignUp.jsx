import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import GoogleIcon from '@mui/icons-material/Google';
import '../styles/Login.css'

export default function SignUp() {
  const navigate = useNavigate()
  const isStarting = useRef(true)

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
    const response = await fetch(`http://localhost:5000/register`, {
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
    const result = await response.json()
    console.log(result)

    if (!result.error) {
      navigate('/', { state: { username: result.username, body: result } })
    } else {
      alert(result.error)
    }
  }

  function google() {
    window.open('http://localhost:5000/auth/google', '_self')
  } 

  useEffect(() => {
    async function prepare() {
        if (isStarting.current) {

            const response = await fetch('http://localhost:5000/get-session', {
                credentials: "include"
            })
            const data = await response.json()
            console.log('data sesion:', data)
            if (Object.keys(data).length) {
                // console.log([data.body])
                setInfo(prevValue => {
                  return {
                    ...prevValue,
                    email: data.body.email
                  }
                })
            }
        }
    }
    prepare()
    isStarting.current = false;
}, [])
    

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Register</h1>

        <div className="input-box">
          <input type="text" name='username' placeholder='Username' value={info.username} onChange={handleChange} required/>
          <FaUser className='icon'/>
          <input type="password" name='password' placeholder='Password' value={info.password} onChange={handleChange} required/>
          <FaLock className='icon'/>
          <input type="text" name='email' placeholder='Email' value={info.email} onChange={handleChange} required/>
          <FaEnvelope className='icon'/>
        </div>
        <button className="signup-btn" onClick={handleClick}>Sign Up</button>

        <label className='sign-label'>~Or Sign Up With~</label>
        <a className="btn btn-block" onClick={google} role="button">
          <GoogleIcon />
        </a>

        <div className="sign-link">
          <p>Have an account? <Link to={'/login'}>Login</Link></p>
        </div>
      </div>
    </div>
  )
}
