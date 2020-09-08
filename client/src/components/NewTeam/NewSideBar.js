import React from 'react'
import { Link, useLocation } from "react-router-dom";

function NewSideBar(props) {
    const location = useLocation();

    return (
        <div className="col-2 newSideBar">
            <ul class="list-group pt-4">

                {/*    /TeamDashboard/:teamId    */}
                <Link to={`/TeamDetail/${props.teamId}/TeamDashboard`} className="try"> 
                    <li class={location.pathname === `/TeamDetail/${props.teamId}/TeamDashboard` ? "sidBarItem2Active" : "sidBarItem2"}>
                        Dashboard
                    </li>
                </Link>
                {/*   /TeamDetail/:teamId/Members    */}
                {/* <Link to={`/TeamDetail/${props.teamId}/Roles`} className="try"> 
                    <li class={location.pathname === `/TeamDetail/${props.teamId}/Roles` ? "sidBarItem2Active" : "sidBarItem2"}>
                        Roles
                    </li>
                </Link> */}
                {/* "/TeamDetail/:teamId/Settings */}
                <Link to={`/TeamDetail/${props.teamId}/Settings`} className="try"> 
                    <li class={location.pathname === `/TeamDetail/${props.teamId}/Settings` ? "sidBarItem2Active" : "sidBarItem2"}>
                    <i class="fas fa-cog"></i>  Settings
                    </li>
                </Link>
                <Link to={`/TeamDetail/${props.teamId}/Members`} className="try"> 
                    <li class={location.pathname === `/TeamDetail/${props.teamId}/Members` ? "sidBarItem2Active" : "sidBarItem2"}>
                        Members
                    </li>
                </Link>
                
                {/* <Link to={`/TeamPage/${props.teamId}/Employees`} className="try">
                    <li class={location.pathname === `/TeamPage/${props.teamId}/Employees` ? "sidBarItemActive" : "sidBarItem"}>
                        Members
                    </li>
                </Link>
                <Link to={`/TeamPage/${props.teamId}/Departments`} className="try">
                    <li class={location.pathname === `/TeamPage/${props.teamId}/Departments` ? "sidBarItemActive" : "sidBarItem"}>
                        Departments
                    </li>
                </Link>
                <Link to={`/TeamPage/${props.teamId}/Roles`} className="try">
                    <li class={location.pathname === `/TeamPage/${props.teamId}/Roles` ? "sidBarItemActive" : "sidBarItem"}>
                        Roles
                    </li>
                </Link> */}
            </ul>
        </div>
    )
}

export default NewSideBar
