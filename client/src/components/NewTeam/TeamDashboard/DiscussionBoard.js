import React , {useState, useEffect, useRef}  from 'react'
import { Link, useLocation, useParams } from "react-router-dom";
import {Modal} from 'react-bootstrap'

function DiscussionBoard() {
    const { teamId } = useParams();
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [ myPic, setMyPic] = useState ( '' );
    const [ discussions, setDiscussions ] = useState([]);
    const [ members, setMembers ] = useState([]);
    const [ adminDetail, setAdminDetail ]= useState({});
    const [allMembers, setAllMembers]=useState([])

    const inputDiscussionTitle = useRef();
    const inputDiscussionPost = useRef();
    const userId = localStorage.id
    const [lgShow, setLgShow] = useState(false);
    const [pollForm, setPollForm] = useState(false);
    const [imgForm, setImgForm] = useState(false);
    const [pollOptions, setPollOptions] = useState([
        {optionTxt: '',optionId: 0},{optionTxt: '',optionId: 1}]);
    const [newDiscussion, setNewDiscussion]= useState({
        teamId: `${teamId}`, creatorId: `${userId}`, discussionTitle: '', discussionPost: '', discussionImg: localStorage.unUploaded,discussionType:'',
    })
    let allMembs=[]
    async function handleChange(e){
        const file = e.target.files[0];
        setMyPic(file)
    }
    async function handleUpload(e){
        e.preventDefault();
        if(myPic){
            let myForm = document.getElementById('myForm');
            let formData = new FormData(myForm);
            const uploadPic = await fetch(`/api/discussionBoardPic`, 
                {
                    method: 'PUT',
                    body: formData
                }
            ).then( result=>result.json())
            console.log(uploadPic)
            setNewDiscussion( { ...newDiscussion, discussionImg: uploadPic } );
            localStorage.setItem("unUploaded", uploadPic);
            setImgForm(false)
        }}
    async function cancelImg(e){
        e.preventDefault();
        let oldPhoto = {old: newDiscussion.discussionImg};
            const cancelPhoto = await fetch(`/api/deleteOldProfilePIc`, 
            {   method: 'post',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
                body: JSON.stringify(oldPhoto)
            }).then( result=>result.json());
            setNewDiscussion( { ...newDiscussion, discussionImg: '' } );
            localStorage.setItem("unUploaded", '');
        }
    function showImgForm(){
        if (imgForm== false){
            setImgForm(true)
        } else
        setImgForm(false)
        // if(localStorage.unUploaded !== ''){
        //     cancelImg()
        // }
        // setNewDiscussion( { ...newDiscussion, discussionType: '' } );
    }
    function showPollForm(){
        if (pollForm == false){
            console.log(newDiscussion)
            setPollForm(true)
            let newObj = newDiscussion;
            newObj.discussionType = 'poll'
            console.log('newObj: ', newObj)
            setNewDiscussion(newObj)
            return
            // setNewDiscussion({ ...newDiscussion, discussionType: 'poll'});
        } else
        setPollForm(false)
        setNewDiscussion( { ...newDiscussion, discussionType: '' } );
    }
    function addOption(){
        let newArr = [...pollOptions];
        let lastId = newArr[newArr.length - 1].optionId
        newArr.push({optionTxt: '', optionId:  lastId + 1})
        setPollOptions(newArr); // ??
    }
    function deleteOption(Id){
        let newArr = [...pollOptions]; // copying the old datas array
        // newArr.push({optionTxt: ''})
        let filteredArr = newArr.filter(option=>
            option.optionId !== Id)
        setPollOptions(filteredArr); // ??
    }
    const updateFieldChanged = index => e => {
        let newArr = [...pollOptions]; // copying the old datas array
        // newArr[index].optionTxt = e.target.value; 
        newArr.map(itm=>
                {
                    if(itm.optionId == index){
                        itm.optionTxt = e.target.value; 
                    }
                }
            )
        setPollOptions(newArr); // ??
    }
    function handleInputChange( e ){
        e.preventDefault();
        const { id, value } = e.target; 
        setNewDiscussion( { ...newDiscussion, [id]: value } );
        }
    async function submitNewDiscussion(){
        if(newDiscussion.discussionTitle == ''){
            inputDiscussionTitle.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide Title !' } );
            return;
        }
        if( newDiscussion.discussionTitle.length>60){
            inputDiscussionTitle.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please make sure the title is not more than 60 characters!' } );
            return;
        }
        if(newDiscussion.discussionPost == ''){
            inputDiscussionPost.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide Post !' } );
            return;
        }
        let discussionObj = newDiscussion
        console.log('newDiscussion', discussionObj)
        if(newDiscussion.discussionType == 'poll'){
            console.log('pollOptions : ',pollOptions)
            discussionObj = {
                ...discussionObj, pollOptions
            }
        }
        console.log('final discussionObj', discussionObj)
        const apiResult = await fetch('/api/postDiscussion', 
        {   method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(discussionObj)
        }).then( result=>result.json());
        console.log('discussion posted');
        localStorage.setItem("unUploaded", '');
        setNewDiscussion({
            teamId: `${teamId}`, creatorId: `${userId}`, discussionTitle: '', discussionPost: '', discussionImg: localStorage.unUploaded,discussionType:'',
        })
        setLgShow(false)
    }
    async function loadDiscussions(){
        const fetchDiscussions = await fetch (`/api/discussions/${teamId}`).then( res => res.json());
        console.log('fetchDiscussions: ', fetchDiscussions)
        setDiscussions(fetchDiscussions)
    }
    async function loadMembers(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        allMembs = fetchMembers;
        setMembers(fetchMembers)
        // setAllMembers(...allMembers, ...fetchMembers)
    }
    async function loadAdminProfile(){
        const getAdmnDetail = await fetch (`/api/adminProfile/${userId}`).then( res => res.json());
        setAdminDetail(getAdmnDetail);
        allMembs.push(getAdmnDetail);
        setAllMembers(allMembs)
    }
    useEffect(function(){
        loadDiscussions();
        loadMembers();
        loadAdminProfile();
    },[])
    return (
        <div>
            <div className="d-flex justify-content-end  mx-auto col-11">
                <div className="myBtnNew2" onClick={() => setLgShow(true)}>Start New Discussion</div>
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
                    <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert"> {alertMessage.message}</div>
                        <div>
                            <div class="form-group">
                                <div className="card">
                                    <div className="card-body">
                                        <h5>Discussion Title</h5>
                                        <input type="text" class="form-control mb-2"
                                        maxlength="60"
                                        ref={inputDiscussionTitle}
                                        id="discussionTitle" aria-describedby="taskHelp" onChange={handleInputChange} 
                                        value={newDiscussion.discussionTitle}/>
                                        <hr/>
                                        <h5>Discussion Post</h5>
                                        <input type="text" class="form-control mb-2" ref={inputDiscussionPost}
                                        id="discussionPost" aria-describedby="taskHelp" onChange={handleInputChange} 
                                        value={newDiscussion.discussionPost}/>
                                        { pollForm === true ? 
                                            <div className="">
                                                    <hr/>
                                                    <div className="d-flex justify-content-between">
                                                        <h5>Add Poll</h5>
                                                    </div>
                                                <div>
                                                    {pollOptions.map((option,idx)=>
                                                    <div className="d-flex">
                                                        <input className="fruitInp mx-auto"
                                                        key={`opt${idx}`}
                                                        placeholder={`Option ${option.optionId + 1}`}
                                                        type="text" name="amount" value={option.optionTxt} onChange={updateFieldChanged(option.optionId)}/>
                                                        <div className="myBtnNew2" onClick={()=>deleteOption(option.optionId)}><i class="fas fa-times"></i></div>
                                                    </div>)}
                                                </div>
                                                <div className="addOption d-flex">
                                                    <div className="myBtnNew2" onClick={addOption}>Add Options</div>
                                                    <div className="myBtnNew2" onClick={showPollForm}>Cancel</div>
                                                </div>
                                            </div>
                                        : ''}
                                        <hr/>
                                    {imgForm === true ?
                                        <form className="upload" id='myForm' role="form" encType="multipart/form-data" >
                                            <h5>Add Image</h5>
                                            <div className="custom-file">
                                                <input 
                                                type="file" 
                                                name="myFile" className="custom-file-input" 
                                                onChange={handleChange}/>
                                                <label className="custom-file-label" for="inputGroupFile02" onChange={handleChange}>Choose file</label>
                                            </div>
                                            <div className="addOption d-flex">
                                                <div class="myBtnNew2" onClick={handleUpload}>Select</div>
                                                <div class="myBtnNew2" onClick={showImgForm}>Cancel</div>

                                            </div>
                                        </form>
                                        : ''}
                                    {!newDiscussion.discussionImg?''
                                    :<div className="uploadingDiscPic">
                                        <i class="fas fa-times cancelImg" onClick={cancelImg}></i>
                                        <img className="discnImgUp" src={newDiscussion.discussionImg} alt=""/>
                                    </div>
                                    }
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="d-flex justify-content-between">
                                    <div class="myBtnNew2" onClick={submitNewDiscussion}>Submit</div>
                                    <div className="d-flex">
                                        <div className="myBtnNew2" onClick={showPollForm} ><i class="fas fa-poll-h"></i> Add Poll</div>
                                        <div className="myBtnNew2" onClick={showImgForm} ><i class="far fa-images"></i> Add Image</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="myCardDark mx-auto col-md-11 row">
                {
                discussions ? 
                discussions.map(discussion=>
                    <div className="discBoards mx-auto">
                        <div className="d-flex">
                            {allMembers.map(member=>
                                member._id === discussion.creatorId ? <img className="postImgThmb" src={member.profileImg} alt=""/> : ''
                                )}
                            <h5 className="discnName pl-4">{discussion.discussionTitle}</h5>
                        </div>
                        <div className="d-flex justify-content-between">
                        {/* {new Date( discussion.created ).toLocaleString('en-US').slice(0,9)} */}
                            <p className="pt-3">{new Date( discussion.created ).toLocaleString()}</p>
                            <Link to={`/TeamDetail/${teamId}/TeamDashboard/DiscussionBoard/DiscussionPage/${discussion._id}`} className="myBtnNew2">
                            view detail
                            </Link>
                        </div>
                    </div>
                    ):''}
            </div>
        </div>
    )
}

export default DiscussionBoard
