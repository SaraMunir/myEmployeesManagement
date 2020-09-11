import React from 'react';
import NavIcon from './assets/group.png';

import { Link, useLocation } from "react-router-dom";
function Navbar() {
    const location = useLocation();
    const id = localStorage.id;
    const userName = localStorage.name;
    const theme = localStorage.theme;
    function changeTheme(e){
        if(localStorage.theme== 'Light'){
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
                    <Link to="/logout" style={{color: 'black', paddingLeft: '20px'}} className='myBtnNew'>
                    <i class="fas fa-2x fa-sign-out-alt"></i> Log Out 
                    
                    </Link>
                }
                {
                    !id ? '':
                <div className="themeBtn" onClick={()=>changeTheme()}>
                    {  theme === 'Dark' ? <i class="fas fa-2x fa-sun"></i> : <i class="fas fa-2x fa-moon"></i>}
                </div>
                }
            </div>
        </nav>
    )
}

export default Navbar

