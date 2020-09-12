import React, {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TeamDashboard from './TeamDashboard';
import Members from './Members';
import Roles from './Settings/Roles';
import House from './Settings/House'
import MyHouse from './Settings/House/HouseProfile'

import NewSideBar from './NewSideBar';
import MembersProfile from './MemberProfile/MemberProfile';
import Settings from './Settings/Settings';
export const UserContext = React.createContext();
function TeamDetail() {
    const theme = localStorage.theme;
    const { teamId } = useParams();
    const [teamDetail, setTeamDetail]= useState( {});
    
    return (
        <div >
            <h3 class="myTeamName" >{teamDetail.teamName}</h3>
            <div className="d-flex wrapper">
            <UserContext.Provider value ={{teamDetail}}> 
                <Router>
                <NewSideBar teamId={teamId}/>
                {/* "teamDashboard" */}
                <div className={ theme === 'Dark'? 'fullWidth': "teamDashboard"}>
                    <Route path={["/TeamDetail/:teamId/TeamDashboard"]} component={TeamDashboard} />
                    <Route path={["/TeamDetail/:teamId/Roles"]} component={Roles} />
                    <Route exact path={["/TeamDetail/:teamId/House"]} component={House} />
                    <Route exact path={["/TeamDetail/:teamId/House/:houseId/:houseName"]} component={MyHouse} />
                    <Route path={["/TeamDetail/:teamId/Settings"]} component={Settings} />
                    <Route path={["/TeamDetail/:teamId/Members"]} component={Members} />
                    <Route path={["/TeamDetail/:teamId/MemberProfile/:membName/:membId"]} component={MembersProfile} />
                </div>
                </Router>
            </UserContext.Provider>
            </div>
        </div>
    )
}

export default TeamDetail
