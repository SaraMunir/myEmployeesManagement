import React, {useState, useEffect} from 'react';
import { Link, useParams , useLocation } from "react-router-dom";

const userId = localStorage.id
const userType = localStorage.type
const theme = localStorage.theme;
const teamId = localStorage.teamId;
const name = localStorage.name;
const userHouse = localStorage.house;

function TabBar(props) {
    const location = useLocation();
    const [ house, setHouse] = useState({});

    // async function loadHouse(){
    //     const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
    //     console.log('fetched houses are: ', fetchHouses)
    //     fetchHouses.map(house=>
    //         {if(house._id == userHouse ){
    //             setHouse(house);
    //         }}
    //         )
    // }
    // useEffect(function(){
    //     loadHouse()
    // },[])
    return (
        <div class="d-flex tabBAr">
            <Link class="mr-1" to={`/MemberProfile/TimeLine`} >
                <div className={location.pathname === `/MemberProfile/TimeLine` ? "TabActive" : "Tab"}>
                <i class="fas fa-stream"></i> Time Line</div>
            </Link>
            <Link class="mr-1" to={`/MemberProfile/About`} > 
                <div className={location.pathname === `/MemberProfile/About` ? "TabActive" : "Tab"}>
                <i class="fas fa-user"></i> About</div>
            </Link>
            
        </div>
    )
}

export default TabBar
