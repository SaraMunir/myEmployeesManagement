import React, { useState, useContext, useEffect }  from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { UserContext } from './TeamPage';
import { Link, useParams } from "react-router-dom";
import "./TeamDashBoard.css"


function TeamDashBoard() {
    const { teamId } = useParams();
    const [teamDetail, setTeamDetail]= useState([]);
    const [teamMembersDetail, setTeamMembersDetail]= useState([]);
    const [femaleMembersDetail, setFemaleMembersDetail]= useState([]);
    const [maleMembersDetail, setMaleMembersDetail]= useState([]);
    const [otherMembersDetail, setOtherMembersDetail]= useState([]);
    const [monthlyBirthday, setMonthlyBirthday]= useState([]);
    const [value, onChange] = useState(new Date());    
    
    async function loadTeamProfile(){
        const userId = localStorage.id;
        let femaleMembArray = [];
        let maleMembArray = [];
        let otherMembArray = [];
        let birthdayArray = [];
        const getTeamDetail = await fetch(`/api/TeamDetail/${teamId}/${userId}`).then(result=>result.json());
        getTeamDetail.teamMembers.map(element => {
            if (element.membSex ==="F"){
                femaleMembArray.push(element);
            } else if  (element.membSex ==="M"){
                maleMembArray.push(element);
            } else
            otherMembArray.push(element);
        });

        setTeamDetail(getTeamDetail);
        setTeamMembersDetail(getTeamDetail.teamMembers)
        setFemaleMembersDetail(femaleMembArray);
        setMaleMembersDetail(maleMembArray);
        setOtherMembersDetail(otherMembArray);

        getTeamDetail.teamMembers.map(member => {
            if( member.birthday != "undefined"){
                if(member.birthday.split("-")[1].slice(1) == value.getMonth()+1){
                    birthdayArray.push(member);
                }
            }
        })
        setMonthlyBirthday(birthdayArray);
    }
    useEffect( function(){
        loadTeamProfile();
    }, []);    
    
    return (
        <div>
            <main role="main" class="inner cover">
                <div className="card mb-3 mt-3">
                    <div className="card-body">
                        <h1 class="cover-heading">{teamDetail.teamName}</h1>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <h2 class="cover-heading">Team Member</h2>
                        <h3>total no of Members: {teamMembersDetail.length}</h3>
                        <div className="row mx-auto">
                            <div class="card mx-auto">
                                <div className="card-body">
                                    <h3>Female Members: </h3>
                                    <h5>total no of Female Members: {femaleMembersDetail.length}</h5>
                                    <ul class="list-group  text-left">
                                        {teamMembersDetail.filter(memb => memb.membSex =='F').map(filteredName => (
                                        <li class="list-group-item">{filteredName.membName}</li>))}
                                    </ul>
                                </div>
                            </div>
                            <div  class="card mx-auto">
                                <div className="card-body">
                                    <h3>Male Members:</h3>
                                    <h5>total no of Male Members: {maleMembersDetail.length}</h5>
                                    <ul class="list-group text-left">
                                    {teamMembersDetail.filter(memb => memb.membSex =='M').map(filteredName => (
                                        <li  class="list-group-item">{filteredName.membName} </li>))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body row">
                        {teamMembersDetail.map( memb => {
                            switch (memb.membSex){
                                case "F":
                                    return (
                                    <Link to={`/TeamPage/${teamId}/${memb._id}/${memb.membName}`} >
                                        <div class="card mx-auto">
                                            <div class="card-body">
                                                <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" class="empAvatarThmb"/>
                                                <h5 class="">{memb.membName}</h5>
                                            </div>
                                        </div>
                                    </Link>
                                    )
                                case "M":
                                    return(  
                                    <Link to={`/TeamPage/${teamId}/${memb._id}/${memb.membName}`} >
                                        <div class="card mx-auto">
                                            <div class="card-body">
                                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-EdmT6pfXNT_HO-f842hBiYEzHCwGGLsrEnkm-zqw74FoOb4&s" alt="" class="empAvatarThmb"/>
                                                <h5 class="card-title">{memb.membName}</h5>
                                            </div>
                                        </div>
                                    </Link>)
                                default:   
                                    return (
                                    <Link to={`/TeamPage/${teamId}/${memb._id}/${memb.membName}`} >
                                        <div class="card mx-auto">
                                            <div class="card-body">
                                                <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" alt="" class="empAvatarThmb"/>
                                                <h5 class="card-title">{memb.membName}</h5>
                                            </div>
                                        </div>
                                    </Link>
                                    )
                            }
                        })}
                    </div>
                </div>
                <div className="row mt-3 mx-auto">
                    <div className="card col-6 mx-auto" >
                    <Calendar
                        onChange={onChange}
                        value={value}
                        style={{"width": "100%"}}
                    />
                    
                    </div>
                    <div className="col-6 mx-auto" >
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text" >
                                    <i class="fas fa-birthday-cake mx-auto"></i>
                                </div>
                            </div>
                            <div className="form-control">
                                <h5 className="text-left">upcoming birthday</h5>
                                {monthlyBirthday.length == 0 ? 
                                    <h4 class="mt-5 mx-auto">No upcoming birthdays for this month</h4>:
                                monthlyBirthday.map( memb => {
                                    switch (memb.membSex){
                                        case "F":
                                            return (
                                                <div className="memberBirthday">
                                                    <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="employee_avatar" className="memberBirthday__avatar"/>
                                                    <div className="empSumm ml-3">
                                                        <p className="memberBirthday__para">{memb.membName}</p>
                                                        <p className="memberBirthday__para">{memb.birthday}</p>
                                                    </div>
                                                </div>
                                            )
                                        case "M":
                                            return (
                                                <div className="memberBirthday">
                                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-EdmT6pfXNT_HO-f842hBiYEzHCwGGLsrEnkm-zqw74FoOb4&s" alt="employee_avatar" className="memberBirthday__avatar"/>
                                                    <div className="empSumm ml-3">
                                                        <p className="memberBirthday__para">{memb.membName}</p>
                                                        <p className="memberBirthday__para">{memb.birthday}</p>
                                                    </div>
                                                </div>
                                            )
                                        default:   
                                            return (
                                                <div className="memberBirthday">
                                                    <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" alt="employee_avatar" className="memberBirthday__avatar"/>
                                                    <div className="empSumm ml-3">
                                                        <p className="memberBirthday__para">{memb.membName}</p>
                                                        <p className="memberBirthday__para">{memb.birthday}</p>
                                                    </div>
                                                </div>
                                            )
                                    }
                                })} 
                            </div>
                        </div>
                        {/* <div class="input-group mb-2">
                            <div class="input-group-prepend" style={{"min-height": "130px"}}>
                                <div class="input-group-text" style={{ "width":"100px"}}>
                                    <i class="far fa-newspaper fa-2x mx-auto"></i>
                                </div>
                            </div>
                            <div className="form-control" style={{"min-height": "130px"}}>
                                <h5 className="text-left">News</h5>
                                <div className="d-flex text-left">
                                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore itaque repudiandae in corrupti...</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TeamDashBoard
