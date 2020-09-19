import React, {useState, useEffect} from 'react';
import { Link, useLocation } from "react-router-dom";
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
        <div className="col-2 newSideBar">
            <ul class="list-group pt-4">
                <Link to={`/TeamDetail/${props.teamId}/TeamDashboard`} className="try"> 
                    <li class={location.pathname === `/TeamDetail/${props.teamId}/TeamDashboard` ? "sidBarItem2Active" : "sidBarItem2"}>
                        <i class="fas fa-tachometer-alt"></i>  Dashboard
                    </li>
                </Link>
                { userType == 'Member' ?
                    <Link to={`/TeamDetail/${teamId}/House/${house._id}/${house.houseName}`} >
                        <li class={location.pathname === `/TeamDetail/${teamId}/House/${house._id}/${house.houseName}` ? "sidBarItem2Active" : "sidBarItem2"}>
                        <i class="fas fa-home"></i> My House
                        </li>
                    </Link>: ''}
                    { userType == 'Admin' ? 
                    <Link to={`/TeamDetail/${props.teamId}/House`} className="try">
                        <li class={location.pathname === `/TeamDetail/${props.teamId}/House` ? "sidBarItem2Active" : "sidBarItem2"}>
                        <i class="fas fa-cog"></i>  Houses
                        </li>
                    </Link> : ""}
                <Link to={`/TeamDetail/${props.teamId}/Members`} className="try"> 
                    <li class={location.pathname === `/TeamDetail/${props.teamId}/Members` ? "sidBarItem2Active" : "sidBarItem2"}>
                    <i class="fas fa-users"></i>  Members
                    </li>
                </Link>
                {userType == 'Admin' ? <Link to={`/TeamDetail/${props.teamId}/Settings`} className="try"> 
                    <li class={location.pathname === `/TeamDetail/${props.teamId}/Settings` ? "sidBarItem2Active" : "sidBarItem2"}>
                    <i class="fas fa-cog"></i>  Settings
                    </li>
                </Link> : ""}
            </ul>
        </div>
    )
}

export default NewSideBar
