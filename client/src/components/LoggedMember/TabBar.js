import React from 'react';
import { Link , useLocation } from "react-router-dom";

// const userId = localStorage.id
// const userType = localStorage.type
// const theme = localStorage.theme;
// const teamId = localStorage.teamId;
// const name = localStorage.name;
// const userHouse = localStorage.house;

function TabBar(props) {
    const location = useLocation();
    // const [ house, setHouse] = useState({});

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
            <Link class="mr-1" to={`/UserProfile/TimeLine`} >
                <div className={location.pathname === `/UserProfile/TimeLine` ? "TabActive" : "Tab"}>
                <i class="fas fa-stream"></i> Time Line</div>
            </Link>
            <Link class="mr-1" to={`/UserProfile/About`} > 
                <div className={location.pathname === `/UserProfile/About` ? "TabActive" : "Tab"}>
                <i class="fas fa-user"></i> About</div>
            </Link>
            <Link class="mr-1" to={`/UserProfile/Wall`} > 
                <div className={location.pathname === `/UserProfile/Wall` ? "TabActive" : "Tab"}>
                <i class="fas fa-border-all"></i> Wall</div>
            </Link>
            <Link class="mr-1 notCont" to={`/UserProfile/FriendList`} >
                { 
                    props.frndReq > 0 ? <div className="notificationBtn">{props.frndReq}</div> : ''
                }
                <div className={location.pathname === `/UserProfile/FriendList` ? "TabActive" : "Tab"}>
                <i class="fas fa-user-friends"></i> Friend List </div>
            </Link>




            {/* <Route path={["/UserProfile/Wall"]} component={Wall}/>
            <Route path={["/UserProfile/FriendList"]} component={FriendList}/> */}
        </div>
    )
}

export default TabBar
