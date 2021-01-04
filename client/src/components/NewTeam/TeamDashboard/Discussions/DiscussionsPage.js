import React , {useState, useEffect}  from 'react'
import { useParams } from "react-router-dom";

function DiscussionsPage() {
    const { teamId } = useParams();
    const { discussionId } = useParams();
    const userId = localStorage.id;
    const userType = localStorage.type;
    const [ allMembers, setAllMembers]=useState([]);
    const [ discutionPOst, setDiscutionPOst]=useState({});
    const [ discutionComments, setDiscutionComments]=useState([]);
    const [ pollOptions, setpollOptions]=useState([]);
    const [ isFollowing, setIsFollowing]=useState(false)
    const [ isDiscLiked, setIsDiscLiked]=useState(false)
    const [ commentForm, setCommentForm]=useState(false)
    const [ discsnComment, setDiscsnComment ]= useState({ commenterId: userId, comment: '' });
    const [ pollObj, setPollObj ]= useState({});
    const [ reply, setReply] =useState({})
    const [ reply2, setReply2] =useState({})
    const [ showTheInput, setShowTheInput]=useState({val: ''})
    const [ showMoreComment, setShowMoreComment]=useState({val: ''})
    const [ showHideBtnsArr, setShowHideBtnsArr]=useState([])
    const [ showHideReplyBtnsArr, setShowHideReplyBtnsArr]=useState([]);
    const [ discutionImg, setDiscutionImg]=useState({isImg : false, imgSrc: ''})
    let allMembs=[]
    async function loadDiscussionPost(){
        let showBtnsArr = []
        let showBtnsArr2 = []
        let pollObjRaw ={}
        const fetchDiscussion = await fetch (`/api/discussionPost/${discussionId}`).then( res => res.json());
        console.log('fetchDiscussion post: ', fetchDiscussion)
        // in Case if the post has polls options: 
        if(fetchDiscussion.pollOptions.length>0){
            let pollOptArr = []
            let totalVoteCount=0;
            fetchDiscussion.pollOptions.map(option=>{
                let pollOptObj = option
                totalVoteCount = totalVoteCount + option.votes.length
                option.votes.map(vote=>{
                    if(vote.userId === userId){
                        pollOptObj.optnVotedByUser = true
                    }
                })
                pollOptArr.push(pollOptObj)
            })
            pollObjRaw ={
                pollOptArr : pollOptArr, 
                totalVoteCount: totalVoteCount,
                totalPollOptCount: fetchDiscussion.pollOptions.length
            }
            setpollOptions(pollOptArr)
            setPollObj(pollObjRaw)
        }
    // in Case if the post has Images: 
        if(!fetchDiscussion.discussionImg == ""){
            console.log('discussion has a picture')
            setDiscutionImg({isImg : true, imgSrc: fetchDiscussion.discussionImg})
        }
        //setting up to check if the post is followed by user
        fetchDiscussion.followers.map(follower=>{
            if(follower.userId === userId){
                setIsFollowing(true)
            }
        })
        //setting up to check post is liked by user
        if(fetchDiscussion.likes.length >0 ){
            fetchDiscussion.likes.map(like=>{
                if(like.userId === userId){
                    setIsDiscLiked(true)
                    return
                } setIsDiscLiked(false)
            })
        } else {
            setIsDiscLiked(false)
        }
        let commentArr =[]
        //    setting up comments inorder to check if the comment is liked and also set up for buttons array
        if(fetchDiscussion.comments.length>0){
            fetchDiscussion.comments.map((comment, idx)=>{
                let commmentObj = comment
                showBtnsArr.push({[idx]: 'false'})
                showBtnsArr2.push({[idx]: ''})
                if(commmentObj.likes.length>0){
                    console.log('comment.likes: ', comment.likes)
                    comment.likes.map(like=>{
                        if(like.userId === userId){
                        //     updating comment obj by adding extra key of 'if comment is liked by user'
                            commmentObj.CommentLikedByUser = true
                        }
                        //    setting up replies inorder to check if the reply is liked by user
                    }) }
                let replyArr = []
                if(comment.replies.length>0){
                    comment.replies.map(reply=>{
                    let replyObj = reply;
                    if(replyObj.likes.length>0){
                        reply.likes.map(like=>{
                            if(like.userId === userId){
                                replyObj.ReplyLikedByUser = true
                            }
                        })
                    }
                    replyArr.push(replyObj) })
                }
                commmentObj.replies = replyArr;
                commentArr.push(commmentObj) }) }
        setShowHideBtnsArr(showBtnsArr)
        setShowHideReplyBtnsArr(showBtnsArr2)
        setDiscutionPOst(fetchDiscussion);
        setDiscutionComments(commentArr);
    };
    async function loadMembers(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        allMembs = fetchMembers;
    }
    async function loadAdminsInfo(){
        if(userType==="Admin"){
            const getAdmnDetail = await fetch (`/api/adminProfile/${userId}`).then( res => res.json());
            allMembs.push(getAdmnDetail);
            console.log("allMembs: ", allMembs)
            setAllMembers(allMembs)
            return
        }
        if(userType==="Member"){
            const fetchTeamDetail = await fetch (`/api/teamDetails/${teamId}`).then( res => res.json());
            const getAdmnDetail = await fetch (`/api/adminProfile/${fetchTeamDetail.teamAdmin}`).then( res => res.json());
            allMembs.push(getAdmnDetail);
            console.log("allMembs: ", allMembs)
            setAllMembers(allMembs)
            return
        }
    }
    async function followDiscussion(){
        const followObj={
            discId: discussionId,
            userId: userId,
            userType: userType
        }
        console.log('following obj: ', followObj)
        const apiResult = await fetch('/api/followDiscussion', 
        {   method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(followObj)
        }).then( result=>result.json());
        loadDiscussionPost();
        loadMembers();
        loadAdminsInfo();
    }
    async function unFollowDiscussion(){
        const followObj={
            discId: discussionId,
            userId: userId,
            userType: userType
        }
    }
    async function votePoll(pollOptnId){
        console.log('pollOptnId: ', pollOptnId);
        const pollData={
            userId: userId,
        }
        const apiResult = await fetch(`/api/votePoll/${discussionId}/${pollOptnId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pollData)
            }).then( result => result.json());
            loadDiscussionPost();
    }
    async function unVotePoll(pollOptnId){
        console.log('pollOptnId: ', pollOptnId);
        const pollData={
            userId: userId,
        }
        const apiResult = await fetch(`/api/unVotePoll/${discussionId}/${pollOptnId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pollData)
            }).then( result => result.json());
            loadDiscussionPost();
    }
    async function likeDiscPost(postId, type){
        console.log("type ", type)
        console.log("postId ", postId)
        const likeData={
                userId: userId,
                }
        if(type === 'discussion'){
        const apiResult = await fetch(`/api/likeDiscPost/${postId}`, 
        {   method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(likeData)
        }).then( result => result.json());
        loadDiscussionPost();
        return
        }
        if(type === 'comment'){
        console.log('comments postId: ', postId)
        const apiResult = await fetch(`/api/likeDiscComnt/${discussionId}/${postId}`, 
        {   method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(likeData)
        }).then( result => result.json());
        loadDiscussionPost();
        return
        }
        if(type === 'reply'){
        console.log("type ", type)
        console.log("postId ", postId)
        const replyLikesData={
            userId: userId,
            replyId: postId.replyId,
            commentId: postId.commentId,
        }
        console.log('replyLikesData ', replyLikesData)
        const apiResult = await fetch(`/api/likeCmntReply/${discussionId}`, 
        {   method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(replyLikesData)
        }).then( result => result.json());
        loadDiscussionPost();
        return}
    }
    async function unLikeDiscPost(postId, type){
        const likeData={
            userId: userId,
        }
        if(type === 'discussion'){
            const apiResult = await fetch(`/api/unLikeDiscPost/${postId}`, 
                {   method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(likeData)
                }).then( result => result.json());
                loadDiscussionPost();
                return
            }
        if(type === 'comment'){
            const apiResult = await fetch(`/api/unLikeDiscComnt/${discussionId}/${postId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(likeData)
            }).then( result => result.json());
            loadDiscussionPost();
            return
            }
        if(type === 'reply'){
            // replyId, commentId
            const replyLikesData={
                userId: userId,
                replyId: postId.replyId,
                commentId: postId.commentId,
            }
            const apiResult = await fetch(`/api/unLikeCmntReply/${discussionId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(replyLikesData)
            }).then( result => result.json());
            loadDiscussionPost();
            return
        }
    }
    function ShowCommentForm(){
        if(commentForm===false){
            setCommentForm(true)
        } else setCommentForm(false)
    }
    function hndleCmntInptChnge( e ){
        const { id, value } = e.target; 
        setDiscsnComment({...discsnComment, [id]:value });
    }
    function hndleCmntInptChnge2( e ){
        // data-idx={idx}
        const { name, value } = e.target; 
        // console.log('name: ', name)
        setReply({'reply': value });
        setReply2({[name]: value });
    }
    async function postDiscComnt(){
        console.log('discsnComment', discsnComment)
        const apiResult = await fetch(`/api/postDiscsnCmnt/${discussionId}`,
        {   method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(discsnComment)
        }).then( result => result.json());
        loadDiscussionPost();
        setDiscsnComment({ commenterId: userId, comment: '' })
        ShowCommentForm()
    }
    async function postReply(commentId){
        const replyData = {
            replierId: userId,
            reply: reply.reply
        }
        console.log('reply2', reply2)
        console.log('replyData', replyData)
        const apiResult = await fetch(`/api/replyToComment/${discussionId}/${commentId}`,
        {   method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(replyData)
        }).then( result => result.json());
        loadDiscussionPost();
        setReply({});
        setReply2({});
        setShowTheInput({val: ''})
    }
    const handleClickME = index => e =>{
        e.preventDefault();
        const { name, value } = e.target; 
        console.log('showHideReplyBtnsArr: ', showHideReplyBtnsArr)
        let newArr = showHideReplyBtnsArr
        newArr.map((arr,idx)=>{
            if(idx === parseInt(index)){
                arr[idx] = value
            }
        })
        setShowHideReplyBtnsArr(newArr)
        setShowTheInput({val: name})
    }
    function handleShowMore(e){
        e.preventDefault();
        const { id, name, value } = e.target; 
        console.log('value ', value)
        // hideComments${idx}    showHideBtnsArr[idx][idx]
        let anotherArr = []
        console.log('showHideBtnsArr: ', showHideBtnsArr)
        let newArr = showHideBtnsArr
        newArr.map((arr,idx)=>{
            if(idx === parseInt(id)){
                arr[idx] = value
            }
        })
        setShowHideBtnsArr(newArr)
        setShowMoreComment({val: name})
    }
    useEffect(function(){
        loadDiscussionPost();
        loadMembers();
        loadAdminsInfo();
    },[])
    return (
        <div className="container">
            <div className="d-flex discContnr">
                <div className="discBoards col-md-9">
                    {/* Discussion post Summary  +  follow discssn board */}
                    <div className="d-flex justify-content-between">
                        <div className="d-flex"> 
                            {allMembers.map((member, idx)=>
                            member._id === discutionPOst.creatorId ? <img key={`membImg${idx}`} className="postImgThmb" src={member.profileImg} alt=""/> : ''
                            )}
                            <div className="ml-3 text-left">
                                <h4 style={{margin: '0', textTransform: "capitalize"}}>{allMembers.map(member=>
                                member._id === discutionPOst.creatorId ? member.name : ''
                                )}</h4>
                                <p style={{margin: '0', fontSize: '.9rem'}}>{new Date(discutionPOst.created).toLocaleString()}</p>
                            </div> 
                        </div>
                        {isFollowing === false ? <div className="myBtnNew2" onClick={followDiscussion}>Follow Discussion</div> : <div className="myBtnNew2" onClick={unFollowDiscussion}>Unfollow Discussion</div>  }
                    </div>
                    <hr className="lineDivdr"/>
                {/* Main Discussion post */}
                    <div className="card discutionPOst">
                        <div className="card-body">
                            <div className="">
                            {discutionImg.isImg === true ?
                            <img src={discutionImg.imgSrc} className="discImg" alt=""/>
                            :''
                            }
                            </div>
                {/* discussion Tittle */}
                            <h3>{discutionPOst.discussionTitle}</h3>
                            <hr className="col-10 mx-auto" />
                {/* discussion main post */}
                            <div> {discutionPOst.discussionPost} </div>
                {/* discussion Polls if any */}
                            <div className="polls"> 
                                { pollOptions.length>0?
                                pollOptions.map(option=>
                                    {
                                        // pollObj
                                        let totalVotes = 'x'
                                        return ( <div className="d-flex col-12">
                                        <div className="pollItem col-10 text-left mb-3 d-flex">
                                            <div className=" pollPercentage" style={
                                                option.votes.length>0?
                                                {width: 
                                                `${((option.votes.length)/pollObj.totalVoteCount)*100}%`
                                                } :{}}>
                                                <div className=" justify-content-between">
                                                    <p style={{margin: '0'}}>{option.optionTxt}</p>
                                                </div>
                                            </div>
                                            {option.votes.length > 0 ?  <p className="pl-2 col-3"  style={{margin: '0'}}> {option.votes.length} votes</p>: '' } 
                                        </div>
                                        {
                                            option.optnVotedByUser === true ?
                                            <div className="votedItm col-2 mb-3 pt-3" onClick={()=>unVotePoll(option._id)}> <i class="fas fa-check"></i> &nbsp; Voted </div>:
                                            <div className="voteItm col-2 mb-3 pt-3" onClick={()=>votePoll(option._id)}> Vote </div>
                                        }
                                    </div>)}
                                    )
                                :''} 
                            </div>
                            <hr className="col-10 mx-auto" />
                {/* discussions like  and comment form button post */}
                            <div className="d-flex col-6 justify-content-between mx-auto">
                                <div className="likeSect d-flex">
                                    {isDiscLiked === false ?
                                    <div onClick={()=>likeDiscPost(discutionPOst._id, 'discussion')}>
                                        <i class="onHvr far fa-thumbs-up" style={{fontSize:'1.4rem'}}></i>
                                    </div>:
                                    <div onClick={()=>unLikeDiscPost(discutionPOst._id, 'discussion')}>
                                        <i class="onHvr fas fa-thumbs-up" style={{color: "pink", fontSize:'1.4rem'}}></i>
                                    </div>}
                                    {discutionPOst.likes ? 
                                    discutionPOst.likes.length>0?
                                    <p>&nbsp; {discutionPOst.likes.length}  likes</p> 
                                    :''
                                    : ''}
                                </div>
                                <div className="commentSect">
                                    <i class="fas fa-comment-alt onHvr" style={{fontSize:'1.4rem'}} onClick={ShowCommentForm}></i>
                                    {discutionComments.length}
                                </div>
                            </div>
                {/* comment form  input*/}
                            {commentForm===true?
                            <form className="form col-11 d-flex mx-auto">
                                <input className="comntForm col-9 mx-auto" type="text" id="comment"
                                onChange={hndleCmntInptChnge}
                                value={discsnComment.comment}
                                />
                                <div className="myBtnNew2 mx-auto" style={{margin: "0"}} onClick={postDiscComnt}>Post Comment</div>
                            </form>:''}
                        </div>
                    </div>
                    <div className="commentSect">
                        {discutionComments.map((comment,idx)=>
                        <div key={`cmntsCmnt${idx}`} className="card mt-3">
                            <div className="card-body">
                                {/* comment Section  */}
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex">
                                        {allMembers.map((member, idx)=>
                                        member._id === comment.commenterId ? 
                                        <div>
                                            <img
                                            key={`membImg2${idx}`} className="postImgThmb" src={member.profileImg} alt=""/>
                                            
                                        </div>
                                        : ''
                                        )}
                                        <div className="ml-3 text-left comntDet" style={{margin:'0'}}>
                                            {allMembers.map((member, idx)=>
                                            member._id === comment.commenterId ? 
                                            <h5 style={{fontWeight: 'bolder'}}>{member.name}</h5>
                                            : ''
                                            )}
                                            <h6>{comment.comment}</h6>
                                            <p className="postTimes">replied - {new Date(comment.created).toLocaleString()}</p>
                                        </div>
                                    </div>
                                {/* like section of the comment */}
                                    <div className="commentLike d-flex">
                                    {comment.likes ? 
                                        <p> {comment.likes.length}  &nbsp; </p>: ''
                                        }
                                        {comment.CommentLikedByUser === true ? <div onClick={()=>unLikeDiscPost(comment._id, 'comment')}>
                                            <i class="onHvr fas fa-thumbs-up" style={{fontSize:'1.4rem', color: 'pink'}}></i>
                                        </div>:
                                        // unLikeDiscPost(discutionPOst._id, 'discussion')
                                        <div onClick={()=>likeDiscPost(comment._id, 'comment')}>
                                            <i class="onHvr far fa-thumbs-up" style={{fontSize:'1.4rem'}}></i>
                                        </div>
                                        }
                                    </div>
                                </div>
                                {/* Replies Section if there are more than 1 replies only then*/}
                                <div className="replyShowButtons">
                                    { comment.replies.length>2 ?
                                    // button to show more replies
                                    showHideBtnsArr[idx][idx] == 'false'?
                                    <button className='myOtherBtn' onClick={handleShowMore} id={idx} name={`showMoreComments${idx}`} value={true} >Show {comment.replies.length-2} more Replies</button> : ''
                                    :'' }
                                    { showHideBtnsArr[idx][idx] == 'true' ?
                                    // button to hide comments
                                    <button className='myOtherBtn' onClick={handleShowMore} id={idx} value={false} name={``}>Hide Replies</button> : '' }

                                </div>
                                {/* replies Section */}
                                {showMoreComment.val === `showMoreComments${idx}`?
                                //All replies
                                <div className="ml-4 replies">
                                    { comment.replies ?
                                    comment.replies.map((rep, idx)=>
                                        <div key={`reps${idx}`} className='d-flex singlRep justify-content-between mt-2'>
                                            <div className="d-flex">
                                                <div>
                                                    {allMembers.map((member, idx)=>
                                                        member._id === rep.replierId ? 
                                                        <div>
                                                            <img
                                                            key={`membImg5${idx}`} className="repImgThmb" src={member.profileImg} alt=""/>
                                                            
                                                        </div>
                                                        : ''
                                                        )}
                                                </div>
                                                <div className="ml-3 text-left comntDet" style={{margin:'0'}}>
                                                    
                                                    {allMembers.map((member, idx)=>
                                                        member._id === rep.replierId ?  
                                                        <h5 style={{fontWeight: 'bolder'}}>{member.name}</h5>
                                                        : ''
                                                        )}
                                                    <h6>{rep.reply}</h6>
                                                    <p className="postTimes">replied - {new Date(rep.created).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                {
                                                rep.likes ? 
                                                <p> {rep.likes.length} &nbsp; </p>: ''
                                                }
                                                {rep.ReplyLikedByUser === true ?
                                                <div onClick={()=>unLikeDiscPost({replyId: rep._id, commentId: comment._id},  'reply')}>
                                                    <div>
                                                        <i class="onHvr fas fa-thumbs-up" style={{fontSize:'1.4rem', color:'pink'}}></i>
                                                        <p>unlike</p> 
                                                    </div>
                                                </div> :
                                                <div onClick={()=>likeDiscPost({replyId: rep._id, commentId: comment._id},  'reply')}>
                                                    <i class="onHvr far fa-thumbs-up" style={{fontSize:'1.4rem'}}></i>
                                                </div>
                                                }
                                                
                                            </div>
                                        </div>
                                    ) : ''}
                                </div> :
                                //Last two replies
                                <div className="ml-4 replies">
                                    { comment.replies ?
                                    comment.replies.map((rep, idx)=>
                                        <div key={`reps${idx}`} className='d-flex singlRep mt-2 justify-content-between'>
                                            <div className="d-flex ">
                                                {allMembers.map((member, idx)=>
                                                    member._id === rep.replierId ? 
                                                    <div>
                                                        <img
                                                        key={`membImg5${idx}`} className="repImgThmb" src={member.profileImg} alt=""/>
                                                    </div>
                                                    : ''
                                                    )}
                                                <div className="ml-3 text-left comntDet" style={{margin:'0'}}>
                                                    {allMembers.map((member, idx)=>
                                                    member._id === rep.replierId ? 
                                                    <h6 style={{fontWeight: 'bolder'}}>{member.name}</h6>
                                                    : '')}
                                                    <h6>{rep.reply}</h6>
                                                    <p className="postTimes">replied - {new Date(rep.created).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                {
                                                rep.likes ? 
                                                <p>{rep.likes.length}  &nbsp; </p>: ''
                                                }
                                                {rep.ReplyLikedByUser === true ?
                                                <div onClick={()=>unLikeDiscPost({replyId: rep._id, commentId: comment._id},  'reply')}>
                                                    <div>
                                                        <i class="onHvr fas fa-thumbs-up" style={{fontSize:'1.4rem', color:'pink'}}></i>
                                                        <p>unlike</p> 
                                                    </div>
                                                </div>:
                                                <div onClick={()=>likeDiscPost({replyId: rep._id, commentId: comment._id},  'reply')}>
                                                    <i class="onHvr far fa-thumbs-up" style={{fontSize:'1.4rem'}}></i>
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    ).slice(comment.replies.length-2,comment.replies.length) : ''}
                                </div> 
                                }
                                {/* Button to open reply Input */}
                                { showHideReplyBtnsArr[idx][idx] === '' ?
                                <button className='myBtnNew2 col-4' onClick={handleClickME(idx)} name={`showMe2${idx}`} value={`hideReply${idx}`}>reply</button> : '' }
                                {showTheInput.val === `showMe2${idx}` ? 
                                <div name={`showMe${idx}`} className="d-flex mt-2">
                                    <input className="comntForm col-9 mx-auto" type="text" name={`rep_${idx}`}
                                    onChange={hndleCmntInptChnge2} value={reply2[`rep_${idx}`] || ''} />
                                    <div className="d-flex">
                                        { showHideReplyBtnsArr[idx][idx] === `hideReply${idx}` ?
                                        <button className='myBtnNew2' onClick={handleClickME(idx)} value={``} name={``}>Cancel</button> : '' }
                                        <div className="myBtnNew4 mx-auto"  onClick={()=>postReply(comment._id)}>Reply</div>
                                    </div>
                                </div> :''
                                }
                            </div>
                        </div> )}
                    </div>
                </div>
                <div className="discBoards discAside col-md-3">
                    {allMembers.map((member, idx)=>
                        member._id === discutionPOst.creatorId ? <img key={`membImg3${idx}`}  className="postImgProf" src={member.profileImg} alt=""/> : '')}
                    {allMembers.map((member, idx)=>
                        member._id === discutionPOst.creatorId ? 
                        <div key={`membBio${idx}`} >
                            {member.bio}
                        </div>
                        : '')}
                </div>
            </div>
        </div>
    )
}

export default DiscussionsPage
