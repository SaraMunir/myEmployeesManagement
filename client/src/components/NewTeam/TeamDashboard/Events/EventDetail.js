import React , {useState, useEffect, useRef}  from 'react'
import { Link, useLocation, useParams } from "react-router-dom";

function EventDetail() {
    const { teamId } = useParams();
    const { eventId } = useParams();
    const userId = localStorage.id;
    const userType = localStorage.type;
    const [ allMembers, setAllMembers]=useState([]);
    const [ eventDetail, setEventDetail]=useState({});
    const [ commentForm, setCommentForm]=useState(false)
    const [ eventPostCmnt, setEventPostCmnt ]= useState({ commenterId: userId, comment: '' });
    const [ eventsComments, setEventsComments]=useState([]);


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
        console.log('eventDetail: ', eventDetail)
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
        setEventsComments(eventDetail.comments)
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
                <div className="d-flex justify-content-between" >
                    <div style={{position: 'relative',width: '150px'}}>
                        <div className="dateCard">
                            <div className="dateTop"></div>
                            <div className="dateBtm d-flex">
                                <h1 style={{fontSize: '3.5rem'}}>{daysObj.dayDate}</h1>
                                <h3 className="mt-2">{daysObj.dayName}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex col-8 border">
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
                {/* discussion Tittle */}
                <h3 style={{color: '#cdced8'}}>{eventDetail.eventTitle}</h3>
                <hr className="col-10 mx-auto" />
                {/* discussion main post */}
                <div className='card'>
                    <div className="card-body">
                        <h3>{eventDetail.eventPost}</h3>
                        <hr/>
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
                <div className="mx-auto discBoards">
                    {eventsComments.map(comment=>
                    <div className="card-body">
                        <div className="d-flex">
                            {allMembers.map((member, idx)=>
                                member._id === comment.commenterId ? <img
                                key={`membImg2${idx}`} className="postImgThmb" src={member.profileImg} alt=""/> : ''
                                )}
                            <div className="ml-3 text-left comntDet" style={{margin:'0'}}>
                                <h5>{comment.comment}</h5>
                                <p className="postTimes" style={{color: '#3e444b'}}>replied - {new Date(comment.created).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                        )}
                </div>
                </div>
            </div>
            
        </div>
    )
}

export default EventDetail
