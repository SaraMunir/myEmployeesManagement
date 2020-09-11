import React, {} from 'react';
import { Link, useParams , useLocation } from "react-router-dom";
function TabBar(props) {
    const location = useLocation();
    const { teamId } = useParams();


    return (
        <div class="d-flex tabBAr">
            <Link class="mr-1" to={`/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/TimeLine`} >
                <div className={location.pathname === `/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/TimeLine` ? "TabActive" : "Tab"}>
                <i class="fas fa-stream"></i> Time Line</div>
            </Link>
            <Link class="mr-1" to={`/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/About`} > 
                <div className={location.pathname === `/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/About` ? "TabActive" : "Tab"}>
                <i class="fas fa-user"></i> About</div>
            </Link>
        </div>
    )
}

export default TabBar
