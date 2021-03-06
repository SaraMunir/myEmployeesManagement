import React, {useState, useEffect } from 'react';
import NavIcon from './assets/group.png';
import { Link, useLocation } from "react-router-dom";
function Navbar() {
    const location = useLocation();
    const id = localStorage.id;
    let teamId =localStorage.teamId;;
    const userName = localStorage.name;
    const type = localStorage.type;
    const theme = localStorage.theme;
    const [ memberDetail, setMemberDetail ]= useState({});
    const [ adminDetail, setAdminDetail ]= useState({});
    
    async function loadMemberProfile(){
        if(type === 'Member'){
            const getEmpDetail = await fetch (`/api/memberProfile/${id}`).then( res => res.json());
            setMemberDetail(getEmpDetail);
        }
        if(type === 'Admin'){
            const getAdminDetail = await fetch (`/api/adminProfile/${id}`).then( res => res.json());
            // console.log('getAdminDetail: ', getAdminDetail)
            setAdminDetail(getAdminDetail);
        }
    }
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
            // console.log(' received theme: ', apiResult)
            localStorage.setItem('theme', apiResult);
            document.location.reload(true);
        }
        if (type == 'Member'){
            const apiResult = await fetch(`/api/updateMemTheme/${id}`, 
                {   method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(theme)
                }).then( result => result.json());
            // console.log(' received theme: ', apiResult)
            localStorage.setItem('theme', apiResult);
            document.location.reload(true);
        }
    }
    useEffect(function(){
        loadMemberProfile();
    },[])
    return (
        <nav class={ theme === 'Dark' ? "navbar navbar-expand-lg navbar-dark bg-dark" : "navbar navbar-expand-lg navbar-light bg-light" }>
            <Link to="/HomePage" className={location.pathname === "/HomePage" ? "nav-link active" : "nav-link"}>
            <a class="navbar-brand col-2" href="#"><img className="navIcon" src={NavIcon} alt=""/></a>
            </Link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse mx-auto col-8" id="navbarSupportedContent">
                <ul class="navbar-nav mx-auto col-5">
                    {id && type == 'Admin' ? 
                    <li class="nav-item  mx-auto">
                        <Link to="/ProfilePage" className={location.pathname === "/ProfilePage" ? "nav-link active " : "nav-link"}>
                        <img className="navImgThm mr-3" src={adminDetail.profileImg ? adminDetail.profileImg : "https://i2.wp.com/wp.laravel-news.com/wp-content/uploads/2018/03/avatar-images-spatie.png?resize=2200%2C1125"} alt=""/> Profile
                        </Link>
                    </li> : ''}
                    {/* {id && type == 'Admin' ? 
                    <li class="nav-item  mx-auto">
                        <Link to="/Dashboard" className={location.pathname === "/Dashboard" ? "nav-link active " : "nav-link"}>
                        <i class="fas fa-2x fa-columns"></i> Dashboard
                        </Link>
                    </li> : ''} */}
                    {id && type === 'Member' ?
                    <li class="nav-item  mx-auto">
                        <Link to="/UserProfile/TimeLine" className={location.pathname === "/UserProfile/TimeLine" ? "nav-link active " : "nav-link"}>
                        <img className="postImgThmb mr-3" src={memberDetail.profileImg ? memberDetail.profileImg : "https://i2.wp.com/wp.laravel-news.com/wp-content/uploads/2018/03/avatar-images-spatie.png?resize=2200%2C1125"} alt=""/>
                        Profile
                        </Link>
                    </li> : ''}
                    {id && type === 'Member' ?
                    <li class="nav-item  mx-auto">
                        <Link to={`/TeamDetail/${teamId}/TeamDashboard/HomePage`} className={location.pathname === `/TeamDetail/${teamId}/TeamDashboard/HomePage` ? "nav-link active " : "nav-link"}>
                        <i class="fas fa-2x fa-columns"></i> Team Dashboard
                        </Link>
                    </li> : ''}
                    {!id || type != 'Admin'  ? '':
                    <li class="nav-item  mx-auto">
                        <Link to="/NewTeamsPage" className={location.pathname === "/NewTeamsPage" ? "nav-link active " : "nav-link"}>
                        <i class="fas fa-2x fa-users"></i> Teams
                        </Link>
                    </li>
                    }
                </ul>
            </div>
            {!id ? '':
            <div class="dropdown show col-2">
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
            {!id ?
            <div className="col-3 row">
                <div class="myBtnNew col-5 dropdown">
                    <a class="dropdown-toggle" style={{color:'white'}} href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Log In
                    </a>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <Link to="/MemberLogIn" className="mx-auto">
                            <div class="myBtnNew mx-auto" href="#" role="button">Log In as Member</div>
                        </Link>
                        <Link to="/LogIn">
                            <div class="myBtnNew" href="#" role="button">Log In As Leader</div>
                        </Link>
                    </div>
                </div>
                <Link to="/SignUp">
                    <div class="myBtnNew" style={{width: '100px'}} href="#" role="button">Sign Up</div>
                </Link>
            </div>
            :'' }
        </nav>
    )
}

export default Navbar

