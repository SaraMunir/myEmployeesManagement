import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SideBar from './SideBar';
import Employees from './Employees'
import Departments from './Departments'
import Roles from './Roles'
import Dashboard2 from './TeamDashBoard'
export const UserContext = React.createContext();

function TeamPage() {
    const userId = localStorage.id;
    const [teamDetail, setTeamDetail]= useState( []);

    const { teamId } = useParams();
    
    async function loadTeamProfile(){
        const getTeamDetail= await fetch(`/api/TeamDetail/${teamId}/${userId}`).then(result=>result.json());
        console.log('getTeamDetail: ', getTeamDetail)
        setTeamDetail(getTeamDetail);
    }
    useEffect( function(){
        console.log('teamId:', teamId)
        loadTeamProfile();
    }, []);


    return (
        <div className="d-flex wrapper">
            <UserContext.Provider value ={{teamDetail}}>   
                <Router>
                <SideBar teamId={teamId}/>
                <div className="col-10 teamDashboard">
                    <Route exact path={["/TeamPage/:teamId"]} component={Dashboard2}/>
                    <Route path={["/TeamPage/:teamId/Employees"]} component={Employees} />
                    <Route path={["/TeamPage/:teamId/Departments"]} component={Departments} />
                    <Route exact path={["/TeamPage/:teamId/Roles"]} component={Roles} />
                </div>
                </Router>
            </UserContext.Provider>
        </div>
    )
}

export default TeamPage
