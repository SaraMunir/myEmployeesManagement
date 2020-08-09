import React from 'react'
import { Link, useLocation } from "react-router-dom";

function SideBar(props) {
    const location = useLocation();

    return (
        <div className="col-2 sideBar">
            <ul class="list-group pt-4">
                <Link to={`/TeamPage/${props.teamId}`} className="try">
                    <li class={location.pathname === `/TeamPage/${props.teamId}` ? "sidBarItemActive" : "sidBarItem"}>
                        Dashboard
                    </li>
                </Link>
                <Link to={`/TeamPage/${props.teamId}/Employees`} className="try">
                    <li class={location.pathname === `/TeamPage/${props.teamId}/Employees` ? "sidBarItemActive" : "sidBarItem"}>
                        Employees
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
                </Link>
            </ul>
        </div>
    )
}

export default SideBar
