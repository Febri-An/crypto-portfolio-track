import React from 'react'
import Input from './Input'
import SearchIcon from '@mui/icons-material/Search'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export default function Dropdown({ labelContent, dropdownType, placeholder, name, handleClick, handleChange, content, isDeleted, array, sliceStart=0, sliceEnd=array.length, resultName, resultClick }) {
  return (
    <div className="input-group mb-3 search">
        <label className="input-group-text grey-bg">{labelContent}</label>
        <div className="search-box">
            { dropdownType === "input" ? (
                <>
                <Input 
                span={false}
                addClass={"search-form"}
                placeholder={placeholder}
                name={name}
                handleClick={handleClick}
                handleChange={handleChange}
                content={content}/>
                <label className="icon"><SearchIcon /></label>
                </>
            ) : (
                <>
                <button className="search-btn" onClick={handleClick}>
                    {content}
                </button>
                { isDeleted ? (<label className="icon"><ArrowDropDownIcon /></label>) : (<label className="icon"><ArrowDropUpIcon /></label>)}
                
                </>
            )}

            { isDeleted ? null : (
                <ul className="result-box">
                    {array.slice(sliceStart, sliceEnd).map((item, index) => <li onClick={resultClick} data-key={index} data-name={resultName}>{item}</li>)}
                </ul>
            )}
        </div>
    </div>
  )
}
