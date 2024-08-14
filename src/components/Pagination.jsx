import React from "react";

export default function Pagination({ key, page, currentPage, setCurrentPage }) {
    return (
            <button 
                key={key} type="button" 
                className={`btn btn-outline-secondary ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
            >
                {page}
            </button>
    )
}