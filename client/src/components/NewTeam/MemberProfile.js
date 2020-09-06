import React, {useState, useContext, useEffect, useRef } from 'react';
import { Link, useParams , useLocation } from "react-router-dom";
import {Modal, Button} from 'react-bootstrap'
import { BrowserRouter as Router, Route } from "react-router-dom";
import TimeLine from './MemberTimeLine'
import About from './MemberAbout'
import TabBar from './TabBar'
export const UserContext = React.createContext();

function MemberProfile() {
    const location = useLocation();
    const { membId } = useParams();
    const { teamId } = useParams();
    const [ memberDetail, setMemberDetail ]= useState({});
    const [lgShow, setLgShow] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [ employeeEdit, setEmployeeEdit ] = useState({ name: "", email: "", membRole: "", membSex: "", membPassword: "", teamId: `${teamId}`});
    const [teamRoles, setTeamRoles] = useState([])
    const [ dropDownEmail, setDropDownEmail ] = useState( { type: ""} );
    const [ dropDownAddress, setDropDownAddress ] = useState( { type: ""} );
    const [ dropDownPhone, setDropDownPhone ] = useState( { type: ""} );
    const [ dropDownRole, setDropDownRole ] = useState( { type: ""} );

    function handleInputChange( e ){
        const { id, value } = e.target; 
        setEmployeeEdit( { ...employeeEdit, [id]: value } );
        }

    let email;
    const inputEmail = useRef();  
    const inputPassword = useRef();
    async function loadTeamRoles(){
        const fetchRoles = await fetch (`/api/allRoles/${teamId}`).then( res => res.json());
        console.log('fetched roles are: ', fetchRoles.teamRoles)
        setTeamRoles(fetchRoles.teamRoles)
    }
    async function loadMemberProfile(){
        const getEmpDetail = await fetch (`/api/memberProfile/${membId}`).then( res => res.json());
        console.log('fetched Member detail is: ', getEmpDetail)
        setMemberDetail(getEmpDetail);
        Object.keys(getEmpDetail).forEach(key => {
            if(employeeEdit.hasOwnProperty(key)){
                employeeEdit[key] = getEmpDetail[key];
                setEmployeeEdit(employeeEdit);
            }
        });
    }
    async function updateMember(){
        console.log('update member')
    }
    function showForm(typeForm){
        console.log(typeForm)
        if(typeForm === "email"){
            if(dropDownEmail.type==''){
                setDropDownEmail( { type: 'myMenu'} )
            } else {
                setDropDownEmail( { type: '' } )
            }
        }else if(typeForm === "address"){
            if(dropDownAddress.type==''){
                setDropDownAddress( { type: 'myMenu'} )
            } else {
                setDropDownAddress( { type: '' } )
            }
        }else if(typeForm === "phone"){
            if(dropDownPhone.type==''){
                setDropDownPhone( { type: 'myMenu'} )
            } else {
                setDropDownPhone( { type: '' } )
            }
        }else if(typeForm === "role"){
            if(dropDownRole.type==''){
                setDropDownRole( { type: 'myMenu'} )
            } else {
                setDropDownRole( { type: '' } )
            }
        }
    }
    
    function closeBtn(){
        setLgShow(false)
        setDropDownEmail( { type: '' } )
        setDropDownAddress( { type: '' } )
        setDropDownPhone( { type: '' } )
        setDropDownRole( { type: '' } )
    } 
    
    useEffect(function(){
        loadMemberProfile();
        loadTeamRoles()
    },[])

    return (
        <div className="container-fluid">
            <div className="row mx-auto">
                <div className="membProImg  col-4">
                    <img className="profilePhoto mx-auto" src="https://i2.wp.com/wp.laravel-news.com/wp-content/uploads/2018/03/avatar-images-spatie.png?resize=2200%2C1125" alt="memberImg"/>
                        <i class="fas fa-camera uploadIcon" ></i>
                    
                </div>
                <div className="membAbout col-8 mx-auto">
                    <h2 className="myTitle text-left"> {memberDetail.name} </h2>
                    <h5 className="mySubTxt text-left"> {memberDetail.role}</h5>
                    <div className="edit">
                        <div class="myBtnNew" onClick={() => setLgShow(true)}>Update Info</div>
                        <Modal
                        size="lg"
                        show={lgShow}
                        onHide={() => setLgShow(false)}
                        aria-labelledby="example-modal-sizes-title-lg">
                            <div className="card-body d-flex justify-content-end">
                                <i class="fas fa-2x fa-times-circle closeBtn" onClick={closeBtn}></i>
                            </div>
                            <Modal.Header >
                                <Modal.Title id="example-modal-sizes-title-lg"> 
                                Edit Member
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="card-body">
                                    <div className="email">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i class="fas fa-envelope"></i> Email:</p>
                                            <p className="col-8 text-left">{memberDetail.email}</p>
                                            <i class="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("email")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div class={ dropDownEmail.type ? `${dropDownEmail.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <input type="text" class="form-control" 
                                                    id="email" aria-describedby="taskHelp" placeholder={memberDetail.email !== "undefined" ? "email": memberDetail.email} onChange={handleInputChange} 
                                                    value={employeeEdit.email}/>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="myBtnNew text-center">cancel</div>
                                                        <div className="myBtnNew text-center">save</div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <div className="address">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i class="fas fa-map-marked-alt"></i> Address:</p>
                                            <p className="col-8 text-left">{memberDetail.address ? memberDetail.address : "address not yet provided"}</p>
                                            <i class="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("address")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div class={ dropDownAddress.type ? `${dropDownAddress.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <input type="text" class="form-control" 
                                                    id="address" aria-describedby="taskHelp" placeholder={memberDetail.address !== "undefined" ? "address": memberDetail.address} onChange={handleInputChange} 
                                                    value={employeeEdit.address}/>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="myBtnNew text-center">cancel</div>
                                                        <div className="myBtnNew text-center">save</div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <div  className="phone">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i class="fas  fa-phone-square"></i> Phone:</p>
                                            <p className="col-8 text-left">{memberDetail.phone ? memberDetail.phone : "phone number not yet provided"}</p>
                                            <i class="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("phone")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div class={ dropDownPhone.type ? `${dropDownPhone.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <input type="text" class="form-control" 
                                                    id="phone" aria-describedby="taskHelp" placeholder={memberDetail.phone !== "undefined" ? "phone": memberDetail.phone} onChange={handleInputChange} 
                                                    value={employeeEdit.phone}/>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="myBtnNew text-center">cancel</div>
                                                        <div className="myBtnNew text-center">save</div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <div className="role">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i class="fas fa-user-tag"></i> Role:</p>
                                            <p className="col-8 text-left">{memberDetail.role ? memberDetail.role : "role number not yet provided"}</p>
                                            <i class="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("role")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div class={ dropDownRole.type ? `${dropDownRole.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <label for="membRole">Select Role</label>
                                                    <select 
                                                    id="membRole" class="form-control" value={employeeEdit.membRole} 
                                                    onChange={handleInputChange} >
                                                        <option selected>Choose...</option>
                                                        {teamRoles.map( role => 
                                                        <option value={role.roleName}>{role.roleName}</option>
                                                        )}
                                                    </select>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="myBtnNew text-center">cancel</div>
                                                        <div className="myBtnNew text-center">save</div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal> 
                    </div>
                </div>
            </div>
            <div className="row mx-auto">
                <div className="col-4">
                    something
                </div>
                <div className="col-8">
                    <UserContext.Provider value ={{memberDetail}}> 
                        <Router>
                        <div className="d-flexb tabBox">
                            <TabBar teamId={teamId} membName={memberDetail.name} membId={memberDetail._id}/>
                        {/* /TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id} */}
                        {/* /TeamDetail/:teamId/TeamDashboard */}
                            
                        </div>
                        <div className="memDetail">
                            <Route exact path={["/TeamDetail/:teamId/MemberProfile/:memberName/:membId/TimeLine"]} component={TimeLine} />
                            <Route exact path={["/TeamDetail/:teamId/MemberProfile/:memberName/:membId/About"]} component={About} memberDetail={memberDetail} />
                        </div>
                        </Router>
                    </UserContext.Provider>
                </div>
            </div>
        </div>
    )
}

export default MemberProfile
