import React from 'react'
import { Link, useLocation, useParams } from "react-router-dom";

function TeamNavbar(props) {
    const location = useLocation();
    const theme = localStorage.theme;
    return (
        <div className={ theme === "Dark" ? "teamNavBarDark": "teamNavBarLight"}>
            <div class="mx-auto d-flex col-8 ">
                <Link to={`/TeamDetail/${props.teamId}/TeamDashboard/HomePage`} className={location.pathname === `/TeamDetail/${props.teamId}/TeamDashboard/HomePage` ? "myNavActive mx-auto" : "myNav mx-auto"}>Home Page </Link>
                <Link to={`/TeamDetail/${props.teamId}/TeamDashboard/DiscussionBoard`} className={location.pathname === `/TeamDetail/${props.teamId}/TeamDashboard/DiscussionBoard` ? "myNavActive mx-auto" : "myNav mx-auto"}>Discussion Board</Link>
                <Link to={`/TeamDetail/${props.teamId}/TeamDashboard/EventsPage`} className={location.pathname === `/TeamDetail/${props.teamId}/TeamDashboard/EventsPage` ? "myNavActive mx-auto" : "myNav mx-auto"}>Events Board</Link>
            </div>
        </div> 
    )
}

export default TeamNavbar
