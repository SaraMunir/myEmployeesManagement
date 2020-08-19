import React, { useState, useEffect, useContext } from 'react';
import {Modal, Button} from 'react-bootstrap'

import { useParams } from "react-router-dom";
import { UserContext } from '../TeamPage/TeamPage';

function MembProfile() {

    const userId = localStorage.id;
    
    const { teamRolesDetail } = useContext(UserContext);
    const { teamId } = useParams();
    const { membId } = useParams();
    const [membDetail, setMembDetail]= useState( {});
    const [lgShow, setLgShow] = useState(false);
    const [ employeeEdit, setEmployeeEdit ] = useState({ membName: "", membDesc: "", membRole: "", membRoleId: "", birthday:"", address:"", membSex: "",membPassword: "", userId: `${userId}`, teamId: `${teamId}`});

    async function loadEmpProfile(){
        // console.log('membId: ', membId)
        const getEmpDetail= await fetch(`/api/employeeDetail/${userId}/${teamId}/${membId}`).then(result=>result.json());
        // console.log('getEmpDetail: ', getEmpDetail)
        setMembDetail(getEmpDetail);
    }

    function handleInputChange( e ){
        const { id, value } = e.target; 
        setEmployeeEdit( { ...employeeEdit, [id]: value } );
        }

    async function saveChanges(e){
        e.preventDefault();
        console.log( 'employeeEdit ', employeeEdit)
        
        
        // const apiResult = await fetch('/api/employees', 
        //     {   method: 'post',
        //         headers: {
        //             'Accept': 'application/json, text/plain, */*',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(employeeEdit)
        //     }).then( result=>result.json());
        //     console.log(apiResult.message)
        //     setEmployeeEdit({ membName: "", membDesc: "", membRole: "", membSex: "", userId: `${userId}`, teamId: `${teamId}`})
            setLgShow(false);
            loadEmpProfile()
    }
    useEffect( function(){
        console.log('teamId:', teamId)
        loadEmpProfile();
    }, []);

    return (
        <div>
            <Button onClick={() => setLgShow(true)}>Edit Detail</Button>
                {<Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg">
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg"> Member
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div class="form-group">
                                <div className="form-group">
                                    <label for="membName">Name</label>
                                    <input type="text" class="form-control" 
                                    id="membName" aria-describedby="taskHelp" placeholder={membDetail.membName} onChange={handleInputChange} 
                                    value={employeeEdit.membName==="" ? membDetail.membName: employeeEdit.membName}/>
                                    
                                </div>
                                <div className="form-group">
                                    <label for="membName">Address</label>
                                    <input type="text" class="form-control" 
                                    id="address" aria-describedby="taskHelp" placeholder="address" onChange={handleInputChange} 
                                    value={employeeEdit.address}/>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="membRole">Change Role</label>
                                    <select 
                                    id="membRole" class="form-control" value={employeeEdit.membRole} 
                                    onChange={handleInputChange} >
                                        <option selected>{membDetail.membRole}</option>
                                        {teamRolesDetail.map( role => 
                                        <option value={role.roleName}>{role.roleName}</option>
                                        )}
                                    </select>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="phaseDate">Select Birthday</label>
                                    <input type="date" class="form-control" id="birthday" aria-describedby="birthday" onChange={handleInputChange} value={employeeEdit.birthday}/>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="membSex">Select Sex</label>
                                    <select 
                                    id="membSex" class="form-control" value={employeeEdit.membSex} 
                                    onChange={handleInputChange} >
                                        <option selected>Choose...</option>
                                        <option value='F'>Female</option>
                                        <option value='M'>Male</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </div> 
                            </div>
                            <button type="submit" class="btn btn-primary" onClick={saveChanges}>Save Changes</button>
                        </form>
                    </Modal.Body>
                </Modal>}
            <div className="card mt-3">
                <div className="row container mx-auto mt-4 mb-3">
                    <div className="col-4 mx-auto">
                        <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" class="empAvatar"/>
                        <h3>{membDetail.membName}</h3>
                        <p><i class="fas fa-map-marked-alt"></i> Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
                    </div>
                    <div className="col-6 mx-auto">
                        <div className="d-flex list-group-item">
                            <p className="col-3"><i class="fas fa-2x fa-birthday-cake"></i></p>
                            <h5  className="col-9 text-left">10 aug 1989</h5>
                        </div>
                        <div className="d-flex list-group-item">
                            <p className="col-3"><i class="fas fa-2x fa-tint"></i></p>
                            <h5  className="col-9 text-left">O+</h5>
                        </div>
                        <div className="d-flex list-group-item">
                            <p className="col-3"><i class="fas fa-2x fa-envelope"></i></p>
                            <h5 className="col-9 text-left">something@gmail.com</h5>
                        </div>
                        <div className="d-flex list-group-item">
                            <p className="col-3"><i class="fas fa-2x fa-phone-square"></i></p>
                            <h5 className="col-9 text-left">+123456789</h5>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
export default MembProfile
