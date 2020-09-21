import React, {} from 'react';
import { Link, useParams , useLocation } from "react-router-dom";
function TabBar(props) {
    const location = useLocation();
    const userId = localStorage.id
    const userType = localStorage.type
    const theme = localStorage.theme;
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
            { props.isUserFriend == true ||  props.membId == userId ?
            <Link class="mr-1" to={`/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/Wall`} > 
            <div className={location.pathname === `/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/Wall` ? "TabActive" : "Tab"}>
            <i class="fas fa-border-all"></i> Wall</div>
            </Link> : ""
            }
            <Link class="mr-1" to={`/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/FriendList`} >
                <div className={location.pathname === `/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/FriendList` ? "TabActive" : "Tab"}>
                <i class="fas fa-user-friends"></i> Friend List</div>
            </Link>
        </div>
    )
}

export default TabBar
