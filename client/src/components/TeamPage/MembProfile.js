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
    const [ employeeEdit, setEmployeeEdit ] = useState({ membName:"", membDesc:"", membRole:"", membRoleId:"", status:"", birthday:"", email:"", phoneNumber:"", address:"", membSex: "",membPassword: "", userId: `${userId}`, teamId: `${teamId}`});

    async function loadEmpProfile(){
        console.log("teamRolesDetail", teamRolesDetail)
        // console.log('membId: ', membId)
        const getEmpDetail= await fetch(`/api/employeeDetail/${userId}/${teamId}/${membId}`).then(result=>result.json());
        // console.log(getEmpDetail)
        setMembDetail(getEmpDetail);
        Object.keys(getEmpDetail).forEach(key => {
            if(employeeEdit.hasOwnProperty(key)){
                employeeEdit[key] = getEmpDetail[key];
                setEmployeeEdit(employeeEdit);
            }
        });
    }

    function handleInputChange( e ){
        const { id, value } = e.target; 
        setEmployeeEdit( { ...employeeEdit, [id]: value } );
    }

    async function saveChanges(e){
        e.preventDefault();
        const apiResult = await fetch(`/api/employeeDetail/${userId}/${teamId}/${membId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeEdit)
            }).then( result => result.json());
        // console.log("apiResult:", apiResult.userEmployee)
        setMembDetail(apiResult.userEmployee)
        setLgShow(false);
    }

    const imgTag = function imageStuff () {
        switch (membDetail.membSex){
            case "F": return <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="employee_avatar" />
            case "M": return <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-EdmT6pfXNT_HO-f842hBiYEzHCwGGLsrEnkm-zqw74FoOb4&s" alt="employee_avatar" />
            default: return <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" alt="employee_avatar" />
        }
    }
    useEffect( function(){
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
                                    value={employeeEdit.membName}/>
                                </div>
                                <div className="form-group">
                                    <label for="membName">Address</label>
                                    <input type="text" class="form-control" 
                                    id="address" aria-describedby="taskHelp" placeholder={membDetail.address !== "undefined" ? membDetail.address: "address"} onChange={handleInputChange} 
                                    value={employeeEdit.address}/>
                                </div>
                                <div className="form-group">
                                    <label for="membName">Email Address</label>
                                    <input type="text" class="form-control" 
                                    id="email" aria-describedby="taskHelp" placeholder={membDetail.email !== "undefined" ? "email": membDetail.email} onChange={handleInputChange} 
                                    value={employeeEdit.email}/>
                                </div>
                                <div className="form-group">
                                    <label for="membName">Phone Number</label>
                                    <input type="text" class="form-control" 
                                    id="phoneNumber" aria-describedby="taskHelp" placeholder={membDetail.phoneNumber === "undefined" ? "phone number": membDetail.phoneNumber} onChange={handleInputChange} 
                                    value={employeeEdit.phoneNumber}/>
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
                                <div class="form-group col-md-6">
                                    <label for="status">Select Status</label>
                                    <select 
                                    id="status" class="form-control" value={employeeEdit.status} 
                                    onChange={handleInputChange} >
                                        <option selected>Choose...</option>
                                        <option value='Internship'>Internship</option>
                                        <option value='Full-time'>Full-time</option>
                                        <option value='Part-time'>Part-time</option>
                                    </select>
                                </div> 
                            </div>
                            <button type="submit" class="btn btn-primary" onClick={saveChanges}>Save Changes</button>
                        </form>
                    </Modal.Body>
                </Modal>}
            <div className="card mt-3">
                <div className="row container mx-auto mt-4 mb-3">
                    <div className="col-4 mx-auto" >
                        {imgTag()}
                        <h3>{membDetail.membName}</h3>
                        <p><i class="fas fa-map-marked-alt"></i>{membDetail.membDesc ? membDetail.membDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "}</p>
                    </div>
                    <div className="col-6 mx-auto">
                        <div className="d-flex list-group-item">
                            <p className="col-3"><i class="fas fa-2x fa-user-tag"></i></p>
                            <h5  className="col-9 text-left">{membDetail.status == "undefined" ? "Add status" : membDetail.status}</h5>
                        </div>
                        <div className="d-flex list-group-item">
                            <p className="col-3"><i class="fas fa-2x fa-birthday-cake"></i></p>
                            <h5  className="col-9 text-left">{membDetail.birthday == "undefined" ? "Add birthday" : membDetail.birthday}</h5>
                        </div>
                        <div className="d-flex list-group-item">
                            <p className="col-3"><i class="fas fa-2x fa-envelope"></i></p>
                            <h5 className="col-9 text-left">{membDetail.email == "undefined" ? "Add email" : membDetail.email}</h5>
                        </div>
                        <div className="d-flex list-group-item">
                            <p className="col-3"><i class="fas fa-2x fa-search-location"></i></p>
                            <h5 className="col-9 text-left">{membDetail.address == "undefined" ? "Add address" : membDetail.address}</h5>
                        </div>
                        <div className="d-flex list-group-item">
                            <p className="col-3"><i class="fas fa-2x fa-phone-square"></i></p>
                            <h5 className="col-9 text-left">{membDetail.phoneNumber == "undefined" ? "Add phone number" : membDetail.phoneNumber}</h5>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
export default MembProfile
