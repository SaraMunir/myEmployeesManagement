import React from 'react';
import NavIcon from './assets/group.png';

import { Link, useLocation } from "react-router-dom";
function Navbar() {
    const location = useLocation();
    const id = localStorage.id;
    const userName = localStorage.name;
    const type = localStorage.type;
    const theme = localStorage.theme;
    async function changeTheme(time){
        const theme ={
            theme : time
        }
        console.log('theme: ', time)
        if (type == 'Admin'){
            const apiResult = await fetch(`/api/updateTheme/${id}`, 
                {   method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(theme)
                }).then( result => result.json());
            console.log(' received theme: ', apiResult)
            localStorage.setItem('theme', apiResult);
            document.location.reload(true);
        }
    }
    return (
        //"navbar navbar-expand-lg navbar-light bg-light"
        <nav class={ theme === 'Dark' ? "navbar navbar-expand-lg navbar-dark bg-dark" : "navbar navbar-expand-lg navbar-light bg-light" }>
            <a class="navbar-brand col-2" href="#"><img className="navIcon" src={NavIcon} alt=""/></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse mx-auto  col-8" id="navbarSupportedContent">
                <ul class="navbar-nav mx-auto col-5">
                    {id ? '':
                    <li class="nav-item  mx-auto">
                        <Link to="/HomePage" className={location.pathname === "/HomePage" ? "nav-link active" : "nav-link"}>
                        <i class="fas fa-2x fa-home"></i> Home Page
                        </Link>
                    </li>}
                    {!id ? '':
                    <li class="nav-item  mx-auto">
                        <Link to="/ProfilePage" className={location.pathname === "/ProfilePage" ? "nav-link active " : "nav-link"}>
                        <i class="fas fa-2x fa-user-circle"></i> Profile
                        </Link>
                    </li>}
                    {!id ? '':
                    <li class="nav-item  mx-auto">
                        <Link to="/Dashboard" className={location.pathname === "/Dashboard" ? "nav-link active " : "nav-link"}>
                        <i class="fas fa-2x fa-chart-line"></i> Dashboard
                        </Link>
                    </li>}
                    {!id ? '':
                    <li class="nav-item  mx-auto">
                        <Link to="/NewTeamsPage" className={location.pathname === "/NewTeamsPage" ? "nav-link active " : "nav-link"}>
                        <i class="fas fa-2x fa-users"></i> Teams
                        </Link>
                    </li>}
                </ul>
            </div>
            {!id ? '':
            <div class="dropdown show  col-2">
                <a class="myBtnNew dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Show More
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <Link className="dropdown-item" to="/logout" style={{color: 'black', padding: '10px'}}>
                        <i class="fas fa-sign-out-alt"></i> Log Out
                    </Link>
                    { theme === 'Dark' ? 
                    <div  className="text-left themeBtn mx-auto" onClick={()=>changeTheme('Light')} >
                        <i class="fas fa-sun"></i> Day
                    </div>
                        : 
                    <div  className="text-left themeBtn mx-auto"   onClick={()=>changeTheme('Dark')}> 
                        <i class="fas fa-moon"></i> Night
                    </div>
                    }
                </div>
            </div>
            }
        </nav>
    )
}

export default Navbar

