import React, {useState, useContext, useEffect, useRef } from 'react';
import {Modal, Button} from 'react-bootstrap'


const userId = localStorage.id
const userType = localStorage.type
function ProfilePage() {
    const [ adminDetail, setAdminDetail ]= useState({});
    const [lgShow, setLgShow] = useState(false);
    const [lgShow2, setLgShow2] = useState(false);
    const [ myPic, setMyPic] = useState ( '' );
    const [ showForm2, setShowForm2] = useState( false )
    const [ dropDownEmail, setDropDownEmail ] = useState( { type: ""} );
    const [ dropDownAddress, setDropDownAddress ] = useState( { type: ""} );
    const [ dropDownPhone, setDropDownPhone ] = useState( { type: ""} );
    const [ dropDownRole, setDropDownRole ] = useState( { type: ""} );
    const [ dropDownBio, setDropDownBio ] = useState( { type: ""} );
    const [ dropDownBirthday, setDropDownBirthday ] = useState( { type: ""} );
    const [ dropDownHouse, setDropDownHouse ] = useState( { type: ""} );
    const [ adminEdit, setAdminEdit ] = useState({ name: "", email: "", role: "", house: "", birthday: "", phone: "",  membPassword: ""});
    const [ trial, setTrial ] = useState({})
    function closeBtn(){
        setLgShow(false)
        
    }    
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
            const uploadPic = await fetch(`/api/upload/${userId}`, 
                {
                    method: 'PUT',
                    body: formData
                }
            ).then( result=>result.json())
        }
        if(adminDetail.profileImg){
            let oldPhoto = {old: adminDetail.profileImg};
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
            loadAdminProfile();
        
    }
    function handleInputChange( e ){
        const { id, value } = e.target; 
        setAdminEdit( { ...adminEdit, [id]: value } );
        setTrial ({ [id]: value })
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
        loadAdminProfile();
        let key = Object.keys(trial)[0];
        closeEditBtns(key)
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
        }
    }
    async function loadAdminProfile(){
        const getAdmnDetail = await fetch (`/api/adminProfile/${userId}`).then( res => res.json());
        console.log('fetched Admin detail is: ', getAdmnDetail)
        setAdminDetail(getAdmnDetail);
    }
    useEffect(function(){
        loadAdminProfile();
    },[])
    return (
        <div className="">
            <div className="adminCov">
                <div className="adminCovImg"></div>
                <div className="shorSum row col">
                    <div className="adminProImg border">
                        <img className="profilePhoto" src={adminDetail.profileImg ? adminDetail.profileImg : "https://i2.wp.com/wp.laravel-news.com/wp-content/uploads/2018/03/avatar-images-spatie.png?resize=2200%2C1125"
                        } alt="memberImg"/>
                        <i className="fas fa-camera admiUpIcon"  onClick={() => setLgShow2(true)}></i>
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
                    <div className="membAbout border col">
                        <h2 className="myTitle text-left"> {adminDetail.name} </h2>
                        <p className="text-left"> {adminDetail.bio ? adminDetail.bio : 'Bio has yet not been added yet..'}</p>
                        <div className="edit">
                            {userType == 'Admin' ? <div className="myBtnNew" onClick={() => setLgShow(true)}> <i className="fas fa-user-edit"></i> Update Info</div>: ''}
                            {userType == 'Member' &&  userId == adminDetail._id ?<div className="myBtnNew" onClick={() => setLgShow(true)}> <i className="fas fa-user-edit"></i> Update Info</div>: ''}
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
                                                <p className="col-8 text-left">{adminDetail.email}</p>
                                                <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("email")}></i>
                                            </div>
                                            <div className="myDropDown">
                                                <div className={ dropDownEmail.type ? `${dropDownEmail.type} col-12` : 'hide' }>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" id="email" aria-describedby="taskHelp" placeholder={adminDetail.email !== "undefined" ? "email": adminDetail.email} onChange={handleInputChange} 
                                                        value={adminEdit.email}/>
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
                                                <p className="col-8 text-left">{adminDetail.address ? adminDetail.address : "address not yet provided"}</p>
                                                <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("address")}></i>
                                            </div>
                                            <div className="myDropDown">
                                                <div className={ dropDownAddress.type ? `${dropDownAddress.type} col-12` : 'hide' }>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" 
                                                        id="address" aria-describedby="taskHelp" placeholder={adminDetail.address !== "undefined" ? "address": adminDetail.address} onChange={handleInputChange} 
                                                        value={adminEdit.address}/>
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
                                                <p className="col-8 text-left">{adminDetail.phoneNumber ? adminDetail.phoneNumber : "phone number not yet provided"}</p>
                                                <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("phoneNumber")}></i>
                                            </div>
                                            <div className="myDropDown">
                                                <div className={ dropDownPhone.type ? `${dropDownPhone.type} col-12` : 'hide' }>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" 
                                                        id="phoneNumber" aria-describedby="taskHelp" placeholder={adminDetail.phoneNumber !== "undefined" ? "phoneNumber": adminDetail.phoneNumber} onChange={handleInputChange} 
                                                        value={adminEdit.phoneNumber}/>
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
                                                <p className="col-8 text-left">{adminDetail.bio ? adminDetail.bio : "bio not yet provided"}</p>
                                                <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("bio")}></i>
                                            </div>
                                            <div className="myDropDown">
                                                <div className={ dropDownBio.type ? `${dropDownBio.type} col-12` : 'hide' }>
                                                <div className="form-group">
                                                    <input type="text" className="form-control" 
                                                    id="bio" aria-describedby="taskHelp" placeholder={adminDetail.bio !== "undefined" ? "bio": adminDetail.bio} onChange={handleInputChange} 
                                                    value={adminEdit.bio}/>
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
                                                <p className="col-8 text-left">{adminDetail.birthday ? adminDetail.birthday : "birthday not yet provided"}</p>
                                                <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("birthday")}></i>
                                            </div>
                                            <div className="myDropDown">
                                                <div className={ dropDownBirthday.type ? `${dropDownBirthday.type} col-12` : 'hide' }>
                                                    <div className="form-group col-md-6">
                                                        <label for="phaseDate">Select Birthday</label>
                                                        <input type="date" className="form-control" id="birthday" aria-describedby="birthday" onChange={handleInputChange} value={adminEdit.birthday}/>
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
            </div>
        </div>
    )
}

export default ProfilePage
