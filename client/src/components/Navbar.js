import React, { useState, useEffect }  from 'react';
import { Link, useLocation } from "react-router-dom";
function Navbar() {
    const location = useLocation();
    const id = localStorage.id;
    const userName = localStorage.name;
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">

                    {/* <li class="nav-item">
                        <Link to="/HomePage" className={location.pathname === "/HomePage" ? "nav-link active " : "nav-link"}>
                        Home
                        </Link>
                    </li> */}
                    {id ? '':
                    <li class="nav-item">
                        <Link to="/HomePage" className={location.pathname === "/HomePage" ? "nav-link active" : "nav-link"}>
                        Home Page
                        </Link>
                    </li>}
                    {!id ? '':
                    <li class="nav-item">
                        <Link to="/ProfilePage" className={location.pathname === "/ProfilePage" ? "nav-link active " : "nav-link"}>
                        Profile
                        </Link>
                    </li>}
                    {!id ? '':
                    <li class="nav-item">
                        <Link to="/Dashboard" className={location.pathname === "/Dashboard" ? "nav-link active " : "nav-link"}>
                        Dashboard
                        </Link>
                    </li>}
                    {!id ? '':
                        <Link to="/logout" style={{color: 'black', paddingLeft: '20px'}} className={location.pathname === "/logout" ? "nav-link active" : "nav-link"}>
                        <div class="btn myBtn" href="#" role="button">Log Out </div>
                        </Link>
                    }
                    
                </ul>
            </div>
        </nav>
    )
}

export default Navbar

