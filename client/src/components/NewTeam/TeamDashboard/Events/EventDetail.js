import React , {useState, useEffect, useRef}  from 'react'
import { Link, useHistory, useParams } from "react-router-dom";
import TimeLine from './EventsTimeLine'
function EventDetail() {
    const { teamId } = useParams();
    const { eventId } = useParams();
    const userId = localStorage.id;
    const userType = localStorage.type;
    const [ allMembers, setAllMembers]=useState([]);
    const [ eventsGuests, setEventsGuests]=useState([]);
    const [ eventDetail, setEventDetail]=useState({});
    const [ isDiscLiked, setIsDiscLiked]=useState(false)
    const [ eventsPostSect, setEventsPostSect]=useState(true)
    const [ eventsGuestSect, setEventsGuestSect]=useState(false)
    const [ eventsTimeLineSect, setEventsTimeLineSect]=useState(false)
    const [ showHideBtnsArr, setShowHideBtnsArr]=useState([])
    const [ showHideReplyBtnsArr, setShowHideReplyBtnsArr]=useState([]);
    const [ commentForm, setCommentForm]=useState(false)
    const [ showMoreComment, setShowMoreComment]=useState({val: ''})
    const [ showTheInput, setShowTheInput]=useState({val: ''})
    const [ reply, setReply] =useState({})
    const [ reply2, setReply2] =useState({})
    const [ showGuestList, setShowGuestList] =useState(false)
    const [ eventPostCmnt, setEventPostCmnt ]= useState({ commenterId: userId, comment: '' });
    const [ eventsComments, setEventsComments]=useState([]);
    const [ eventsTimeLine, setEventsTimeLine]=useState([]);
    const [ isGoing, setIsGoing]=useState(false);
    const [month, setMonth]= useState(['January','February','March','April','May','June','July','August','September','October','November','December'])
    const [dayArr, setDayArr]= useState(['Sun','Mon','Tue','Wed','Thur','Fri','Sat'])
    let allMembs=[]
    const [daysObj, setDaysObj]=useState({})
    function ShowCommentForm(){
        if(commentForm===false){
            setCommentForm(true)
        } else setCommentForm(false)
    }
    async function loadEventDetail(){
        const eventDetail = await fetch (`/api/loadEventsDetail/${eventId}`).then( res => res.json());
        setEventDetail(eventDetail);
        eventDetail.guests.map(guest=>{
            if(guest.userId === userId){
                setIsGoing(true)
                return
            } else setIsGoing(false)
        })
        const eventStartTime = eventDetail.eventStartTime
        const eventDate = eventDetail.eventStartDate.slice(8,10)
        const eventMonth = eventDetail.eventStartDate.slice(5,7)
        const eventYear = eventDetail.eventStartDate.slice(0,4)
        const eventEndDate = eventDetail.eventEndDate.slice(8,10)
        const eventEndMonth = eventDetail.eventEndDate.slice(5,7)
        const eventEndYear = eventDetail.eventEndDate.slice(0,4)
        const startingDay = month[eventMonth-1] + ' ' + eventDate + ', ' + eventYear;
        const endingDay = month[eventEndMonth-1] + ' ' + eventEndDate + ', ' + eventEndYear;
        // let trialDateWithOutYear = month[eventMonth-1] + ' ' + eventDate
        let today = new Date();
        let startDate = new Date(startingDay);
        let endDate = new Date(endingDay);
        let startDay = startDate.getDay()
        let endDay = endDate.getDay()
        let todaySdate  = today.getDate();
        let showBtnsArr = []
        let showBtnsArr2 = []
        if(today.getDate()<10){
            todaySdate = '0'+today.getDate()
        }
        const dayObj = {
            dayName: dayArr[startDay],
            dayDate: eventDate,
            dayMonth: month[eventMonth-1],
            dayYear: eventYear,
            startTime: eventStartTime,
            endDayName: dayArr[endDay],
            endDate: eventEndDate,
            endDayMonth: month[eventEndMonth-1],
            endDayYear: eventEndYear,
            endTime: eventDetail.eventEndTime,
        }
        setDaysObj(dayObj);
        let commentArr =[]
        if(eventDetail.likes.length >0 ){
            eventDetail.likes.map(like=>{
                if(like.userId === userId){
                    setIsDiscLiked(true)
                    return
                } setIsDiscLiked(false)
            })
        } else {
            setIsDiscLiked(false)
        }
        let sortedEventTimeLine = []
        if(eventDetail.eventStartDate === eventDetail.eventEndDate){
            sortedEventTimeLine =eventDetail.timeLine.sort(function(a,b){
                let crA = a.timeLineTime
                let crB = b.timeLineTime
                if (crA>crB) return 1;
                if (crA<crB) return -1;
                if(a.timeLineTime>b.timeLineTime) return 1;
                if(a.timeLineTime<b.timeLineTime) return -1;
                // return(crB-crA)
            })
            setEventsTimeLine(sortedEventTimeLine)
        } else {
            let sortEventTimeLineByDate = eventDetail.timeLine.sort(function(a,b){
                let crA = a.timeLineDate.slice(8,10)
                let crB = b.timeLineDate.slice(8,10)
                if (crA>crB) return 1;
                if (crA<crB) return -1;
                if(a.timeLineTime>b.timeLineTime) return 1;
                if(a.timeLineTime<b.timeLineTime) return -1;
            })
            console.log('sortEventTimeLineByDate',sortEventTimeLineByDate)
            setEventsTimeLine(sortEventTimeLineByDate)
        }
        if(eventDetail.comments.length>0){
            eventDetail.comments.map((comment, idx)=>{
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
        //    setting up comments inorder to check if the comment is liked and also set up for buttons array
        setShowHideBtnsArr(showBtnsArr)
        setShowHideReplyBtnsArr(showBtnsArr2)
        setEventsComments(eventDetail.comments)
        // setEventsTimeLine(eventDetail.timeLine)
        setEventsGuests(eventDetail.guests)
    };
    function hndleCmntInptChnge( e ){
        const { id, value } = e.target; 
        setEventPostCmnt({...eventPostCmnt, [id]:value });
    }
    async function goingToEvent(){
        const goingObj={
            eventId: eventId,
            userId: userId,
            userType: userType
        }
        console.log('following obj: ', goingObj)
        const apiResult = await fetch('/api/goingToEvent', 
        {   method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(goingObj)
        }).then( result=>result.json());
        loadEventDetail();
        loadMembers();
        loadAdminsInfo();
    }
    async function notGoingToEvent(){
        const goingObj={
            eventId: eventId,
            userId: userId,
            userType: userType
        }
        // /api/notGoingToEvent
        const apiResult = await fetch('/api/notGoingToEvent', 
        {   method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(goingObj)
        }).then( result=>result.json());
        setIsGoing(false)
        loadMembers();
        loadAdminsInfo();
        loadEventDetail();
    }
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
    async function postEventCmnt(){
        console.log('eventPostCmnt', eventPostCmnt)
        const apiResult = await fetch(`/api/postEventCmnt/${eventId}`,
        {   method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventPostCmnt)
        }).then( result => result.json());
        loadEventDetail();
        setEventPostCmnt({ commenterId: userId, comment: '' })
        ShowCommentForm()
    }
    async function likeEvntPost(postId, type){
        const likeData={
            userId: userId,
        }
        if(type === 'event'){
            const apiResult = await fetch(`/api/likeEvntPost/${postId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(likeData)
            }).then( result => result.json());
            loadEventDetail();
            return
            }
        if(type === 'comment'){
            console.log('comments postId: ', postId)
            const apiResult = await fetch(`/api/likeEvntComnt/${eventId}/${postId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(likeData)
            }).then( result => result.json());
            loadEventDetail();
            return
            }
        if(type === 'reply'){
            console.log("postId ", postId)
            const replyLikesData={
                userId: userId,
                replyId: postId.replyId,
                commentId: postId.commentId,
            }
            const apiResult = await fetch(`/api/likeEvntCmntReply/${eventId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(replyLikesData)
            }).then( result => result.json());
            loadEventDetail();
            return
        }
    }
    async function unLikeEvntPost(postId, type){
        console.log('type: ', type)
        const likeData={
            userId: userId,
        }
        if(type === 'event'){
            const apiResult = await fetch(`/api/unLikeEvntPost/${postId}`, 
                {   method: 'PUT',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(likeData)
                }).then( result => result.json());
                loadEventDetail();
                return
            }
        if(type === 'comment'){
            console.log('type: ', type)
            const apiResult = await fetch(`/api/unLikeEvntComnt/${eventId}/${postId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(likeData)
            }).then( result => result.json());
            loadEventDetail();
            return
            }
        if(type === 'reply'){
            // replyId, commentId
            const replyLikesData={
                userId: userId,
                replyId: postId.replyId,
                commentId: postId.commentId,
            }
            const apiResult = await fetch(`/api/unLikeEvntCmntReply/${eventId}`, 
            {   method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(replyLikesData)
            }).then( result => result.json());
            loadEventDetail();
            return
        }
    }
    function handleShowMore(e){
        e.preventDefault();
        const { id, name, value } = e.target; 
        console.log('value ', value)
        // hideComments${idx}    showHideBtnsArr[idx][idx]
        let anotherArr = []
        let newArr = showHideBtnsArr
        newArr.map((arr,idx)=>{
            if(idx === parseInt(id)){
                arr[idx] = value
            }
        })
        setShowHideBtnsArr(newArr)
        setShowMoreComment({val: name})
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
    function hndleCmntInptChnge2( e ){
        const { name, value } = e.target; 
        setReply({'reply': value });
        setReply2({[name]: value });
    }
    async function postReply(commentId){
        const replyData = {
            replierId: userId,
            reply: reply.reply
        }
        console.log('reply2', reply2)
        console.log('replyData', replyData)
        const apiResult = await fetch(`/api/replyToEvntComment/${eventId}/${commentId}`,
        {   method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(replyData)
        }).then( result => result.json());
        loadEventDetail();
        setReply({});
        setReply2({});
        setShowTheInput({val: ''})
    }
    function showGuests(){
        // showGuestList, setShowGuestList
        if(showGuestList === false){
            setShowGuestList(true)
        } else {setShowGuestList(false)}
    }
    function showSects(categories){
        // post  guest  timeLine
        // const [ eventsPostSect, setEventsPostSect]=useState(false)
        // const [ eventsGuestSect, setEventsGuestSect]=useState(false)
        // const [ eventsTimeLineSect, setEventsTimeLineSect]=useState(false)
    
        if(categories==='post'){
            if(eventsPostSect=== false){
                setEventsPostSect(true);
                setEventsGuestSect(false);
                setEventsTimeLineSect(false);
            }
        }
        if(categories==='guest'){
            setEventsPostSect(false);
            setEventsGuestSect(true);
            setEventsTimeLineSect(false);
        }
        if(categories==='timeLine'){
            setEventsPostSect(false);
            setEventsGuestSect(false);
            setEventsTimeLineSect(true);
        }
    }
    let history = useHistory();
    function directTo(name, id) {
        history.push(`/TeamDetail/${teamId}/MemberProfile/${name}/${id}/TimeLine`);
        document.location.reload(true);
    }
    useEffect(function(){
        loadEventDetail();
        loadMembers();
        loadAdminsInfo();
    },[])
    return (
        <div  className="">
            <div className="eventImage">
                {eventDetail.eventImg == ''?
                <img  className="eventImg" src="https://image.freepik.com/free-vector/events-concept-illustration_114360-931.jpg" alt=""/>
                : <img  className="eventImg"  src={eventDetail.eventImg} alt=""/>}
            </div>
            <div  className="discContnr">
                <div className="d-flex justify-content-between pt-5" >
                    <div style={{position: 'relative',width: '150px'}}>
                        <div className="dateCard">
                            <div className="dateTop"></div>
                            <div className="dateBtm d-flex">
                                <h1 style={{fontSize: '3.5rem'}}>{daysObj.dayDate}</h1>
                                <h3 className="mt-2">{daysObj.dayName}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex col-4 border">
                        <div className="time">
                        </div>
                        {allMembers.map((member, idx)=>
                        member._id === eventDetail.creatorId ? <img key={`membImg${idx}`} className="postImgThmb" src={member.profileImg} alt=""/> : ''
                        )}
                        <div className="ml-3 text-left">
                            <h4 style={{margin: '0', textTransform: "capitalize"}}>{allMembers.map(member=>
                            member._id === eventDetail.creatorId ? member.name : ''
                            )}</h4>
                            <p style={{margin: '0', fontSize: '.9rem'}}>{new Date(eventDetail.created).toLocaleString()}</p>
                        </div> 
                    </div>
                    <div className="col-2">
                        {
                        eventsGuests.length >0 ?
                        <div className="d-flex onHvr" onClick={()=>showGuests()}>
                            <p>{eventsGuests.length} Guest</p>
                        </div>
                        : ''}
                    </div>
                    <div className="col-2">
                        {eventDetail.closed === true ?
                            <div className="myBtnNew2"> Event is over </div> 
                            :
                            isGoing === false ? 
                            <div className="myBtnNew2" onClick={goingToEvent}>Going</div> 
                        : <div className="myBtnNew2" onClick={notGoingToEvent}>Not Going</div>}
                    </div>
                </div>
                <hr className="lineDivdr mt-4"/>
                <div className="myCardDark mx-auto col-12" style={{width: '96%'}}>
                {/* event Tittle */}
                {/*     endDayName: dayArr[endDay],
            endDate: eventEndDate,
            endDayMonth: month[eventEndMonth-1],
            endDayYear: eventEndYear,     */}
                <h3 style={{color: '#cdced8'}}>{eventDetail.eventTitle}</h3>
                <h5 style={{color: '#cdced8'}}>end time: {daysObj.endDate} {daysObj.endDayName} {daysObj.endDayMonth} {daysObj.endTime}</h5>
                {/* {showGuestList === true ?
                
                :''} */}
                <hr className="col-10 mx-auto" />
                {/* discussion main post */}
                    <div>                    
                        <div className="d-flex col-8 mx-auto">
                        {eventsPostSect===true ? 
                        <div className="eventNavItmAct mx-auto" onClick={()=>showSects('post')}>Event Posts</div>
                        :
                        <div className="eventNavItm  mx-auto" onClick={()=>showSects('post')}>Event Posts</div>
                        }
                        {eventsGuestSect===true ? 
                        <div className="eventNavItmAct mx-auto" onClick={()=>showSects('guest')}>Guests</div>
                        :
                        <div className="eventNavItm  mx-auto" onClick={()=>showSects('guest')}>Guests</div>
                        }

                        {eventsTimeLineSect===true ? 
                        <div className="eventNavItmAct mx-auto" onClick={()=>showSects('timeLine')}>Event Timeline</div>
                        :
                        <div className="eventNavItm  mx-auto" onClick={()=>showSects('timeLine')}>Event Timeline</div>
                        }
                        </div>
                    </div>
                    <div className="eventsStuffs">
                        { eventsPostSect===true ?
                        <div className="EventPosts">
                            <div className='card'>
                                <div className="card-body">
                                    <h3>{eventDetail.eventPost}</h3>
                                    <hr/>
                                    <div className="d-flex col-6 justify-content-between mx-auto">
                                        <div className="likeSect d-flex">
                                            {isDiscLiked === false ?
                                            <div onClick={()=>likeEvntPost(eventDetail._id, 'event')}>
                                                <i class="onHvr far fa-thumbs-up" style={{fontSize:'1.4rem'}}></i>
                                            </div>:
                                            <div onClick={()=>unLikeEvntPost(eventDetail._id, 'event')}>
                                                <i class="onHvr fas fa-thumbs-up" style={{color: "pink", fontSize:'1.4rem'}}></i>
                                            </div>}
                                            {eventDetail.likes ? 
                                            eventDetail.likes.length>0?
                                            <p>&nbsp; {eventDetail.likes.length}  likes</p> 
                                            :''
                                            : ''}
                                        </div>
                                        <div className="commentSect">
                                            <i class="fas fa-comment-alt onHvr" style={{fontSize:'1.4rem', marginRight: '10px'}} onClick={ShowCommentForm}></i>
                                            {eventsComments.length> 0 ? eventsComments.length: ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mx-auto discBoards">
                                {commentForm===true?
                                <div className="card">
                                    <div className="card-body">
                                        <form className="form col-11 d-flex mx-auto">
                                            <input className="comntForm col-9 mx-auto" type="text" id="comment"
                                            onChange={hndleCmntInptChnge}
                                            value={eventPostCmnt.comment}
                                            />
                                            <div className="myBtnNew2 mx-auto" style={{margin: "0"}} onClick={postEventCmnt}>Post Comment</div>
                                        </form>
                                    </div>
                                </div>
                                :''}
                                <div className="col-6 d-flex mx-auto">
                                    {allMembers.map((member, idx)=>
                                    member._id === userId ? <img key={`membImg${idx}`} className="postImgThmb mx-auto  mt-3" src={member.profileImg} alt=""/> : '')}

                                    { commentForm===true ?
                                    <div className="d-flex justify-content-between mx-auto col-10 mt-3">
                                        <div className="col-5 myBtnNew mx-auto mr-2" style={{margin: "0"}} onClick={postEventCmnt}>Post Comment</div>
                                        <div className="col-5 myBtnNew mx-auto" style={{margin: "0"}} onClick={ShowCommentForm}>Cancel</div>
                                    </div>
                                    :
                                    <div className="myBtnNew mx-auto col-10 mt-3" onClick={ShowCommentForm}>Comment</div>
                                    }
                                </div>
                            </div>
                            {eventsComments.length>0 ?
                                <div className="mx-auto discBoards">
                            {eventsComments.map((comment,idx)=>
                                    <div key={`cmntsCmnt${idx}`} className="card mt-3">
                                        <div className="card-body">
                                            {/* comment Section  */}
                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex">
                                                    {allMembers.map((member, idx)=>
                                                    member._id === comment.commenterId ? <img
                                                    key={`membImg2${idx}`} className="postImgThmb" src={member.profileImg} alt=""/> : ''
                                                    )}
                                                    <div className="ml-3 text-left comntDet" style={{margin:'0'}}>
                                                        <h6>{comment.comment}</h6>
                                                        <p className="postTimes">replied - {new Date(comment.created).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            {/* like section of the comment */}
                                                <div className="commentLike d-flex">
                                                    {comment.CommentLikedByUser === true ? <div onClick={()=>unLikeEvntPost(comment._id, 'comment')}>
                                                        <i class="onHvr fas fa-thumbs-up" style={{fontSize:'1.4rem', color: 'pink'}}></i> unlike
                                                    </div>:
                                                    // unLikeEvntPost(discutionPOst._id, 'discussion')
                                                    <div onClick={()=>likeEvntPost(comment._id, 'comment')}>
                                                        <i class="onHvr far fa-thumbs-up" style={{fontSize:'1.4rem'}}></i>
                                                    </div>
                                                    }
                                                    {comment.likes ? <p> &nbsp; {comment.likes.length}</p>: ''}
                                                </div>
                                            </div>
                                            {/* Replies Section if there are more than 1 replies only then*/}
                                            <div className="replyShowButtons">
                                                { comment.replies.length>2 ?
                                                // button to show more replies
                                                showHideBtnsArr[idx][idx] == 'false'?
                                                <button className='myOtherBtn' onClick={handleShowMore} id={idx} name={`showMoreComments${idx}`} value={true} >Show {comment.replies.length-2} more Replies</button>: ''
                                                :'' 
                                                }
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
                                                            {allMembers.map((member, idx)=>
                                                                member._id === rep.replierId ? <img
                                                                key={`membImg5${idx}`} className="repImgThmb" src={member.profileImg} alt=""/> : ''
                                                                )}
                                                            <div className="ml-3 text-left comntDet" style={{margin:'0'}}>
                                                                <h6>{rep.reply}</h6>
                                                                <p className="postTimes">replied - {new Date(rep.created).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex">
                                                            {rep.ReplyLikedByUser2 === true ?
                                                            <div onClick={()=>unLikeEvntPost({replyId: rep._id, commentId: comment._id},  'reply')}>
                                                                <i class="onHvr fas fa-thumbs-up" style={{fontSize:'1.4rem', color:'pink'}}></i>
                                                            </div>:
                                                            <div onClick={()=>likeEvntPost({replyId: rep._id, commentId: comment._id},  'reply')}>
                                                                <i class="onHvr far fa-thumbs-up" style={{fontSize:'1.4rem'}}></i>
                                                            </div>
                                                            }
                                                            {
                                                            rep.likes ? 
                                                            <p> &nbsp; {rep.likes.length}</p>: ''
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
                                                                member._id === rep.replierId ? <img
                                                                key={`membImg5${idx}`} className="repImgThmb" src={member.profileImg} alt=""/> : ''
                                                                )}
                                                            <div className="ml-3 text-left comntDet" style={{margin:'0'}}>
                                                                <h6>{rep.reply}</h6>
                                                                <p className="postTimes">replied - {new Date(rep.created).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex">
                                                            {rep.ReplyLikedByUser2 === true ?
                                                            <div onClick={()=>unLikeEvntPost({replyId: rep._id, commentId: comment._id},  'reply')}>
                                                                <i class="onHvr fas fa-thumbs-up" style={{fontSize:'1.4rem', color:'pink'}}></i>
                                                            </div>:
                                                            <div onClick={()=>likeEvntPost({replyId: rep._id, commentId: comment._id},  'reply')}>
                                                                <i class="onHvr far fa-thumbs-up" style={{fontSize:'1.4rem'}}></i>
                                                            </div>
                                                            }
                                                            {
                                                            rep.likes ? 
                                                            <p> &nbsp; {rep.likes.length}</p>: ''
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
                            : ''}
                        </div> :'' }
                        { eventsGuestSect === true ?
                        <div>
                            {/*   guests window */}
                            <div className='row container'>
                                {eventsGuests.map(guest=>
                                allMembers.map((member, idx)=>
                                    member._id === guest.userId ? 
                                    <div className="card">
                                        <div className="card-body">
                                            <img key={`membImg${idx}`} className="cmntImgThmb" src={member.profileImg} alt=""/>
                                            <div class="myBtnNew mx-auto" href="#" role="button" onClick={()=>directTo(member.name, member._id)}>view Detail </div>
                                        </div>
                                    </div>
                                    : '') )}
                            </div>
                        </div> :''
                        }
                        { eventsTimeLineSect === true ?
                        <div>
                            {/* time line */}
                            <TimeLine daysObj={daysObj} eventDetail={eventDetail} loadEventDetail={loadEventDetail} eventsTimeLine={eventsTimeLine}/>
                        </div>
                        :''
                        }
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default EventDetail
