import React from "react";

export default function Pagination({ key, page, currentPage, setCurrentPage, deletePage }) {
    return (
            <button 
                key={key} type="button" 
                className={`btn btn-outline-secondary ${page === currentPage ? 'active' : ''}`}
                onClick={() => {
                    setCurrentPage(page)
                    console.log('page button executed')
                }}
            >{page}
                { page === 1 ? null : (
                    <button 
                        className="delete-page"
                        onClick={(event) => deletePage(event, page)}
                        >x
                    </button>
                )}
            </button>
    )
}