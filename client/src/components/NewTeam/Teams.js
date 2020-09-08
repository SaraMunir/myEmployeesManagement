import React, {useState, useContext, useEffect} from 'react';
import { Link, useLocation, useParams } from "react-router-dom";

import {Modal, Button} from 'react-bootstrap'
// import TeamWindow from './Dashboard/TeamWindow'
const adminId = localStorage.id
const adminName = localStorage.name

function Teams() {

    const [lgShow, setLgShow] = useState(false);
    const [ newTeam, setNewTeam ] = useState({ teamName: "", teamDesc: "", adminId: localStorage.id, adminName: localStorage.name});
    const [teams, setTeams] = useState([]);
    async function loadAllTeams(){
        const fetchTeams = await fetch (`/api/allTeams/${adminId}`).then( res => res.json());
        console.log('fetched all teams are: ', fetchTeams)
        setTeams(fetchTeams)
    }
    function handleInputChange( e ){
        const { id, value } = e.target; 
        setNewTeam( { ...newTeam, [id]: value } );
    }

    async function submitTeam(e){
        console.log('team create?')
        e.preventDefault();
        const apiResult = await fetch('/api/newteams', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTeam)
            }).then( result=>result.json())
            setNewTeam({ teamName: "", teamDesc: "", adminId: `${adminId}`})
            setLgShow(false);
            loadAllTeams();
        }
    useEffect(function(){
        const adminId = localStorage.id

        console.log('adminId: ', adminId)
        loadAllTeams();
    },[])
    return (
        <div class="container mt-2">
            <div className="d-flex justify-content-end">
                {/* <div className="myBtn2">Create Team</div> */}
                <Button onClick={() => setLgShow(true)}>Create Team
                </Button>
                <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg">
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Project
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div class="form-group">
                                <label for="teamName">Create My Team</label>
                                <input type="text" class="form-control" id="teamName" aria-describedby="taskHelp" onChange={handleInputChange} value={newTeam.teamName}/>
                                <label for="teamDesc">Example textarea</label>
                                <textarea class="form-control" id="teamDesc" rows="3" value={newTeam.teamDesc} onChange={handleInputChange}></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" onClick={submitTeam}>Submit</button>
                        </form>
                    </Modal.Body>
                </Modal> 
            </div>
            {/* <TeamWindow teams = {teams} button ={Button}/> */}
            <div className="teamWindow2 row mx-auto">
            { teams.length == 0 ? 
                <h4 class="mt-5 mx-auto">You have not created any Teams yet</h4>
                :
                teams.map( team => 
                    <div class="myCard teamCard mx-auto">
                        <img class="card-img-top myCrdImgTp" src="https://images.squarespace-cdn.com/content/v1/59685a82893fc01de25af303/1526696054881-K3PHNE63S3CR3EBW0D98/ke17ZwdGBToddI8pDm48kA47qaxzGU3oa60Mv3IrElh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0jBK0T3M-v-AVkQFEHxhNgUudw45kiY-UQ73op4W9iSPFDhmgzum_ZisgY9UJzHOlA/Teams_illustrations_Full+Res-01.png?format=2500w" alt="Card image cap"/>
                        <div class="card-body">
                            <h5 class="card-title">{team.teamName}</h5>
                            <p class="card-text">{team.teamDesc}</p>
                            <Link to={`/TeamDetail/${team._id}/TeamDashboard`} >
                                <div class="btn myBtnNew" href="#" role="button">View Detail </div>
                            </Link>
                        </div>
                    </div>
                    )
                }
            </div>
            
        </div>
    )
}

export default Teams
