import React, {useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import {Modal} from 'react-bootstrap'
const userId = localStorage.id
const userType = localStorage.type
function HouseProfile() {
    const { teamId } = useParams();
    const [lgShow2, setLgShow2] = useState(false);
    const [ housePic, setHousePic] = useState ( '' );
    const [ showForm2, setShowForm2] = useState( false )
    const { houseId } = useParams();
    const [ member, setMember] = useState([]);
    const [ houseDetail, setHouseDetail ] = useState({})
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
    async function loadMember(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMember(fetchMembers)
    }
    useEffect(function(){
        loadHouseDetail();
        loadMember();
    },[])
    return (
        <div>
            <div className="houseColor" style={{background:`${houseDetail.houseColor ? houseDetail.houseColor: '#303030' }`}}>
        { userType == 'Admin' ? <div className="hseBtn">Edit &nbsp;<i class="fas fa-edit"></i></div>:''}
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
                <div className="houseMateSec d-flex">
                    {member.map((memb, idx)=>
                    memb.house == houseDetail._id ?
                    <div key={idx}  className="hoverShwo">
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
    )
}

export default HouseProfile
