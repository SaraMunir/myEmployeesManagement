import React from 'react';
import NavIcon from './assets/group.png';

import { Link, useLocation } from "react-router-dom";
function Navbar() {
    const location = useLocation();
    const id = localStorage.id;
    const userName = localStorage.name;
    const theme = localStorage.theme;
    function changeTheme(e){
        if(localStorage.theme == 'Light'){
        localStorage.setItem('theme', 'Dark');}
        else 
        localStorage.setItem('theme', 'Light');
        document.location.reload(true)
    }
    return (
        //"navbar navbar-expand-lg navbar-light bg-light"
        <nav class={ theme === 'Dark' ? "navbar navbar-expand-lg navbar-dark bg-dark" : "navbar navbar-expand-lg navbar-light bg-light" }>
            <a class="navbar-brand" href="#"><img className="navIcon" src={NavIcon} alt=""/></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mx-auto">
                    {id ? '':
                    <li class="nav-item">
                        <Link to="/HomePage" className={location.pathname === "/HomePage" ? "nav-link active" : "nav-link"}>
                        <i class="fas fa-2x fa-home"></i> Home Page
                        </Link>
                    </li>}
                    {!id ? '':
                    <li class="nav-item">
                        <Link to="/ProfilePage" className={location.pathname === "/ProfilePage" ? "nav-link active " : "nav-link"}>
                        <i class="fas fa-2x fa-user-circle"></i> Profile
                        </Link>
                    </li>}
                    {!id ? '':
                    <li class="nav-item">
                        <Link to="/Dashboard" className={location.pathname === "/Dashboard" ? "nav-link active " : "nav-link"}>
                        <i class="fas fa-2x fa-chart-line"></i> Dashboard
                        </Link>
                    </li>}
                    {!id ? '':
                    <li class="nav-item">
                        <Link to="/NewTeamsPage" className={location.pathname === "/NewTeamsPage" ? "nav-link active " : "nav-link"}>
                        <i class="fas fa-2x fa-users"></i> Teams
                        </Link>
                    </li>}
                </ul>
                {!id ? '':
                    <div class="dropdown show">
                        <a class="myBtnNew dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Show More
                        </a>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <Link className="dropdown-item" to="/logout" style={{color: 'black', padding: '20px'}}>
                                <i class="fas fa-sign-out-alt"></i> Log Out
                            </Link>
                            <div className="themeBtn" onClick={()=>changeTheme()}>
                                { theme === 'Dark' ? 
                                <div  className="d-flex justify-content-between">
                                    <i class="fas fa-2x fa-sun"></i> Day
                                </div>
                                    : 
                                <div className="d-flex justify-content-between"> 
                                    <i class="fas fa-2x fa-moon"></i> Night
                                </div>
                                }
                            </div>
                        </div>
                    </div>}
            </div>
        </nav>
    )
}

export default Navbar

