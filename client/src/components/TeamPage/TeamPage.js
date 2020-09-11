// import React, { useState, useEffect } from 'react';
// import { useParams } from "react-router-dom";
// import { BrowserRouter as Router, Route } from "react-router-dom";
// import SideBar from './SideBar';
// // import Employees from './Employees'
// import Departments from './Departments'
// import Roles from './Roles'
// import Dashboard from './TeamDashBoard'
// import MembProfile from './MembProfile'
// export const UserContext = React.createContext();

// function TeamPage() {
//     const userId = localStorage.id;
//     const [teamDetail, setTeamDetail]= useState({});
//     const [teamMembersDetail, setTeamMembersDetail]= useState([]);
//     const [teamRolesDetail, setTeamRolesDetail]= useState([]);
//     const [femaleMembersDetail, setFemaleMembersDetail]= useState([]);
//     const [maleMembersDetail, setMaleMembersDetail]= useState([]);
//     const [otherMembersDetail, setOtherMembersDetail]= useState([]);
//     const { teamId } = useParams();
    
//     async function loadTeamProfile(){
//         const getTeamDetail= await fetch(`/api/TeamDetail/${teamId}/${userId}`).then(result=>result.json());
//         let femaleMembArray=[]
//         let maleMembArray=[]
//         let otherMembArray=[]
//         getTeamDetail.teamMembers.map(element => {
//             if (element.membSex ==="F"){
//                 femaleMembArray.push(element);
//             } else if  (element.membSex ==="M"){
//                 maleMembArray.push(element);
//             } else
//             otherMembArray.push(element);
//         });
//         setTeamDetail(getTeamDetail);
//         setTeamMembersDetail(getTeamDetail.teamMembers)
//         setTeamRolesDetail(getTeamDetail.teamRoles)
//         setFemaleMembersDetail(femaleMembArray);
//         setMaleMembersDetail(maleMembArray);
//         setOtherMembersDetail(otherMembArray);
//         // setFemaleMembersDetail(getTeamDetail.teamMembers)
//     }

//     useEffect( function(){
//         loadTeamProfile();
//     }, []);

//     return (
//         <div className="d-flex wrapper">
//             <UserContext.Provider value ={{teamDetail, teamMembersDetail, femaleMembersDetail, maleMembersDetail, teamRolesDetail}}> 
//                 <Router>
//                 <SideBar teamId={teamId}/>
//                 <div className="col-10 teamDashboard">
//                     <Route exact path={["/TeamPage/:teamId"]} component={Dashboard} />
//                     {/* <Route path={["/TeamPage/:teamId/Employees"]} component={Employees} /> */}
//                     <Route path={["/TeamPage/:teamId/Departments"]} component={Departments}/>
//                     <Route  path={["/TeamPage/:teamId/Roles"]} component={Roles} />
//                     <Route path={["/TeamPage/:teamId/:membId/:membName"]} component={MembProfile}/>
//                 </div>
//                 </Router>
//             </UserContext.Provider>
//         </div>
//     )
// }

// export default TeamPage
