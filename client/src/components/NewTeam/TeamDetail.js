import React, {useState, useContext, useEffect} from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TeamDashboard from './TeamDashboard';
import Members from './Members';
import Roles from './Settings/Roles';
import House from './Settings/House'
import MyHouse from './Settings/House/HouseProfile'

import NewSideBar from './NewSideBar';
import MembersProfile from './MemberProfile/MemberProfile';
import Settings from './Settings/Settings';
const userId = localStorage.id
const userType = localStorage.type

export const UserContext = React.createContext();
function TeamDetail() {
    const { teamId } = useParams();
    const [teamDetail, setTeamDetail]= useState( {});
    async function loadTeamDetail(){
        const fetchTeamDetail = await fetch (`/api/teamDetails/${teamId}`).then( res => res.json());
        console.log('fetched team detail is: ', fetchTeamDetail)
        setTeamDetail(fetchTeamDetail)
    }
    useEffect(function(){
        loadTeamDetail()
    },[])
    return (
        <div >
            <h3 class="myTeamName" >{teamDetail.teamName}</h3>
            <div className="d-flex wrapper">

            <UserContext.Provider value ={{teamDetail}}> 
                <Router>
                <NewSideBar teamId={teamId}/>
                <div className="teamDashboard">
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
