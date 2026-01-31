import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const Nav = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("asubebAttSchool");
        localStorage.removeItem("asubebAttLga");
        localStorage.removeItem("asubebAttStaffType");
        localStorage.removeItem("asubebTid");
        navigate("/");
    }

  return (
    <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
            <a className="btn btn-ghost text-xl">
                <img src="logo.png" alt="Logo" className='w-10 h-auto rounded-full' />
            </a>
        </div>
        
        <div className="flex-none ml-4">
            <button onClick={logout} className="btn bg-white border-0 px-2 mr-3 text-white">
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg> */}
                Logout
            </button>
        </div>
    </div>
  )
}

export default Nav
