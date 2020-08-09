import React, {useState, useContext, useEffect} from 'react';
import { Link, useLocation } from "react-router-dom";

const userId = localStorage.id;
export default function TeamWindow(props) {
    // const location = useLocation();

    // const [teams, setTeams] = useState([]);
    return (
        <div className="teamWindow row mx-auto">
            { props.teams.length == 0 ? 
                <h4 class="mt-5 mx-auto">You have not created any Teams yet</h4>
                :
                props.teams.map( team => 
                    <div class="card myCard mx-auto">
                        <img class="card-img-top myCrdImgTp" src="https://image.freepik.com/free-vector/employee-group-portrait-illustration_74855-5495.jpg" alt="Card image cap"/>
                        <div class="card-body">
                            <h5 class="card-title">{team.teamName}</h5>
                            <p class="card-text">{team.teamDesc}</p>
                            <Link to={'/TeamPage/'+team._id} >
                                <div class="btn myBtn" href="#" role="button">view Detail </div>
                            </Link>
                        </div>
                    </div>
                    )
            }
        </div>
    )
}
