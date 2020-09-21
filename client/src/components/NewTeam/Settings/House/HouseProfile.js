import React, {useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import {Modal} from 'react-bootstrap'
const userId = localStorage.id
const userType = localStorage.type
function HouseProfile() {
    const { teamId } = useParams();
    const { houseId } = useParams();
    const [lgShow2, setLgShow2] = useState(false);
    const [lgShow, setLgShow] = useState(false);
    const [ housePic, setHousePic] = useState ( '' );
    const [ showForm2, setShowForm2] = useState( false )
    const [ member, setMember] = useState([]);
    const [ houseDetail, setHouseDetail ] = useState({})
    const [ editHouse, setEditHouse ] = useState({})
    const [ showAbout, setShowAbout] = useState(false)
    const [ showHouseClr, setShowHouseClr] = useState(false)
    const [ showHouseLeader, setShowHouseLeader] = useState(false)

    async function loadHouseDetail(){
        const getHouseDetail= await fetch(`/api/houseDetail/${houseId}`).then(result=>result.json());
        console.log("house detail: ", getHouseDetail)
        setHouseDetail(getHouseDetail);
    }
    function handleChange(e){
        const file = e.target.files[0];
        setHousePic(file)
    }
    function uploadPic( e ){
        e.preventDefault();
        setShowForm2(false);
    } 
    async function handleUpload(e){
        e.preventDefault();
        uploadPic(e);
        if(housePic){
            let myForm = document.getElementById('myForm');
            let formData = new FormData(myForm);
            const uploadPic = await fetch(`/api/uploadHouseImg/${houseId}`, 
                {
                    method: 'PUT',
                    body: formData
                }
            ).then( result=>result.json())
        }
        if(houseDetail.profileImg){
            let oldPhoto = {old: houseDetail.profileImg};
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
            loadHouseDetail();
        
    }
    function handleInputChange( e ){
        const { id, value } = e.target; 
        setEditHouse({ [id]: value })
        }
    function showForm(category){
        if(category == 'about'){
            if(showAbout == false){
                setShowAbout(true)
            } else 
            setShowAbout(false);
            setEditHouse({})
        }
        if(category == 'houseColor'){
            if(showHouseClr == false){
                setShowHouseClr(true)
            } else 
            setShowHouseClr(false);
            setEditHouse({})
        }
        if(category == 'houseLeader'){
            if(showHouseLeader == false){
                setShowHouseLeader(true)
            } else 
            setShowHouseLeader(false);
            setEditHouse({})
        }
    }
    async function loadMember(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMember(fetchMembers)
    }
    async function closeBtn(){
        setLgShow(false)
        setShowAbout(false);
        setShowHouseClr(false);
    }
    function closeEditBtns(key){
        if (key==='about'){
            console.log(key);
            setShowAbout(false)
        }
        if (key==='houseColor'){
            console.log(key);
            setShowHouseClr(false)
        }
        if (key==='houseLeader'){
            console.log(key);
            setShowHouseLeader(false)
        }
    }
    async function updateHouseDetail(){
        console.log('editHouse: ', editHouse)
        const apiResult = await fetch(`/api/houseDtlUpdate/${houseId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editHouse)
            }).then( result => result.json());
        loadHouseDetail();
        let key = Object.keys(editHouse)[0];
        closeEditBtns(key)
    }
    useEffect(function(){
        loadHouseDetail();
        loadMember();
    },[])
    return (
        <div>
            <div className="houseColor" style={{background:`${houseDetail.houseColor ? houseDetail.houseColor: '#303030' }`}}>
            { userType == 'Admin' ? <div className="myBtnNew" onClick={() => setLgShow(true)}>Edit &nbsp;<i class="fi-xnsuxl-setting-solid"></i></div>:''}
                <Modal
                    size="lg"
                    show={lgShow}
                    onHide={() => setLgShow(false)}
                    aria-labelledby="example-modal-sizes-title-lg">
                    <Modal.Header>
                        <Modal.Title id="example-modal-sizes-title-lg"> 
                            house setting   
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <i className="fas fa-times uploadIcon2" onClick={() =>closeBtn()}></i>
                        <div className="card-body">
                            <div className="About">
                                <div className="d-flex justify-content-between">
                                    <p className="subHeader col-3 text-left">About:</p>
                                    <p className="col-8 text-left">{houseDetail.about}</p>
                                    <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("about")}></i>
                                </div>
                                <div className="myDropDown">
                                    <div className={showAbout == true ? '': 'hide'} id="aboutSect">
                                        <div className="form-group">
                                            <input type="text" className="form-control" 
                                            id="about" aria-describedby="taskHelp" placeholder='input about' onChange={handleInputChange} 
                                            value={editHouse.about}/>
                                            <div className="d-flex justify-content-end">
                                                <div className="myBtnNew text-center" onClick={()=>setShowAbout(false)} >cancel</div>
                                                <div className="myBtnNew text-center" onClick={updateHouseDetail}>save</div>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="HouseColor">
                                <div className="d-flex justify-content-between">
                                    <p className="subHeader col-3 text-left">House Color:</p>
                                    <div className="colorBox col-8" style={{height: '20px', background: `${houseDetail.houseColor}`}}></div>
                                    <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("houseColor")}></i>
                                </div>
                                <div className="myDropDown">
                                    <div className={showHouseClr == true ? '': 'hide'} id="houseClrSect">
                                        <div className="form-group">
                                            <label for="color">Select House Color</label>
                                            <input type="color"  class="form-control" id="houseColor" onChange={handleInputChange}
                                            value={editHouse.houseColor} />
                                            <div className="d-flex justify-content-end">
                                                <div className="myBtnNew text-center" onClick={()=>setShowHouseClr(false)} >cancel</div>
                                                <div className="myBtnNew text-center" onClick={updateHouseDetail}>save</div>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="HouseLeader">
                                <div className="d-flex justify-content-between">
                                    <p className="subHeader col-3 text-left">House Leader:</p>
                                    {member.map((memb,idx)=>
                                        memb._id == houseDetail.houseLeader ? <p key={idx} className="col-8 text-left">{memb.name}</p>:'')}
                                    <i className="fas fa-edit col-1 text-left editBtn" onClick={()=>showForm("houseLeader")}></i>
                                </div>
                                <div className="myDropDown">
                                    <div className={showHouseLeader == true ? '': 'hide'}>
                                        <div className="form-group">
                                            <label for="color">Select House Leader</label>
                                            <select 
                                            id="houseLeader" class="form-control" value={editHouse.houseLeader} 
                                            onChange={handleInputChange} >
                                                <option selected>Choose...</option>
                                                {member.map( (memb, idx) => 
                                                memb.house == houseDetail._id ?
                                                <option key={`memb-${idx}`}  value={memb._id}>
                                                    {memb.name}
                                                </option> : ''
                                                )}
                                            </select>
                                            <div className="d-flex justify-content-end">
                                                <div className="myBtnNew text-center" onClick={()=>setShowHouseLeader(false)} >cancel</div>
                                                <div className="myBtnNew text-center" onClick={updateHouseDetail}>save</div>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="detail">
                <div className="row col-12 justify-content-end">
                    <h3 className="houseTitle" >{houseDetail.houseName}</h3>
                    <div className="houseAvatar">
                        <img className="houseImg" src={houseDetail.profileImg? houseDetail.profileImg : "https://cdn.pixabay.com/photo/2014/04/03/00/38/shield-308943_1280.png"}/>
                        { userType == 'Admin' || userType == 'HouseLeader'  ? <i className="fas fa-camera uploadIcon2" style={{background: `${houseDetail.houseColor}`, color: "white"}}  onClick={() => setLgShow2(true)}></i> :''}
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
                </div>
                <div className="houseLeader mb-2 ">
                    <h5 className="text-left">House Leader</h5>
                    <hr style={{marginTop: '0', marginBottom: '15px'}}/>
                    <div className="d-flex">
                        {member.map((memb, idx)=>
                        memb._id == houseDetail.houseLeader ?
                        <div key={idx}  className="hoverShow">
                            <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                <img className="houseMmb" src={memb.profileImg?memb.profileImg: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"} alt="housemembThumb" style={{borderColor: `${houseDetail.houseColor}`}}/>
                            </Link>
                            <div className="hoverName ">
                                <Link className="d-flex" to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                <img className="houseMmbHovr mr-3" src={memb.profileImg?memb.profileImg: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"} alt="housemembThumb" style={{borderColor: `${houseDetail.houseColor}`}}/>
                                <h5>{memb.name}</h5>
                                </Link>
                            </div>
                        </div>
                        : '')}

                    </div>
                </div>
                <div className="houseMateSec">
                    <h5 className="text-left">House Mates</h5>
                    <hr style={{marginTop: '0', marginBottom: '15px'}}/>
                    <div className="d-flex">
                        {member.map((memb, idx)=>
                        memb.house == houseDetail._id ?
                        <div key={idx}  className="hoverShow">
                            <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                <img className="houseMmb" src={memb.profileImg?memb.profileImg: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"} alt="housemembThumb" style={{borderColor: `${houseDetail.houseColor}`}}/>
                            </Link>
                            <div className="hoverName ">
                                <Link className="d-flex" to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                                <img className="houseMmbHovr mr-3" src={memb.profileImg?memb.profileImg: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"} alt="housemembThumb" style={{borderColor: `${houseDetail.houseColor}`}}/>
                                <h5>{memb.name}</h5>
                                </Link>
                            </div>
                        </div>
                        : '')}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HouseProfile
