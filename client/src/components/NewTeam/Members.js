import React, {useState, useEffect, useRef } from 'react';
import {Modal, Button} from 'react-bootstrap'
import { Link, useParams } from "react-router-dom";

const userId = localStorage.id
const userType = localStorage.type
const theme = localStorage.theme;

function Members() {
    const { teamId } = useParams();
    const [lgShow, setLgShow] = useState(false);
    const [ newMember, setNewMember ] = useState({ membName: "", membEmail: "", membRole: "", membSex: "",membPassword: "", teamId: `${teamId}`});
    const [houses, setHouses] = useState([]);
    const [teamRoles, setTeamRoles] = useState([])
    const [member, setMember] = useState([]);
    const [ searchInput, setSearchInput] = useState("");  
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const inputEmail = useRef();  
    const inputPassword = useRef();


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
    async function loadHouse(){
        const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
        console.log('fetched houses are: ', fetchHouses)
        setHouses(fetchHouses)
    }
    useEffect(function(){
        loadMember()
        loadTeamRoles()
        loadHouse()
    },[])

    return (
        <div>
            <h3 >Team Members</h3>
            <hr/>
            <div class="d-flex justify-content-between">
                <form class="d-flex pl-4 col-5">
                    <input class="form-control mr-sm-2" type="search" placeholder="Search Employees" aria-label="Search"
                    onChange={handleSearchInputChange}
                    value={searchInput}
                    />
                </form>
                <div className="som">
                    {userType == 'Admin' ? <div className="myBtnNew" onClick={() => setLgShow(true)}>Add Member</div>: ""}
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
                                            <option key={`r-${role}`}  value={role.roleName}>{role.roleName}</option>
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
            </div>
            <div class="row col-12">
                {member.length == 0 ? 
                <h4 class="mt-5 mx-auto">You have not added any team mates yet</h4>
                :
                member.map( (memb, idx) => {
                    switch (memb.sex){
                        case "F": //{ theme === 'Dark' ? "myCardDark
                            return <div key={`member${idx}`}  class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                house._id == memb.house ? <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i> : ''
                                )}
                                {userType == 'Admin'? <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>: ''}
                                </div>
                                <div class="card-body">
                                    <img src={
                        memb.profileImg ? memb.profileImg : "https://img2.pngio.com/avatar-female-person-profile-user-website-woman-icon-female-avatar-png-512_512.png"
                    } alt="" class="empAvatar"/>
                                    <h5 class="card-title myTitle">{memb.name}</h5>
                                    <p class="card-text mySubTxt">{memb.role}</p>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                        <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                                    </Link>
                                </div>
                            </div>
                        case "M":
                            return <div key={`member${idx}`} class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                                <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                                {houses.map(house=>
                                    house.houseColor ? house._id == memb.house ? <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i> : '' : <i class="fas fa-2x fa-bookmark"></i>
                                    )}
                                    {userType == 'Admin'? <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>: ''}
                                </div>
                                <div class="card-body">
                                    <img src={
                        memb.profileImg ? memb.profileImg : "https://www.epicentrofestival.com/wp-content/uploads/2020/01/epicentrofestival-avatar-avatar-5j0hepy7wd-720x811.jpg"
                    } alt="" class="empAvatar"/>
                                    <h5 class="card-title myTitle">{memb.name}</h5>
                                    <p class="card-text mySubTxt">{memb.role}</p>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                        <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                                    </Link>
                                </div>
                            </div>
                        default:   return <div key={`member${idx}`} class={ theme === 'Dark' ? "myCardDark mx-auto" : "myCard mx-auto"}>
                        <div className="mb-2 mt-2 mr-2 d-flex justify-content-between">
                            {houses.map(house=>
                                house._id == memb.house ? <i class="fas fa-2x fa-bookmark" style={{color: house.houseColor}}></i> : ''
                                )}
                        {userType == 'Admin'? <i class="far fa-times-circle deleteBtn" onClick={()=>deleteMember(memb._id)} ></i>: ''}
                        </div>
                        <div class="card-body">
                            <img src={
                        memb.profileImg ? memb.profileImg : "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"
                    } alt="" class="empAvatar"/>
                            <h5 class="card-title myTitle">{memb.name}</h5>
                            <p class="card-text mySubTxt">{memb.role}</p>
                            <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                <div class="myBtnNew mx-auto" href="#" role="button">view Detail </div>
                            </Link>
                        </div>
                    </div>;
                    }
                })
                }
            </div>
        </div>
    )
}

export default Members
