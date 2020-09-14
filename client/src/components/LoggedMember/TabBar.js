import React, {} from 'react';
import { Link, useParams , useLocation } from "react-router-dom";

const userId = localStorage.id
const userType = localStorage.type
const theme = localStorage.theme;
const teamId = localStorage.teamId;
const name = localStorage.name;

function TabBar(props) {
    const location = useLocation();
    // const { teamId } = useParams();
    return (
        <div class="d-flex tabBAr">
            <Link class="mr-1" to={`/MemberProfile/${name}/${userId}/TimeLine`} >
                <div className={location.pathname === `/MemberProfile/${name}/${userId}/TimeLine` ? "TabActive" : "Tab"}>
                <i class="fas fa-stream"></i> Time Line</div>
            </Link>
            <Link class="mr-1" to={`/MemberProfile/${name}/${userId}/About`} > 
                <div className={location.pathname === `/MemberProfile/${name}/${userId}/About` ? "TabActive" : "Tab"}>
                <i class="fas fa-user"></i> About</div>
            </Link>
        </div>
    )
}

export default TabBar
