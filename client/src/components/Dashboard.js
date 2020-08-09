import React, {useState, useContext, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap'
import TeamWindow from './Dashboard/TeamWindow'
const adminId = localStorage.id
function Dashboard() {
    const [lgShow, setLgShow] = useState(false);
    const [ myTeam, setMyTeam ] = useState({ teamName: "", teamDesc: "", adminId: `${adminId}`});

    const [teams, setTeams] = useState([]);

    async function loadTeams(){
        const fetchTeams = await fetch (`/api/teams/${adminId}`).then( res => res.json());
        console.log('fetched teams are: ', fetchTeams[0].teams)
        setTeams(fetchTeams[0].teams)
    }


    function handleInputChange( e ){
        const { id, value } = e.target; 
        setMyTeam( { ...myTeam, [id]: value } );
    }
    async function submitTeam(e){
        console.log('team create?')
        e.preventDefault();
        const apiResult = await fetch('/api/teams', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myTeam)
            }).then( result=>result.json())
            setMyTeam({ teamName: "", teamDesc: "", adminId: `${adminId}`})
            setLgShow(false);
            loadTeams()
    }
    useEffect(function(){
        console.log('adminId: ', adminId)
        loadTeams();
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
                                <input type="text" class="form-control" id="teamName" aria-describedby="taskHelp" onChange={handleInputChange} value={myTeam.teamName}/>
                                <label for="teamDesc">Example textarea</label>
                                <textarea class="form-control" id="teamDesc" rows="3" value={myTeam.teamDesc} onChange={handleInputChange}></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" onClick={submitTeam}>Submit</button>
                        </form>
                    </Modal.Body>
                </Modal> 
            </div>
            <TeamWindow teams = {teams} button ={Button}/>
            
        </div>
    )
}

export default Dashboard
