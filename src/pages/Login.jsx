import React from 'react'
import { FaUser, FaLock } from "react-icons/fa";
import '../styles/Login.css'

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" placeholder='Username'/>
          <FaUser className='icon'/>
          <input type="password" placeholder='Password'/>
          <FaLock className='icon'/>
        </div>
        <div className="remember-forgot">
          <label><input type="checkbox"/>Remember me</label>
          <a href='#'>Forgot Password?</a>
        </div>
        <button>Login</button>
        <div className="signup-link">
          <p>Don't have account? <a href="#">Sign-up</a></p>
        </div>
      </div>
    </div>
  )
}
