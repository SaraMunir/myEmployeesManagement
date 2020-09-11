import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import OnHoverScrollContainer from "./scroll/CustomScrollDiv";

const adminId = localStorage.id

function AdminDashboard() {
    const [ adminDetail, setAdminDetail ]= useState({});
    const [ teams, setTeams ] = useState([]);

    async function loadAdminProfile(){
        const getAdmnDetail = await fetch (`/api/adminProfile/${adminId}`).then( res => res.json());
        console.log('fetched Admin detail is: ', getAdmnDetail)
        setAdminDetail(getAdmnDetail);
    }
    async function loadAllTeams(){
        const fetchTeams = await fetch (`/api/allTeams/${adminId}`).then( res => res.json());
        console.log('fetched all teams are: ', fetchTeams)
        setTeams(fetchTeams)
    }
    useEffect(function(){
        loadAdminProfile();
        loadAllTeams()
    },[])
    return (
        <div>
            <h4 className="myTeamName">admins dashboard</h4> 
            <div className="d-flex tryngWindow">
                <div className="groupList col-3">
                <OnHoverScrollContainer>
                    <div className="myPinnedTeams">
                        <h5 className="greyHeading">Pinned Teams</h5>
                        {teams.map(team=>
                            team.pinned == true ?
                            <Link to={`/TeamDetail/${team._id}/TeamDashboard`} >
                                <div key={team} class="sideBarListItem d-flex">
                                    <img class="groupThmImg" src="https://squalio.com/wp-content/uploads/2018/08/teams-2.jpg" alt=""/>
                                    <p class="groupThmFnt"> {team.teamName}</p>
                                </div>
                            </Link> : ''
                        )}
                    </div>
                    <hr/>
                    <div className="myteams">
                        <h5 className="greyHeading">My Teams</h5>
                        { teams.length == 0 ? 
                        <p class="mt-5 mx-auto">You have not created any Teams yet</p> :
                        teams.slice(0,6).map( (team, idx) =>
                            {
                                return(
                                <div>
                                    <Link to={`/TeamDetail/${team._id}/TeamDashboard`} >
                                        <div key={team+idx} class="sideBarListItem d-flex">
                                            <img class="groupThmImg" src="https://squalio.com/wp-content/uploads/2018/08/teams-2.jpg" alt=""/>
                                            <p class="groupThmFnt"> {team.teamName}</p>
                                        </div>
                                    </Link>
                                </div>
                                )
                            }
                        )}
                        { teams.length > 6 ? <div className="myBtnNew mx-auto">Show More</div>: '' }
                    </div>
                </OnHoverScrollContainer>
                </div>
                <div className="otherContent">
                    
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
