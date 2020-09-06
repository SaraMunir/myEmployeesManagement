import React, {useState, useContext, useEffect, useRef } from 'react';
import { Link, useParams , useLocation } from "react-router-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TimeLine from './MemberTimeLine'
import About from './MemberAbout'
import TabBar from './TabBar'
export const UserContext = React.createContext();

function MemberProfile() {
    const location = useLocation();

    const { membId } = useParams();
    const { teamId } = useParams();
    const [ memberDetail, setMemberDetail ]= useState({});

    async function loadMemberProfile(){
        const fetchEmployeeDetail = await fetch (`/api/memberProfile/${membId}`).then( res => res.json());
        console.log('fetched Member detail is: ', fetchEmployeeDetail)
        setMemberDetail(fetchEmployeeDetail)
    }

    useEffect(function(){
        loadMemberProfile()
        // console.log('teamDetail: ', teamDetail)
    },[])

    return (
        <div className="container-fluid">
            <div className="row mx-auto">
                <img className="profilePhoto col-4 mx-auto" src="https://i2.wp.com/wp.laravel-news.com/wp-content/uploads/2018/03/avatar-images-spatie.png?resize=2200%2C1125" alt="memberImg"/>
                <div className="membAbout col-8 mx-auto">
                    <h4 className="myTitle text-left"> {memberDetail.name} </h4>
                    <h5 className="mySubTxt text-left"> {memberDetail.role}</h5>
                </div>
            </div>
            <div className="row mx-auto">
                <div className="col-4">
                    something
                </div>
                <div className="col-8">
                    <UserContext.Provider value ={{memberDetail}}> 
                        <Router>
                        <div className="d-flexb tabBox">
                            <TabBar teamId={teamId} membName={memberDetail.name} membId={memberDetail._id}/>
                        {/* /TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id} */}
                        {/* /TeamDetail/:teamId/TeamDashboard */}
                            
                        </div>
                        <div className="memDetail">
                            <Route exact path={["/TeamDetail/:teamId/MemberProfile/:memberName/:membId/TimeLine"]} component={TimeLine} />
                            <Route exact path={["/TeamDetail/:teamId/MemberProfile/:memberName/:membId/About"]} component={About} memberDetail={memberDetail} />
                        </div>
                        </Router>
                    </UserContext.Provider>
                </div>
            </div>
        </div>
    )
}

export default MemberProfile
