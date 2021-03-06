import React, {useState, useEffect} from 'react';
import { Link , Redirect} from "react-router-dom";
import {Modal, Button} from 'react-bootstrap'
import Loader from  "./Rolling-1s-200px.gif";

function Teams() {
    const adminId = localStorage.id
    const [loading, setLoading] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [ newTeam, setNewTeam ] = useState({ teamName: "", teamDesc: "", adminId: localStorage.id, adminName: localStorage.name});
    const [teams, setTeams] = useState([]);
    async function loadAllTeams(){
        setLoading(true)
        const fetchTeams = await fetch (`/api/allTeams/${adminId}`).then( res => res.json());
        console.log('fetched all teams are: ', fetchTeams)
        setTeams(fetchTeams)
        setLoading(false)
    }
    function handleInputChange( e ){
        const { id, value } = e.target; 
        setNewTeam( { ...newTeam, [id]: value } );
    }
    async function pinTeam(teamId){
        setLoading(true)
        const fetchTeams = await fetch (`/api/pinTeam/${teamId}`).then( res => res.json());
        console.log('fetched all teams are: ', fetchTeams)
        loadAllTeams();
        setLoading(false)

    }
    async function submitTeam(e){
        setLoading(true)
        console.log('team create?')
        e.preventDefault();
        await fetch('/api/newteams', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTeam)
            }).then( result=>result.json())
            setNewTeam({ teamName: "", teamDesc: "", adminId: `${adminId}`})
            setLgShow(false);
            setLoading(false)

            loadAllTeams();
        }
    useEffect(function(){
        // const adminId = localStorage.id
        // console.log('adminId: ', adminId)
        loadAllTeams();
    },[])
    return (
        <div class="container mt-2">
            { adminId ? '': <Redirect to='/HomePage' />  }
            <div className={loading === true ? "loaderWindow": "hide"}>
                <div className="loadingWnd">
                    <img className="loadingGif" src={Loader} alt="loadingWndow"/>
                </div>
            </div>
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
                                <label for="teamDesc">Provide Description</label>
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
                teams.map( (team, idx) => 
                    {
                    return(
                    <div key={`team_${idx}`} class="myCard teamCard mx-auto">
                        <div className="d-flex">
                            { team.pinned == false ? <i class="fas fa-thumbtack pin" onClick={()=>pinTeam(team._id)}></i> : <i class="fas fa-thumbtack pinned" onClick={()=>pinTeam(team._id)}></i>}
                        </div>
                        <div class="card-body">
                            <img class="card-img-top myCrdImgTp" src="https://images.squarespace-cdn.com/content/v1/59685a82893fc01de25af303/1526696054881-K3PHNE63S3CR3EBW0D98/ke17ZwdGBToddI8pDm48kA47qaxzGU3oa60Mv3IrElh7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0jBK0T3M-v-AVkQFEHxhNgUudw45kiY-UQ73op4W9iSPFDhmgzum_ZisgY9UJzHOlA/Teams_illustrations_Full+Res-01.png?format=2500w" alt="Card image cap"/>
                            <h5 class="card-title">{team.teamName}</h5>
                            <p class="card-text">{team.teamDesc}</p>
                            <Link to={`/TeamDetail/${team._id}/TeamDashboard/HomePage`} >
                                <div class="btn myBtnNew" href="#" role="button">View Detail </div>
                            </Link>
                        </div>
                    </div>)}
                    )
                }
            </div>
            
        </div>
    )
}

export default Teams
