import React, {useState, useContext, useEffect, useRef } from 'react';
import { Link, useParams , useLocation } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
function TabBar(props) {
    const location = useLocation();
    const { teamId } = useParams();


    return (
        <div class="d-flex tabBAr">
            <Link class="mr-1" to={`/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/TimeLine`} >
                <div className={location.pathname === `/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/TimeLine` ? "TabActive" : "Tab"}>
                Time Line</div>
            </Link>
            <Link class="mr-1" to={`/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/About`} > 
                <div className={location.pathname === `/TeamDetail/${props.teamId}/MemberProfile/${props.membName}/${props.membId}/About` ? "TabActive" : "Tab"}>
                About</div>
            </Link>
        </div>
    )
}

export default TabBar
