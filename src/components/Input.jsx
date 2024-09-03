import React from 'react'

export default function Input({ spanContent, span=true, addClass=null, placeholder, name, handleClick, handleChange, content }) {
  return (
    <>
      { span ? (
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">{spanContent}</span>
          <input 
              type="text" 
              className={`form-control ${addClass}`}
              placeholder={placeholder} 
              name={name} 
              aria-label="Sizing example input" 
              aria-describedby="inputGroup-sizing-default"
              onClick={handleClick}
              onChange={handleChange}
              value={content}
              />
        </div>
      ) : (
        <input 
        type="text"  
        className={`form-control ${addClass}`}
        placeholder={placeholder} 
        name={name} 
        aria-label="Sizing example input" 
        aria-describedby="inputGroup-sizing-default"
        onClick={handleClick}
        onChange={handleChange}
        value={content}
        />
      )}
    </>
  )
}
