import React, {useState, useContext, useEffect, useRef } from 'react';
import { Link, useParams , useLocation } from "react-router-dom";
import {Modal, Button} from 'react-bootstrap'
import { BrowserRouter as Router, Route } from "react-router-dom";
import TimeLine from './MemberTimeLine'
import About from './MemberAbout'
import TabBar from './TabBar'
export const UserContext = React.createContext();
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function MemberProfile() {
    const location = useLocation();
    const { membId } = useParams();
    const { teamId } = useParams();
    const [ memberDetail, setMemberDetail ]= useState({});
    const [lgShow, setLgShow] = useState(false);
    const [lgShow2, setLgShow2] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [ employeeEdit, setEmployeeEdit ] = useState({ name: "", email: "", role: "", birthday: "", phone: "",  membPassword: "", teamId: `${teamId}`});
    const [ teamRoles, setTeamRoles] = useState([])
    const [ dropDownEmail, setDropDownEmail ] = useState( { type: ""} );
    const [ dropDownAddress, setDropDownAddress ] = useState( { type: ""} );
    const [ dropDownPhone, setDropDownPhone ] = useState( { type: ""} );
    const [ dropDownRole, setDropDownRole ] = useState( { type: ""} );
    const [ dropDownBio, setDropDownBio ] = useState( { type: ""} );
    const [ dropDownBirthday, setDropDownBirthday ] = useState( { type: ""} );
    const [ dropDownUpload, setDropDownUpload ] = useState( { type: ""} );
    const [ trial, setTrial ] = useState({})
    const [ myPic, setMyPic] = useState ( '' );
    const [ showForm2, setShowForm2] = useState( false )
    function handleInputChange( e ){
        const { id, value } = e.target; 
        setEmployeeEdit( { ...employeeEdit, [id]: value } );
        setTrial ({ [id]: value })
        }
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
        console.log('update member', trial)
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
        } else if(typeForm === "phoneNumber"){
            if(dropDownPhone.type==''){
                setDropDownPhone( { type: 'myMenu'} )
            } else {
                setDropDownPhone( { type: '' } )
            }
        } else if(typeForm === "role"){
            if(dropDownRole.type==''){
                setDropDownRole( { type: 'myMenu'} )
            } else {
                setDropDownRole( { type: '' } )
            }
        } else if(typeForm === "bio"){
            if(dropDownBio.type==''){
                setDropDownBio( { type: 'myMenu'} )
            } else {
                setDropDownBio( { type: '' } )
            }
        } else if(typeForm === "birthday"){
            if(dropDownBirthday.type==''){
                setDropDownBirthday( { type: 'myMenu'} )
            } else {
                setDropDownBirthday( { type: '' } )
            }
        }
    }
    async function updateMembDetail(){
        // console.log('employeeEdit: ',employeeEdit)
        console.log('trial: ',trial)
        console.log('trial.id: ',trial.id)
        // e.preventDefault();
        const apiResult = await fetch(`/api/memberDetailUpdate/${membId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trial)
            }).then( result => result.json());
        setTrial({});
        loadMemberProfile();
        let key = Object.keys(trial)[0];
        closeEditBtns(key)
        
    }
//   upload
    function handleChange(e){
        const file = e.target.files[0];
        setMyPic(file)
    }
    function uploadPic( e ){
        e.preventDefault();
        setShowForm2(false);
    } 

    async function handleUpload(e){
        e.preventDefault();
        uploadPic(e);
        if(myPic){
            let myForm = document.getElementById('myForm');
            let formData = new FormData(myForm);
            const uploadPic = await fetch(`/api/upload/${membId}`, 
                {
                    method: 'PUT',
                    body: formData
                }
            ).then( result=>result.json())
        }
        if(memberDetail.profileImg){
            let oldPhoto = {old: memberDetail.profileImg};
            //delet old photo
            const deleteOldPIc = await fetch(`/api/deleteOldProfilePIc`, 
            {   method: 'post',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
                body: JSON.stringify(oldPhoto)
            }).then( result=>result.json());
            }
            setLgShow2(false)
            loadMemberProfile();
        
    }
    // Birthday
    function closeBtn(){
        setLgShow(false)
        
    }     
    function closeEditBtns(key){
        if (key==='email'){
            console.log(key);
            setDropDownEmail( { type: '' } )
        }
        if (key==='address'){
            console.log(key);
            setDropDownAddress( { type: '' } )
        }
        if (key==='phoneNumber'){
            setDropDownPhone( { type: '' } )
        }
        if (key==='role'){
            setDropDownRole( { type: '' } )
        }
        if (key==='birthday'){
            setDropDownBirthday( { type: '' } )
        }
        if (key==='bio'){
            setDropDownBio( { type: '' } )
        }
    }     
    useEffect(function(){
        loadMemberProfile();
        loadTeamRoles()
    },[])
    return (
        <div className="container-fluid">
            <div className="row mx-auto">
                <div className="membProImg col-lg-4">
                    <img className="profilePhoto mx-auto" src={
                        memberDetail.profileImg ? memberDetail.profileImg : "https://i2.wp.com/wp.laravel-news.com/wp-content/uploads/2018/03/avatar-images-spatie.png?resize=2200%2C1125"
                    } alt="memberImg"/>
                    <i class="fas fa-camera uploadIcon"  onClick={() => setLgShow2(true)}></i>
                    <Modal
                        size="lg"
                        show={lgShow2}
                        onHide={() => setLgShow2(false)}
                        aria-labelledby="example-modal-sizes-title-lg">
                            <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-lg"> 
                                Upload Image
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form class="input-group mb-3" id='myForm' role="form" encType="multipart/form-data" >
                                    <div class="custom-file">
                                        <input 
                                        type="file" 
                                        name="myFile" class="custom-file-input" 
                                        onChange={handleChange}/>
                                        <label class="custom-file-label" for="inputGroupFile02" onChange={handleChange}>Choose file</label>
                                    </div>
                                </form>
                                <div class="myBtnNew" onClick={handleUpload}>Upload</div> 
                            </Modal.Body>
                    </Modal>
                </div>
                <div className="membAbout col-lg-8 mx-auto">
                    <h2 className="myTitle text-left"> {memberDetail.name} </h2>
                    <h5 className="mySubTxt text-left"> {memberDetail.role}</h5>
                    <p className="text-left"> {memberDetail.bio ? memberDetail.bio : 'Bio has yet not been added yet..'}</p>
                    <div className="edit">
                        <div class="myBtnNew" onClick={() => setLgShow(true)}> <i class="fas fa-user-edit"></i> Update Info</div>
                        <Modal
                        size="lg"
                        show={lgShow}
                        onHide={() => setLgShow(false)}
                        aria-labelledby="example-modal-sizes-title-lg">
                            <div className="card-body d-flex justify-content-end">
                                <i class="fas fa-2x fa-times-circle closeBtn" onClick={closeBtn}></i>
                            </div>
                                <h3 className="text-center">Edit Member</h3>
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
                                                        <div className="myBtnNew text-center" onClick={()=>setDropDownEmail( { type: '' } )}>cancel</div>
                                                        <div className="myBtnNew text-center" onClick={updateMembDetail}>save</div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <hr/>
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
                                                        <div className="myBtnNew text-center" onClick={()=>setDropDownAddress( { type: '' })}>cancel</div>
                                                        <div className="myBtnNew text-center" onClick={updateMembDetail}>save</div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <hr/>
                                    <div  className="phoneNumber">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i class="fas  fa-phone-square"></i> Phone:</p>
                                            <p className="col-8 text-left">{memberDetail.phoneNumber ? memberDetail.phoneNumber : "phone number not yet provided"}</p>
                                            <i class="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("phoneNumber")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div class={ dropDownPhone.type ? `${dropDownPhone.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <input type="text" class="form-control" 
                                                    id="phoneNumber" aria-describedby="taskHelp" placeholder={memberDetail.phoneNumber !== "undefined" ? "phoneNumber": memberDetail.phoneNumber} onChange={handleInputChange} 
                                                    value={employeeEdit.phoneNumber}/>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="myBtnNew text-center"  onClick={()=>setDropDownPhone( { type: '' } )}>cancel</div>
                                                        <div className="myBtnNew text-center" onClick={updateMembDetail}>save</div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="role">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i class="fas fa-user-tag"></i> Role:</p>
                                            <p className="col-8 text-left">{memberDetail.role ? memberDetail.role : "role number not yet provided"}</p>
                                            <i class="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("role")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div class={ dropDownRole.type ? `${dropDownRole.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <label for="role">Select Role</label>
                                                    <select 
                                                    id="role" class="form-control" value={employeeEdit.role} 
                                                    onChange={handleInputChange} >
                                                        <option selected>Choose...</option>
                                                        {teamRoles.map( role => 
                                                        <option value={role.roleName}>{role.roleName}</option>
                                                        )}
                                                    </select>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="myBtnNew text-center" onClick={()=>setDropDownRole( { type: '' })}>cancel</div>
                                                        <div className="myBtnNew text-center" onClick={updateMembDetail}>save</div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="bio">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i class="far fa-address-card"></i> Bio:</p>
                                            <p className="col-8 text-left">{memberDetail.bio ? memberDetail.bio : "bio not yet provided"}</p>
                                            <i class="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("bio")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div class={ dropDownBio.type ? `${dropDownBio.type} col-12` : 'hide' }>
                                            <div className="form-group">
                                                <input type="text" class="form-control" 
                                                id="bio" aria-describedby="taskHelp" placeholder={memberDetail.bio !== "undefined" ? "bio": memberDetail.bio} onChange={handleInputChange} 
                                                value={employeeEdit.bio}/>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="myBtnNew text-center" onClick={()=>setDropDownBio( { type: '' })}>cancel</div>
                                                        <div className="myBtnNew text-center" onClick={updateMembDetail}>save</div>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <hr/>

                                    <div className="birthday">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i class="fas fa-birthday-cake"></i> Birthday:</p>
                                            <p className="col-8 text-left">{memberDetail.birthday ? memberDetail.birthday : "birthday not yet provided"}</p>
                                            <i class="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("birthday")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div class={ dropDownBirthday.type ? `${dropDownBirthday.type} col-12` : 'hide' }>
                                                <div class="form-group col-md-6">
                                                    <label for="phaseDate">Select Birthday</label>
                                                    <input type="date" class="form-control" id="birthday" aria-describedby="birthday" onChange={handleInputChange} value={employeeEdit.birthday}/>
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                    <div className="myBtnNew text-center" onClick={()=>setDropDownBirthday( { type: '' })}>cancel</div>
                                                    <div className="myBtnNew text-center"  onClick={updateMembDetail}>save</div>
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
                <div className="col-12">
                    <UserContext.Provider value ={{memberDetail}}> 
                        <Router>
                        <div className="d-flexb tabBox">
                            <TabBar teamId={teamId} membName={memberDetail.name} membId={memberDetail._id}/>
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
