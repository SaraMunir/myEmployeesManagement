import React, {useState, useContext, useEffect, useRef } from 'react';
import {Modal, Button} from 'react-bootstrap'
import { UserContext } from '../TeamPage/TeamPage';
import { Link, useParams } from "react-router-dom";

const userId = localStorage.id

function Employees() {
    const { teamId } = useParams();
    const { teamRolesDetail } = useContext(UserContext);
    const [lgShow, setLgShow] = useState(false);
    const [ myEmployee, setMyEmployee ] = useState({ membName: "", membDesc: "", membRole: "", membRoleId: "", membSex: "",membPassword: "", userId: `${userId}`, teamId: `${teamId}`});
    const [teamDetail, setTeamDetail]= useState( []);
    const [roles, setRoles] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [ searchInput, setSearchInput] = useState("");  
    const inputEmail = useRef();  
    const inputPassword = useRef();

    // const {teamDetail} = useContext(UserContext);
    function handleInputChange( e ){
        const { id, value } = e.target; 
        setMyEmployee( { ...myEmployee, [id]: value } );
        }
    function handleSearchInputChange(e){
        const newInput = e.target.value;
        setSearchInput(newInput);
        if( newInput.length >0){
            const newList = employee.filter(employee=> employee.membName.indexOf(newInput)==0)
            setEmployee( newList);
        }   
        else {
            loadEmployees()
            // setEmployee(employee );
        }
    }
    async function submitEmployee(e){
        // e.preventDefault();
        console.log("Role List", teamRolesDetail);
        console.log('myEmployee', myEmployee);
        const apiResult = await fetch('/api/employees', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myEmployee)
            }).then( result=>result.json());
        // console.log(apiResult.message)
        setMyEmployee({ membName: "", membDesc: "", membRole: "", membSex: "", userId: `${userId}`, teamId: `${teamId}`})
        setLgShow(false);
        loadEmployees()
    }
    async function loadEmployees(){
        const fetchEmployees = await fetch (`/api/employees/${userId}/${teamId}`).then( res => res.json());
        // console.log('fetched roles are: ', fetchEmployees)
        setEmployee(fetchEmployees)
    }
    async function deleteEmploye(employeeId){
        // console.log('employee id : ', employeeId)
        const apiDeleteRole= await fetch(`/api/deleteEmployee/${userId}/${teamId}/${employeeId}`);
        loadEmployees()
    }
    useEffect(function(){
        loadEmployees()
        // console.log('teamDetail: ', teamDetail)
    },[])
    return (
        <div>
            <nav class="mt-2 navbar navbar-light bg-light">
                <form class="form-inline">
                    <input class="form-control mr-sm-2" type="search" placeholder="Search Employees" aria-label="Search"
                    onChange={handleSearchInputChange}
                    value={searchInput}
                    />
                    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
                <div className="som">
                    <Button onClick={() => setLgShow(true)}>Add Member</Button>
                    <Modal
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
                                    <label for="membName">Add Member</label>
                                    <input type="text" class="form-control" 
                                    id="membName" aria-describedby="taskHelp" onChange={handleInputChange} 
                                    value={myEmployee.membName}/>
                                    <label for="membDesc">Example textarea</label>
                                    <textarea class="form-control" id="membDesc" rows="3" value={myEmployee.membDesc} onChange={handleInputChange}></textarea>
                                    <div class="form-group">
                                        <label for="membPassword">Password</label>
                                        <input
                                        value={myEmployee.membPassword} 
                                        onChange={handleInputChange} 
                                        ref={inputPassword}
                                        id="membPassword" 
                                        type="membPassword" class="form-control" placeholder="membPassword"/>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="membRole">Select Role</label>
                                        <select 
                                        id="membRole" class="form-control" value={myEmployee.membRole} 
                                        onChange={handleInputChange} >
                                            <option selected>Choose...</option>
                                            {teamRolesDetail.map( role => 
                                            <option value={role.roleName}>{role.roleName}</option>
                                            )}
                                        </select>
                                    </div>
                                    <div class="form-group col-md-4">
                                        <label for="membSex">Select Sex</label>
                                        <select 
                                        id="membSex" class="form-control" value={myEmployee.membSex} 
                                        onChange={handleInputChange} >
                                            <option selected>Choose...</option>
                                            <option value='F'>Female</option>
                                            <option value='M'>Male</option>
                                            <option value='Other'>Other</option>
                                        </select>
                                    </div> 
                                </div>
                                <button type="submit" class="btn btn-primary" onClick={submitEmployee}>Submit</button>
                            </form>
                        </Modal.Body>
                    </Modal> 
                </div>
            </nav>
            {/* <h1>{teamDetail.teamName}</h1> */}
            <div  div class="row">
                {employee.length == 0 ? 
                <h4 class="mt-5 mx-auto">You have not added any team mates yet</h4>
                :
                employee.map( memb => {
                    switch (memb.membSex){
                        case "F":
                            return <div class="card myCard mx-auto">
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-end">
                                    <i class="far fa-times-circle" onClick={()=>deleteEmploye(memb._id)}></i>
                                </div>
                                <div class="card-body">
                                    <img src="https://www.w3schools.com/howto/img_avatar2.png" alt="" class="empAvatar"/>
                                    <h5 class="card-title">{memb.membName}</h5>
                                    {/* <p class="card-text">{memb.membDesc}</p> */}
                                    <p class="card-text">{memb.membRole}</p>

                                    {/* /api/TeamDetail/:teamId/:userId */}

                                    {/* <Link to={`/TeamPage/MembProfile/${teamId}/`+memb._id} > */}
                                    <Link to={`/TeamPage/${teamId}/${memb._id}/${memb.membName}`} >
                                        <div class="btn myBtn" href="#" role="button">view Detail </div>
                                    </Link>
                                </div>
                            </div>
                        case "M":
                            return <div class="card myCard mx-auto">
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-end">
                                    <i class="far fa-times-circle" onClick={()=>deleteEmploye(memb._id)}></i>
                                </div>
                                <div class="card-body">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-EdmT6pfXNT_HO-f842hBiYEzHCwGGLsrEnkm-zqw74FoOb4&s" alt="" class="empAvatar"/>
                                    <h5 class="card-title">{memb.membName}</h5>
                                    {/* <p class="card-text">{memb.membDesc}</p> */}
                                    <p class="card-text">{memb.membRole}</p>
                                    <Link to={`/TeamPage/${teamId}/${memb._id}/${memb.membName}`} >
                                <div class="btn myBtn" href="#" role="button">view Detail </div>
                            </Link>
                                </div>
                            </div>
                        default:   return <div class="card myCard mx-auto">
                        <div className="mb-2 mt-2 mr-2 d-flex justify-content-end">
                            <i class="far fa-times-circle" onClick={()=>deleteEmploye(memb._id)}></i>
                        </div>
                        <div class="card-body">
                            <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" alt="" class="empAvatar"/>
                            <h5 class="card-title">{memb.membName}</h5>
                            <p class="card-text">{memb.membRole}</p>
                            <Link to={`/TeamPage/${teamId}/${memb._id}/${memb.membName}`} >
                                <div class="btn myBtn" href="#" role="button">view Detail </div>
                            </Link>
                        </div>
                    </div>;
                    }
                })}
            </div>
        </div>
    )
}

export default Employees
