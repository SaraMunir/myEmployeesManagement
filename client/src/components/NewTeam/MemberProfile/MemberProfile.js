import React, {useState, useEffect, useRef } from 'react';
import {  useParams , useLocation } from "react-router-dom";
import {Modal} from 'react-bootstrap'
import { BrowserRouter as Router, Route } from "react-router-dom";
import TimeLine from './MemberTimeLine'
import About from './MemberAbout'
import TabBar from './TabBar'
import Wall from './MemberWall'
import FriendList from './MemberFriendList'
export const UserContext = React.createContext();
const userId = localStorage.id
const userType = localStorage.type
const theme = localStorage.theme;

function MemberProfile() {
    const { membId } = useParams();
    const { teamId } = useParams();
    const [ memberDetail, setMemberDetail ]= useState({});
    const [ memberFriend, setMemberFriend ]= useState([]);
    const [ lgShow, setLgShow] = useState(false);
    const [ lgShow2, setLgShow2] = useState(false);
    const [ employeeEdit, setEmployeeEdit ] = useState({ name: "", email: "", role: "", house: "", birthday: "", phone: "",  membPassword: "", teamId: `${teamId}`});
    const [ addFrndBtn, setAddFrndBtn ] = useState(true)
    const [ remvFrndBtn, setRemvFrndBtn ] = useState(false)
    const [ sentFrndBtn, setSentFrndBtn ] = useState(false)
    const [ isUserFriend, setIsUserFriend ] = useState(false)
    const [ teamRoles, setTeamRoles] = useState([]);
    const [ houses, setHouses] = useState([]);
    const [ userFriendsList, setUserFriendsList ] = useState([]);
    const [ dropDownEmail, setDropDownEmail ] = useState( { type: ""} );
    const [ dropDownAddress, setDropDownAddress ] = useState( { type: ""} );
    const [ dropDownPhone, setDropDownPhone ] = useState( { type: ""} );
    const [ dropDownRole, setDropDownRole ] = useState( { type: ""} );
    const [ dropDownBio, setDropDownBio ] = useState( { type: ""} );
    const [ dropDownBirthday, setDropDownBirthday ] = useState( { type: ""} );
    const [ dropDownHouse, setDropDownHouse ] = useState( { type: ""} );
    const [ dropDownPassword, setDropDownPassword ] = useState( { type: ""} );
    const [ trial, setTrial ] = useState({})
    const [ myPic, setMyPic] = useState ( '' );
    const [ showForm2, setShowForm2] = useState( false );
    let memberDet= {};
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
        console.log('fetched Members friend list is: ', getEmpDetail.friendList)
        setMemberDetail(getEmpDetail);
        setMemberFriend(getEmpDetail.friendList)
        if(userType == "Member"){
            getEmpDetail.friendList.map(membFren=>
                {
                    if(membFren.friendId == userId){
                        setIsUserFriend(true)
                    }
                }
            )
        }
        memberDet=getEmpDetail;
        if(getEmpDetail.friendRequests.length > 0){
            getEmpDetail.friendRequests.map(frnd=>
                {
                    if(frnd.memberId === userId){
                        setSentFrndBtn(true);
                        setAddFrndBtn(false)
                    }
                }
            )
        } else{
            setSentFrndBtn(false);
            setAddFrndBtn(true)
        }
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
        } else if(typeForm === "house"){
            if(dropDownHouse.type==''){
                setDropDownHouse( { type: 'myMenu'} )
            } else {
                setDropDownHouse( { type: '' } )
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
        prompt('not available yet')
    }
    async function loadHouse(){
        const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
        console.log('fetched houses are: ', fetchHouses)
        setHouses(fetchHouses);
    }
    async function updateMembDetail(){
        console.log('trial: ',trial) 
        console.log('trial.id: ',trial.id)
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
    async function loadMyFriends(){
        const fetchUsersFriends = await fetch (`/api/getUserFriendList/${userId}`).then( res => res.json());
        console.log('fetched friend List are: ', fetchUsersFriends);
        setUserFriendsList(fetchUsersFriends)
        console.log('memberDetail that im looking for : ', memberDet)
        fetchUsersFriends.map(myFrnd=>
            {
                if(myFrnd.friendId === memberDet._id){
                    setRemvFrndBtn(true);
                    setAddFrndBtn(false);
                    setSentFrndBtn(false)
                }
            }
        )
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
        if (key==='house'){
            setDropDownHouse( { type: '' } )
        }
    }
    async function sendFrndReq(friendId){
        const friendData={
            friendId: friendId,
            userId: userId,
        }
        console.log('friend data: ', friendData)
        const apiResult = await fetch(`/api/sendFrndReq/${userId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(friendData)
            }).then( result => result.json());
            console.log('friend added: ', apiResult.message)
        loadMemberProfile();

    }
    async function cancelFriendReq(friendId){
        const friendData={
            friendId: friendId,
            userId: userId,
        }
        console.log('friend data: ', friendData)
        const apiResult = await fetch(`/api/cancelFriendReq/${userId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(friendData)
            }).then( result => result.json());
            console.log('friend added: ', apiResult.message)
            loadMemberProfile();
            loadMyFriends()
    }
    async function unFrnd(friendId){
        const friendData={
            friendId: friendId,
            userId: userId,
        }
        const apiResult = await fetch(`/api/unFriend/${userId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(friendData)
            }).then( result => result.json());
            console.log('friend added: ', apiResult.message)
        loadMemberProfile();
    }
    useEffect(function(){
        loadMemberProfile();
        loadTeamRoles();
        loadHouse()
        if(userType== 'Member'){
            loadMyFriends();
        }
    },[])
    return (
        <div className="">
            <div className="CovImg">
            </div>
            <div className="row mx-auto membIntro">
                <div className="membProImg col-lg-4">
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
                <div className="membAbout col-lg-4 mx-auto">
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
                                    <div className="email">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i className="fas fa-envelope"></i> Email:</p>
                                            <p className="col-8 text-left">{memberDetail.email}</p>
                                            <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("email")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div className={ dropDownEmail.type ? `${dropDownEmail.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" 
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
                                    <div className="role">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i className="fas fa-user-tag"></i> Role:</p>
                                            <p className="col-8 text-left">{memberDetail.role ? memberDetail.role : "role number not yet provided"}</p>
                                            <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("role")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div className={ dropDownRole.type ? `${dropDownRole.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <label for="role">Select Role</label>
                                                    <select 
                                                    id="role" className="form-control" value={employeeEdit.role} 
                                                    onChange={handleInputChange} >
                                                        <option selected>Choose...</option>
                                                        {teamRoles.map( role => 
                                                        <option key={`r-${role}`} value={role.roleName}>{role.roleName}</option>
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
                                    <div className="house">
                                        <div className="d-flex justify-content-between">
                                            <p className="subHeader col-3 text-left"><i className="fas fa-user-tag"></i> House:</p>
                                            {houses.map( house => 

                                                memberDetail.house == house._id ?
                                                <p className="col-8 text-left" key={`r-${house}`} >{house.houseName}</p>: ''
                                            )}
                                            <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("house")}></i>
                                        </div>
                                        <div className="myDropDown">
                                            <div className={ dropDownHouse.type ? `${dropDownHouse.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <label for="house">Select House</label>
                                                    <select 
                                                    id="house" className="form-control" value={employeeEdit.house} 
                                                    onChange={handleInputChange} >
                                                        <option selected>Choose...</option>
                                                        {houses.map( house => 
                                                        <option key={`r-${house}`} value={house._id}>{house.houseName}</option>
                                                        )}
                                                    </select>
                                                    <div className="d-flex justify-content-end">
                                                        <div className="myBtnNew text-center" onClick={()=>setDropDownHouse( { type: '' })}>cancel</div>
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
                                            <div className={ dropDownBirthday.type ? `${dropDownBirthday.type} col-12` : 'hide' }>
                                                <div className="form-group col-md-6">
                                                    <label for="phaseDate">Select Birthday</label>
                                                    <input type="password" className="form-control" id="membPassword" aria-describedby="password" minlength="8" onChange={handleInputChange} value={employeeEdit.membPassword}/>
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
                    { userType === 'Member' ?
                    userId == memberDetail._id ? ''
                    :<div className="frndBtns">
                        { remvFrndBtn == true ? <div className="myBtnNew2 col-8" onClick={()=>unFrnd(memberDetail._id)}><i class="fas fa-user-times"></i> Unfriend</div> 
                        : ''}
                        { sentFrndBtn == true ? <div className="myBtnNew2 col-8" onClick={()=>cancelFriendReq(memberDetail._id)}><i class="fas fa-user-times"></i> Cancel Request</div> 
                        : ''}
                        { addFrndBtn == true ? <div className="myBtnNew2 col-8" onClick={()=>sendFrndReq(memberDetail._id)}><i class="fas fa-user-plus"></i> Add as Friend</div> 
                        : ''}
                    </div> 
                    : ''}
                </div>
                <div>
                    <div className="membHosImg">
                    {houses.map( (house, idx) => 
                        memberDetail.house == house._id ?
                        <img key={`house-${idx}`} className="col-12" src={house.profileImg} alt="bdsb"/> : '')}
                    </div>
                </div>
            </div>
            <div className="row mx-auto ">
                <div className="col-12">
                    <UserContext.Provider value ={{memberDetail, memberFriend}}> 
                        <Router>
                        <div className="d-flexb tabBox">
                            <TabBar teamId={teamId} membName={memberDetail.name} membId={memberDetail._id} memberDetail={memberDetail} isUserFriend={isUserFriend}/>
                        </div>
                        <div className={ theme === 'Dark' ? "memDetailDark" : "memDetail" }>
                            <Route exact path={["/TeamDetail/:teamId/MemberProfile/:memberName/:membId/TimeLine"]} component={TimeLine} />
                            <Route exact path={["/TeamDetail/:teamId/MemberProfile/:memberName/:membId/About"]} component={About} memberDetail={memberDetail} />
                            <Route exact path={["/TeamDetail/:teamId/MemberProfile/:memberName/:membId/Wall"]} component={Wall} />
                            <Route exact path={["/TeamDetail/:teamId/MemberProfile/:memberName/:membId/FriendList"]} component={FriendList}  memberFriend={memberFriend}/>
                        </div>
                        </Router>
                    </UserContext.Provider>
                </div>
            </div>
        </div>
    )
}

export default MemberProfile
