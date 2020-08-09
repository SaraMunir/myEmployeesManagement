import React, {useState, useContext, useEffect} from 'react';
import {Modal, Button} from 'react-bootstrap'
import { UserContext } from '../TeamPage/TeamPage';
import { useParams } from "react-router-dom";

const userId = localStorage.id

function Employees() {
    const { teamId } = useParams();
    const [lgShow, setLgShow] = useState(false);
    const [ myEmployee, setMyEmployee ] = useState({ membName: "", membDesc: "", membRole: "", userId: `${userId}`, teamId: `${teamId}`});
    const [teamDetail, setTeamDetail]= useState( []);
    const [roles, setRoles] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [ searchInput, setSearchInput] = useState("");



    
    // const {teamDetail} = useContext(UserContext);

    function handleInputChange( e ){
        const { id, value } = e.target; 
        setMyEmployee( { ...myEmployee, [id]: value } );
    }

    function handleSearchInputChange(e){
        const newInput = e.target.value;
        setSearchInput(newInput);
        // adjusting our employee list
        // console.log('employeeList: ', employeeList)
        // const newList = employeeList.filter( employee=>employee.indexOf(newInput)==0 )
        // setShowList( newList);
        // console.log(showList);
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
        e.preventDefault();
        console.log('myEmployee', myEmployee);
        const apiResult = await fetch('/api/employees', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(myEmployee)
            }).then( result=>result.json());
            console.log(apiResult.message)
            setMyEmployee({ membName: "", membDesc: "", membRole: "", userId: `${userId}`, teamId: `${teamId}`})
            setLgShow(false);
            loadEmployees()

    }

    async function loadEmployees(){
        const fetchEmployees = await fetch (`/api/employees/${userId}/${teamId}`).then( res => res.json());
        console.log('fetched roles are: ', fetchEmployees)
        setEmployee(fetchEmployees)
    }
    async function deleteEmploye(employeeId){
        console.log('employee id : ', employeeId)
        const apiDeleteRole= await fetch(`/api/deleteEmployee/${userId}/${teamId}/${employeeId}`);
        loadEmployees()
    }
    async function loadTeamProfile(){
        const getTeamDetail= await fetch(`/api/TeamDetail/${teamId}/${userId}`).then(result=>result.json());
        console.log('getTeamDetail: ', getTeamDetail)
        console.log('role: ', getTeamDetail.teamRoles)
        setTeamDetail( getTeamDetail );
        setRoles( getTeamDetail.teamRoles );
    }
    useEffect(function(){
        loadTeamProfile()
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
                                <div class="form-group col-md-4">
                                    <label for="inputState">State</label>
                                    <select 
                                    id="membRole" class="form-control" value={myEmployee.membRole} onChange={handleInputChange} >
                                        <option selected>Choose...</option>
                                        {roles.map( role => 
                                        <option value={role.roleName}>{role.roleName}</option>
                                        )}
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
                { employee.length == 0 ? 
                <h4 class="mt-5 mx-auto">You have not added any team mates yet</h4>
                :
                employee.map( employee => 
                    <div class="card myCard mx-auto">
                        <div className="mb-2 mt-2 mr-2 d-flex justify-content-end">
                            <i class="far fa-times-circle" onClick={()=>deleteEmploye(employee._id)}></i>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">{employee.membName}</h5>
                            <p class="card-text">{employee.membDesc}</p>
                            <p class="card-text">{employee.membRole}</p>
                        </div>
                    </div>
                    )
            }
            </div>

        </div>
    )
}

export default Employees
