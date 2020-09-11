import React, {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import {Modal, Button} from 'react-bootstrap'
const adminId = localStorage.id

function Roles() {

    const { teamId } = useParams();

    const [lgShow, setLgShow] = useState(false);
    const [ myRoles, setMyRoles ] = useState({ roleName: "", roleDesc: "", adminId: `${adminId}`, teamId: `${teamId}`});

    const [roles, setRoles] = useState([]);
    
    async function loadRoles(){
        const fetchRoles = await fetch (`/api/roles/${adminId}/${teamId}`).then( res => res.json());
        console.log('fetched roles are: ', fetchRoles)
        setRoles(fetchRoles)
    }
    function handleInputChange( e ){
        const { id, value } = e.target; 
        setMyRoles( { ...myRoles, [id]: value } );
    }
    async function deleteRole(roleId){
        console.log('role id : ', roleId)
        const apiDeleteRole= await fetch(`/api/deleteRole/${adminId}/${teamId}/${roleId}`);
        loadRoles()
    }

    async function submitRole(e){
        e.preventDefault();
        const apiResult = await fetch('/api/roles', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myRoles)
            }).then( result=>result.json());
            console.log(apiResult.message)
            setMyRoles({ roleName: "", roleDesc: "", adminId: `${adminId}`, teamId: `${teamId}`})
            setLgShow(false);
            loadRoles()
    }
    useEffect(function(){
        console.log('adminId: ', adminId)
        loadRoles();

    },[])
    return (
        <div>
            <div className="d-flex justify-content-end mb-2 mt-2">
                <Button onClick={() => setLgShow(true)}>Add Roles</Button>
                <Modal size="lg" show={lgShow} onHide={() => setLgShow(false)}
                    aria-labelledby="example-modal-sizes-title-lg">
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-lg">
                            Roles
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div class="form-group">
                                    <label for="roleName">Add Role</label>
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    id="roleName" aria-describedby="taskHelp" onChange={handleInputChange} 
                                    value={roles.roleName}/>
                                    <label for="roleDesc">Example textarea</label>
                                    <textarea class="form-control" id="roleDesc" rows="3" value={roles.roleDesc} onChange={handleInputChange}></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary" onClick={submitRole}>Submit</button>
                            </form>
                        </Modal.Body>
                    </Modal> 
            </div>
            <div  div class="row">
                { roles.length == 0 ? 
                <h4 class="mt-5 mx-auto">You have not created any Roles yet</h4>
                :
                roles.map( role => 
                    <div class="card myCard mx-auto">
                        <div className="mb-2 mt-2 mr-2 d-flex justify-content-end">
                            <i class="far fa-times-circle" onClick={()=>deleteRole(role._id)}></i>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">{role.roleName}</h5>
                            <p class="card-text">{role.roleDesc}</p>
                        </div>
                    </div>
                    )
            }
            </div>
        </div>
    )
}

export default Roles
