import React, {useState, useContext, useEffect} from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TeamDashboard from './TeamDashboard';
import Members from './Members';
import Roles from './Settings/Roles';
import House from './Settings/House'
import NewSideBar from './NewSideBar';
import MembersProfile from './MemberProfile/MemberProfile';
import Settings from './Settings/Settings';

export const UserContext = React.createContext();
function TeamDetail() {
    const { teamId } = useParams();
    const [teamDetail, setTeamDetail]= useState( {});
    async function loadTeamDetail(){
        const fetchTeamDetail = await fetch (`/api/teamDetails/${teamId}`).then( res => res.json());
        console.log('fetched team detail is: ', fetchTeamDetail)
        setTeamDetail(fetchTeamDetail)
    }
    return (
        <div className="d-flex wrapper">
            <UserContext.Provider value ={{}}> 
                <Router>
                <NewSideBar teamId={teamId}/>
                <div className="teamDashboard">
                    <Route path={["/TeamDetail/:teamId/TeamDashboard"]} component={TeamDashboard} />
                    <Route path={["/TeamDetail/:teamId/Roles"]} component={Roles} />
                    <Route path={["/TeamDetail/:teamId/House"]} component={House} />
                    <Route path={["/TeamDetail/:teamId/Settings"]} component={Settings} />
                    <Route path={["/TeamDetail/:teamId/Members"]} component={Members} />
                    <Route path={["/TeamDetail/:teamId/MemberProfile/:membName/:membId"]} component={MembersProfile} />
                </div>
                </Router>
            </UserContext.Provider>
        </div>
    )
}

export default TeamDetail
