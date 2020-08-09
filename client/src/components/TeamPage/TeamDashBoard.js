import React, { useContext }  from 'react'
import { UserContext } from '../TeamPage/TeamPage';


function TeamDashBoard() {

    
    const {teamDetail} = useContext(UserContext);
    return (
        <div>
            <main role="main" class="inner cover">
                <h1 class="cover-heading">{teamDetail.teamName}</h1>
                <p class="lead">{teamDetail.teamDesc}</p>
            </main>
        </div>
    )
}

export default TeamDashBoard
