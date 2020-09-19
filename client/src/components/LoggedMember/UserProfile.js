import React, {useState, useEffect, useRef } from 'react';
import {  useParams, Link , useLocation, Redirect } from "react-router-dom";
import {Modal} from 'react-bootstrap'
import { BrowserRouter as Router, Route } from "react-router-dom";
import TimeLine from './UserTimeLine'
import About from './UserAbout'
import FriendList from './UserFriendList'
import Wall from './UserWall'
import TabBar from './TabBar'
export const UserContext = React.createContext();
const userId = localStorage.id
const userType = localStorage.type
const theme = localStorage.theme;
const teamId = localStorage.teamId;

function MemberProfile() {
    const [ memberDetail, setMemberDetail ]= useState({});
    const [ frndReq, setFrndReq ]= useState('');
    const [lgShow, setLgShow] = useState(false);
    const [lgShow2, setLgShow2] = useState(false);
    const [cvrFrmShow, setCvrFrmShow] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [ employeeEdit, setEmployeeEdit ] = useState({ name: "", email: "", role: "", house: "", birthday: "", phone: "",  membPassword: "", teamId: `${teamId}`});
    const [ passwordUpdate, setPasswordUpdate ] = useState({password: ""})
    const [ houses, setHouses] = useState([]);
    const [ dropDownAddress, setDropDownAddress ] = useState( { type: ""} );
    const [ dropDownPhone, setDropDownPhone ] = useState( { type: ""} );
    const [ dropDownBio, setDropDownBio ] = useState( { type: ""} );
    const [ dropDownBirthday, setDropDownBirthday ] = useState( { type: ""} );
    const [ dropDownPassword, setDropDownPassword ] = useState( { type: ""} );
    const [ trial, setTrial ] = useState({})
    const [ myPic, setMyPic] = useState ('');
    const [ myCoverPIc, setMyCoverPIc] = useState ('');
    const [ showForm2, setShowForm2] = useState( false );
    const inputEmail = useRef();  
    const inputPassword = useRef();

    function handleInputChange( e ){
        const { id, value } = e.target; 
        setEmployeeEdit( { ...employeeEdit, [id]: value } );
        setTrial({ [id]: value })
    }
    function handlePasswordChange(e){
        const { id, value } = e.target; 
        setPasswordUpdate( {[id]: value } );
    }
    async function loadMemberProfile(){
        const getEmpDetail = await fetch (`/api/memberProfile/${userId}`).then( res => res.json());
        console.log('fetched Member detail is: ', getEmpDetail)
        console.log('fetched request number is: ', getEmpDetail.friendRequests.length)
        setFrndReq(getEmpDetail.friendRequests.length)
        setMemberDetail(getEmpDetail);
    }
    function showForm(typeForm){
        console.log(typeForm)
        if(typeForm === "address"){
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
        } else if(typeForm === "membPassword"){
            if(dropDownPassword.type==''){
                setDropDownPassword( { type: 'myMenu'} )
            } else {
                setDropDownPassword( { type: '' } )
            }
        }
    }
    async function updatePassword(){
        if( passwordUpdate.membPassword === "") {
            inputPassword.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your password!' } );
            return;
        }
        if( passwordUpdate.membPassword.length < 8 ) {
            inputPassword.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide a password that is atleast 8 characters' } );
            return;
        }
        const apiResult = await fetch(`/api/memberPasswordUpdate/${userId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordUpdate)
            }).then( result => result.json());
        setPasswordUpdate({})
        loadMemberProfile();
        let key = Object.keys(passwordUpdate)[0];
        closeEditBtns(key)
    }
    async function loadHouse(){
        const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
        console.log('fetched houses are: ', fetchHouses)
        setHouses(fetchHouses);
    }
    async function updateMembDetail(){
        console.log('trial: ',trial) 
        console.log('trial.id: ',trial.id)
        const apiResult = await fetch(`/api/memberDetailUpdate/${userId}`, 
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
    function handleCvrPicChange(e){
        const file = e.target.files[0];
        setMyCoverPIc(file)
    }
    function uploadCoverPic( e ){
        e.preventDefault();
        setMyCoverPIc (false);
    }
    function uploadPic( e ){
        e.preventDefault();
        setShowForm2(false);
    }
    async function handleCvrPhtUpload(e){
        e.preventDefault();
        uploadCoverPic(e);
        if(myCoverPIc){
            let myForm = document.getElementById('myCvrForm');
            let formData = new FormData(myForm);
            const uploadPic = await fetch(`/api/uploadCvrPhto/${userId}`, 
                {
                    method: 'PUT',
                    body: formData
                }
            ).then( result=>result.json())}
        if(memberDetail.coverImg){
            let oldPhoto = {old: memberDetail.coverImg};
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
            setCvrFrmShow(false)
            loadMemberProfile();
    }
    async function handleUpload(e){
        e.preventDefault();
        uploadPic(e);
        if(myPic){
            let myForm = document.getElementById('myForm');
            let formData = new FormData(myForm);
            const uploadPic = await fetch(`/api/upload/${userId}`, 
                {
                    method: 'PUT',
                    body: formData
                }
            ).then( result=>result.json())}
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
        if (key==='address'){
            console.log(key);
            setDropDownAddress( { type: '' } )
        }
        if (key==='phoneNumber'){
            setDropDownPhone( { type: '' } )
        }
        if (key==='birthday'){
            setDropDownBirthday( { type: '' } )
        }
        if (key==='bio'){
            setDropDownBio( { type: '' } )
        }
        if (key==='membPassword'){
            setDropDownPassword( { type: '' } )
        }
    }     
    useEffect(function(){
        loadMemberProfile();
        loadHouse()
    },[])
    return (
        <div>
            { userId ? '': <Redirect to='/HomePage' />  }
            <div className="covCntnr">
                <img className='CovImg' src={
                        memberDetail.coverImg ? memberDetail.coverImg : "https://www.befunky.com/images/wp/wp-2016-03-blur-background-featured-1.jpg?auto=webp&format=jpg&width=880"
                    } alt="coverPhoto"/>
                {userType == 'Member' &&  userId == memberDetail._id ? <div  onClick={() => setCvrFrmShow(true)} className="covrBtn myBtnNew2" style={{width: '60px', fontSize:"1.4rem"}}> <i class="fas fa-camera-retro"></i></div>: ''}
                
                {/* cvrFrmShow, setCvrFrmShow */}
                <Modal
                    size="lg"
                    show={cvrFrmShow}
                    onHide={() => setCvrFrmShow(false)}
                    aria-labelledby="example-modal-sizes-title-lg">
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-lg"> 
                            Upload Image
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form className="input-group mb-3" id='myCvrForm' role="form" encType="multipart/form-data" >
                                <div className="custom-file">
                                    <input 
                                    type="file" 
                                    name="myFile" className="custom-file-input" 
                                    onChange={handleCvrPicChange}/>
                                    <label className="custom-file-label" for="inputGroupFile02" onChange={handleCvrPicChange}>Choose file</label>
                                </div>
                            </form>
                            <div className="myBtnNew" onClick={handleCvrPhtUpload}>Upload</div> 
                        </Modal.Body>
                </Modal>
            </div>
            <div className="row mx-auto membIntro">
                <div className="adminProImg">
                    <img className="profilePhoto mx-auto" src={
                        memberDetail.profileImg ? memberDetail.profileImg : "https://i2.wp.com/wp.laravel-news.com/wp-content/uploads/2018/03/avatar-images-spatie.png?resize=2200%2C1125"
                    } alt="memberImg"/>
                    {userType == 'Admin' ? <i className="fas fa-camera uploadIcon"  onClick={() => setLgShow2(true)}></i>: ''}
                    {userType == 'Member' &&  userId == memberDetail._id ? <i className="fas fa-camera uploadIcon"  onClick={() => setLgShow2(true)}></i>: ''}
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
                                <form className="input-group mb-3" id='myForm' role="form" encType="multipart/form-data" >
                                    <div className="custom-file">
                                        <input 
                                        type="file" 
                                        name="myFile" className="custom-file-input" 
                                        onChange={handleChange}/>
                                        <label className="custom-file-label" for="inputGroupFile02" onChange={handleChange}>Choose file</label>
                                    </div>
                                </form>
                                <div className="myBtnNew" onClick={handleUpload}>Upload</div> 
                            </Modal.Body>
                    </Modal>
                </div>
                <div className="membAbout col-lg-8 mx-auto">
                    <h2 className="myTitle text-left"> {memberDetail.name} </h2>
                    <h5 className="mySubTxt text-left"> {memberDetail.role}</h5>
                    <p className="text-left"> {memberDetail.bio ? memberDetail.bio : 'Bio has yet not been added yet..'}</p>
                    <div className="edit">
                    {userType == 'Admin' ? <div className="myBtnNew" onClick={() => setLgShow(true)}> <i className="fas fa-user-edit"></i> Update Info</div>: ''}
                    {userType == 'Member' &&  userId == memberDetail._id ?<div className="myBtnNew" onClick={() => setLgShow(true)}> <i className="fas fa-user-edit"></i> Update Info</div>: ''}
                        <Modal
                        size="lg"
                        show={lgShow}
                        onHide={() => setLgShow(false)}
                        aria-labelledby="example-modal-sizes-title-lg">
                            <div className="card-body d-flex justify-content-end">
                                <i className="fas fa-2x fa-times-circle closeBtn" onClick={closeBtn}></i>
                            </div>
                                <h3 className="text-center">Edit Member</h3>
                            <Modal.Body>
                                <div className="card-body">
                                    <div className="address">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i className="fas fa-map-marked-alt"></i> Address:</p>
                                            <p className="col-8 text-left">{memberDetail.address ? memberDetail.address : "address not yet provided"}</p>
                                            <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("address")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div className={ dropDownAddress.type ? `${dropDownAddress.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" 
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
                                            <p className="subHeader col-3 text-left"><i className="fas  fa-phone-square"></i> Phone:</p>
                                            <p className="col-8 text-left">{memberDetail.phoneNumber ? memberDetail.phoneNumber : "phone number not yet provided"}</p>
                                            <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("phoneNumber")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div className={ dropDownPhone.type ? `${dropDownPhone.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" 
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
                                    <div className="bio">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i className="far fa-address-card"></i> Bio:</p>
                                            <p className="col-8 text-left">{memberDetail.bio ? memberDetail.bio : "bio not yet provided"}</p>
                                            <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("bio")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div className={ dropDownBio.type ? `${dropDownBio.type} col-12` : 'hide' }>
                                            <div className="form-group">
                                                <input type="text" className="form-control" 
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
                                            <p className="subHeader col-3 text-left"><i className="fas fa-birthday-cake"></i> Birthday:</p>
                                            <p className="col-8 text-left">{memberDetail.birthday ? memberDetail.birthday : "birthday not yet provided"}</p>
                                            <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("birthday")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div className={ dropDownBirthday.type ? `${dropDownBirthday.type} col-12` : 'hide' }>
                                                <div className="form-group col-md-6">
                                                    <label for="phaseDate">Select Birthday</label>
                                                    <input type="date" className="form-control" id="birthday" aria-describedby="birthday" onChange={handleInputChange} value={employeeEdit.birthday}/>
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                    <div className="myBtnNew text-center" onClick={()=>setDropDownBirthday( { type: '' })}>cancel</div>
                                                    <div className="myBtnNew text-center"  onClick={updateMembDetail}>save</div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="membPassword">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i className="fas fa-password-cake"></i> Password:</p>
                                            <p className="col-8 text-left">****************</p>
                                            <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("membPassword")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div className={ dropDownPassword.type ? `${dropDownPassword.type} col-12` : 'hide' }>
                                            <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">{alertMessage.message}</div>
                                                <div className="form-group col-md-6">
                                                    <label for="phaseDate">Change Password</label>
                                                    <input type="password" className="form-control" id="membPassword" aria-describedby="password" minlength="8"
                                                    ref={inputPassword} onChange={handlePasswordChange} value={passwordUpdate.membPassword}/>
                                                    
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                    <div className="myBtnNew text-center" onClick={()=>setDropDownPassword( { type: '' })}>cancel</div>
                                                    <div className="myBtnNew text-center"  onClick={updatePassword}>save</div>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal> 
                    </div>
                </div>
                <div className="links d-flex">
                    <div className="">
                    {houses.map( house => 
                        memberDetail.house == house._id ?
                    <div>
                        <div className="teamBox">
                            <Link to={`/TeamDetail/${teamId}/House/${house._id}/${house.houseName}`} >
                                <img className="" src={house.profileImg} alt="bdsb"/>
                            </Link> 
                        </div>
                        <div className="linkName">{house.houseName}</div>
                    </div>
                        : '')}
                    </div>
                    <div>
                        <div className="teamBox">
                            <Link to={`/TeamDetail/${teamId}/TeamDashboard`}>
                                <h1 style={{fontSize:'4rem', color: 'white'}}>T</h1>
                            </Link>
                        </div>
                        <div className="linkName">My Team</div>
                    </div>
                </div>
            </div>
            <div className="row mx-auto">
                <div className="col-12">
                    <UserContext.Provider value={{memberDetail}}> 
                        <Router>
                        <div className="d-flexb tabBox">
                            <TabBar teamId={teamId} membName={memberDetail.name} userId={memberDetail._id} frndReq={frndReq}/>
                        </div>
                        <div className={ theme === 'Dark' ? "memDetailDark" : "memDetail" }>
                            <Route exact path={["/UserProfile/TimeLine"]} component={TimeLine} />
                            <Route path={["/UserProfile/About"]} component={About} memberDetail={memberDetail} />
                            <Route path={["/UserProfile/Wall"]} component={Wall}/>
                            <Route path={["/UserProfile/FriendList"]} component={FriendList}/>
                        </div>
                        </Router>
                    </UserContext.Provider>
                </div>
            </div>
        </div>
    )
}

export default MemberProfile
