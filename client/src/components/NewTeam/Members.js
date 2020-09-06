import React, {useState, useContext, useEffect, useRef } from 'react';
import {Modal, Button} from 'react-bootstrap'
import { UserContext } from '../TeamPage/TeamPage';
import { Link, useParams } from "react-router-dom";

const userId = localStorage.id

function Members() {
    const { teamId } = useParams();
    // const { teamRoles } = useContext(UserContext);
    const [lgShow, setLgShow] = useState(false);
    const [ newMember, setNewMember ] = useState({ membName: "", membEmail: "", membRole: "", membSex: "",membPassword: "", teamId: `${teamId}`});
    const [teamRoles, setTeamRoles] = useState([])
    // const [teamDetail, setTeamDetail]= useState( []);
    // const [roles, setRoles] = useState([]);
    const [member, setMember] = useState([]);
    const [ searchInput, setSearchInput] = useState("");  
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );

    const inputEmail = useRef();  
    const inputPassword = useRef();

    // const {teamDetail} = useContext(UserContext);
    function handleInputChange( e ){
        const { id, value } = e.target; 
        setNewMember( { ...newMember, [id]: value } );
        }
    function handleSearchInputChange(e){
        const newInput2 = e.target.value;
        const newInput = newInput2.toLowerCase();

        setSearchInput(newInput);
        if( newInput.length >0){
            const newList = member.filter(mem=> 
                mem.name.toLowerCase().indexOf(newInput)==0)
            setMember( newList);
        }   
        else {
            loadMember()
            setMember( member );
        }
    }
    async function submitMember(e){
        e.preventDefault();
        console.log('newMember', newMember);
        if (newMember.membEmail == ''){
            inputEmail.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide the members Email!' } );
            return;
        }
        if ( newMember.membPassword === "" || newMember.membPassword.length < 8 ){
            inputPassword.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide the members password!' } );
            return;
        }
        const apiResult = await fetch('/api/postMember', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMember)
            }).then( result=>result.json());
        // console.log(apiResult.message)
        setNewMember({ membName: "", membEmail: "", membRole: "", membSex: "", teamId: `${teamId}`})
        setLgShow(false);
        loadMember()
    }
    async function loadMember(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMember(fetchMembers)
    }
    
    async function loadTeamRoles(){
        const fetchRoles = await fetch (`/api/allRoles/${teamId}`).then( res => res.json());
        console.log('fetched roles are: ', fetchRoles.teamRoles)
        setTeamRoles(fetchRoles.teamRoles)
    }

    async function deleteMember(membId){
        // console.log('member id : ', employeeId)
        const apiDeleteMember= await fetch(`/api/deleteMember/${membId}`);
        loadMember()
    }
    useEffect(function(){
        
        loadMember()
        loadTeamRoles()
        // console.log('teamDetail: ', teamDetail)
    },[])

    return (
        <div>
            <h3 class="myHeader" >Team Members</h3>
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
                                <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">{alertMessage.message}</div>
                                    <label for="membName">Member Name</label>
                                    <input type="text" class="form-control" 
                                    id="membName" aria-describedby="taskHelp" onChange={handleInputChange} 
                                    value={newMember.membName}/>
                                    <div class="form-group">
                                        <label for="membEmail">Provide Members Email</label>
                                        <input
                                        value={newMember.membEmail} 
                                        onChange={handleInputChange} 
                                        ref={inputPassword}
                                        id="membEmail"
                                        ref={inputEmail} 
                                        type="email" class="form-control" placeholder="Member Email"/>
                                    </div>
                                    <div class="form-group">
                                        <label for="membPassword">Provide Members Temporary Password</label>
                                        <input
                                        value={newMember.membPassword} 
                                        onChange={handleInputChange} 
                                        ref={inputPassword}
                                        id="membPassword" 
                                        type="password" class="form-control" placeholder="membPassword"/>
                                    </div>
                                    <div className="row mx-aut0">
                                        <div class="col-md-4">
                                        <label for="membRole">Select Role</label>
                                        <select 
                                        id="membRole" class="form-control" value={newMember.membRole} 
                                        onChange={handleInputChange} >
                                            <option selected>Choose...</option>
                                            {teamRoles.map( role => 
                                            <option value={role.roleName}>{role.roleName}</option>
                                            )}
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                        <label for="membSex">Select Sex</label>
                                        <select 
                                        id="membSex" class="form-control" value={newMember.membSex} 
                                        onChange={handleInputChange} >
                                            <option selected>Choose...</option>
                                            <option value='F'>Female</option>
                                            <option value='M'>Male</option>
                                            <option value='Other'>Other</option>
                                        </select>
                                    </div> 
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary" onClick={submitMember}>Submit</button>
                            </form>
                        </Modal.Body>
                    </Modal> 
                </div>
            </nav>
            <div  div class="row">
                {member.length == 0 ? 
                <h4 class="mt-5 mx-auto">You have not added any team mates yet</h4>
                :
                member.map( memb => {
                    switch (memb.sex){
                        case "F":
                            return <div class="myCard mx-auto">
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-end">
                                    <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)}></i>
                                </div>
                                <div class="card-body">
                                    <img src="https://img2.pngio.com/avatar-female-person-profile-user-website-woman-icon-female-avatar-png-512_512.png" alt="" class="empAvatar"/>
                                    <h5 class="card-title myTitle">{memb.name}</h5>
                                    <p class="card-text mySubTxt">{memb.role}</p>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                        <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                                    </Link>
                                </div>
                            </div>
                        case "M":
                            return <div class="card myCard mx-auto">
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-end">
                                    <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)}></i>
                                </div>
                                <div class="card-body">
                                    <img src="https://www.epicentrofestival.com/wp-content/uploads/2020/01/epicentrofestival-avatar-avatar-5j0hepy7wd-720x811.jpg" alt="" class="empAvatar"/>
                                    <h5 class="card-title myTitle">{memb.name}</h5>
                                    <p class="card-text mySubTxt">{memb.role}</p>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                        <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                                    </Link>
                                </div>
                            </div>
                        default:   return <div class="card myCard mx-auto">
                        <div className="mb-2 mt-2 mr-2 d-flex justify-content-end">
                            <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)}></i>
                        </div>
                        <div class="card-body">
                            <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" alt="" class="empAvatar"/>
                            <h5 class="card-title myTitle">{memb.name}</h5>
                            <p class="card-text mySubTxt">{memb.role}</p>
                            <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                            </Link>
                        </div>
                    </div>;
                    }
                })}
            </div>
        </div>
    )
}

export default Members
