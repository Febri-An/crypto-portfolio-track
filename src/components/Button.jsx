import React from 'react'

export default function Button({ addClass, handleClick, content }) {
  return (
    <button type="button" className={`btn ${addClass}`} 
      onClick={handleClick}>
      {content}
    </button>
  )
}
