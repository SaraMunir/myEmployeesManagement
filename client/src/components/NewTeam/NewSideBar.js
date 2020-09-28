import React, {useState, useEffect} from 'react';
import { Link, useLocation } from "react-router-dom";
// import { fadeInLeft } from 'react-animations'


const userId = localStorage.id
const userType = localStorage.type
const theme = localStorage.theme;
const teamId = localStorage.teamId;
const name = localStorage.name;

const userHouse = localStorage.house;
function NewSideBar(props) {
    const location = useLocation();
    const [ house, setHouse] = useState({});

    async function loadHouse(){
        const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
        console.log('fetched houses are: ', fetchHouses)
        if (userType == 'Member'){fetchHouses.map(house=>
            {if(house._id == userHouse ){
                setHouse(house);
            }}
        )}
    }
    useEffect(function(){
        loadHouse()
    },[])

    return (
        <div className="what">
            <div className="newSideBar">
                <ul class="sideArw2 list-group pt-4">
                    <Link to={`/TeamDetail/${props.teamId}/TeamDashboard/HomePage`} className="try"> 
                        <li class={location.pathname === `/TeamDetail/${props.teamId}/TeamDashboard/HomePage` ? "sidBarItem2Active myBubbleCnt" : "sidBarItem2 myBubbleCnt"}>
                            <i class="crclBtn fas fa-tachometer-alt"></i> 
                            <div className="myBubble">dashboard</div>
                        </li>
                    </Link>
                    { userType == 'Member' ?
                    <Link to={`/TeamDetail/${teamId}/House/${house._id}/${house.houseName}`} >
                        <li class={location.pathname === `/TeamDetail/${teamId}/House/${house._id}/${house.houseName}` ? "sidBarItem2Active myBubbleCnt" : "sidBarItem2 myBubbleCnt"}>
                        <div className="myBubble2">
                            <i class="crclBtn fas fa-home"></i> 
                        </div>
                        <div className="myBubble">My House</div>
                        {/* My House */}
                        </li>
                    </Link>: ''}
                    { userType == 'Admin' ? 
                    <Link to={`/TeamDetail/${props.teamId}/House`} className="try">
                        <li class={location.pathname === `/TeamDetail/${props.teamId}/House` ? "sidBarItem2Active myBubbleCnt" : "sidBarItem2 myBubbleCnt"}>
                        <i class="crclBtn fas fa-home"></i>
                        <div className="myBubble">Houses</div>
                        </li>
                    </Link> : ""}
                    <Link to={`/TeamDetail/${props.teamId}/Members`} className="try"> 
                    <li class={location.pathname === `/TeamDetail/${props.teamId}/Members` ? "sidBarItem2Active myBubbleCnt" : "sidBarItem2 myBubbleCnt"}>
                    <i class="crclBtn fas fa-users"></i>  
                    {/* Members */}
                    <div className="myBubble">Members</div>
                    </li>
                    </Link>
                    {userType == 'Admin' ? <Link to={`/TeamDetail/${props.teamId}/Settings`} className="try"> 
                        <li class={location.pathname === `/TeamDetail/${props.teamId}/Settings` ? "sidBarItem2Active myBubbleCnt" : "sidBarItem2 myBubbleCnt"}>
                        <i class="crclBtn fas fa-cog"></i> 
                        <div className="myBubble">Settings</div> 
                        </li>
                    </Link> : ""}
                </ul>
            </div>

        </div>
    )
}

export default NewSideBar
