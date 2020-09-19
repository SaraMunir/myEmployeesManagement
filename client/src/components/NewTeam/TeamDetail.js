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
    async function loadTeamDetail(){
        const fetchTeamDetail = await fetch (`/api/teamDetails/${teamId}`).then( res => res.json());
        console.log('fetched team detail is: ', fetchTeamDetail)
        setTeamDetail(fetchTeamDetail)
    }
    useEffect(function(){
        loadTeamDetail()
    },[])
    return (
        <div>
            <div className="d-flex">
                <h3 class="myTeamName col-2" ></h3>
                <h3 class="myTeamName col-10" >{teamDetail.teamName}</h3>
            </div>
            <div className="d-flex wrapper">
            <UserContext.Provider value ={{teamDetail}}> 
                <Router>
                <NewSideBar teamId={teamId} class="col-2"/>
                <div className={ theme === 'Dark'? 'fullWidth': "teamDashboard  justify-content-end"}>
                    <Route path={["/TeamDetail/:teamId/TeamDashboard"]} component={TeamDashboard} />
                    <Route path={["/TeamDetail/:teamId/Roles"]} component={Roles} />
                    <Route exact path={["/TeamDetail/:teamId/House"]} component={House} />
                    <Route exact path={["/TeamDetail/:teamId/House/:houseId/:houseName"]} component={MyHouse} />
                    <Route path={["/TeamDetail/:teamId/Settings"]} component={Settings} />
                    <Route path={["/TeamDetail/:teamId/Members"]} component={Members} />
                    {/* /TeamDetail/${teamId}/MemberProfile */}
                    {/* /TeamDetail/${teamId}/MemberProfile/${name}/${userId}/TimeLine */}
                    {/* /TeamDetail/${teamId}/MemberProfile/TimeLine */}
                    {/* <Route path={["/TeamDetail/:teamId/MemberProfile/:name/:userId"]} component={UsersProfile} /> */}
                    <Route path={["/TeamDetail/:teamId/MemberProfile/:membName/:membId"]} component={MembersProfile} />
                </div>
                </Router>
            </UserContext.Provider>
            </div>
        </div>
    )
}

export default TeamDetail
