import React, {useState, useEffect, useRef}  from 'react';
import { Link, useParams } from "react-router-dom";
import {Modal} from 'react-bootstrap';
function EventsPage() {
    const theme = localStorage.theme;
    const { teamId } = useParams();
    const [month, setMonth]= useState(['January','February','March','April','May','June','July','August','September','October','November','December'])
    const [dayArr, setDayArr]= useState(['Sun','Mon','Tue','Wed','Thur','Fri','Sat'])
    const userId = localStorage.id
    const userType = localStorage.type;
    const inputEventTitle = useRef();
    const inputEventPost = useRef();
    const inputEventStartDate = useRef();
    const inputEventStartTime = useRef();
    const inputEventEndDate = useRef();
    const inputEventEndTime = useRef();
    const [ allMembers, setAllMembers]=useState([])
    const [ members, setMembers ] = useState([]);
    const [ myEvents, setMyEvents ]= useState([]);
    const [ upcomingEvents, setUpcomingEvents ]= useState([]);
    const [ pastEvents, setPastEvents ]= useState([]);
    const [ ongoingEvents, setOngoingEvents ]= useState([]);
    let allMembs=[]
    const [ events, setEvents ] = useState([]);
    const [ lgShow, setLgShow] = useState(false);
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const [ newEvent, setNewEvent]= useState({
        teamId: `${teamId}`, creatorId: `${userId}`, eventTitle: '', eventStartDate: '', eventStartTime: '', eventEndDate: '', eventEndTime: '', eventPost: '', eventImg: !localStorage.unUploaded ? '':localStorage.unUploaded
    })
    const [ imgForm, setImgForm] = useState(false);
    const [ eventPic, setEventPic] = useState ( '' );
    async function handleChange(e){
        const file = e.target.files[0];
        setEventPic(file)
    }
    async function handleUpload(e){
        e.preventDefault();
        if(eventPic){
            let myForm = document.getElementById('myForm');
            let formData = new FormData(myForm);
            const uploadPic = await fetch(`/api/eventsPic`, 
                {
                    method: 'PUT',
                    body: formData
                }
            ).then( result=>result.json())
            console.log(uploadPic)
            setNewEvent( { ...newEvent, eventImg: uploadPic } );
            localStorage.setItem("unUploaded", uploadPic);
            setImgForm(false)
        }}
    async function cancelImg(e){
        e.preventDefault();
        let oldPhoto = {old: newEvent.eventImg};
            const cancelPhoto = await fetch(`/api/deleteOldProfilePIc`, 
            {   method: 'post',
                headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
                body: JSON.stringify(oldPhoto)
            }).then( result=>result.json());
            setNewEvent( { ...newEvent, eventImg: '' } );
            localStorage.setItem("unUploaded", '');
        }
    function handleInputChange( e ){
        e.preventDefault();
        const { id, value } = e.target; 
        setNewEvent( { ...newEvent, [id]: value } );
        }
    function showImgForm(){
        if (imgForm== false){
            setImgForm(true)
        } else
        setImgForm(false)
        
    }
    async function loadEvent(){
        const fetchEvents = await fetch (`/api/getEvents/${teamId}`).then( res => res.json());
        let eventsArr = [];
        let today = new Date();
        let todaySdate  = today.getDate();
        let todaySMonth  = today.getMonth()+1;
        if(today.getDate()<10){
            todaySdate = '0'+today.getDate();
        }
        if(today.getMonth()+1<10){
            todaySMonth = today.getMonth()+1;
        }
        let date = today.getFullYear()+'-'+todaySMonth+'-'+ todaySdate;
        let pastEventArr = []
        let ongoingEventArr = []
        let upCommingEventArr = []
        console.log('fetchEvents: ', fetchEvents)

        fetchEvents.map(async event=>{
            if(event.closed === false){
                var eStartDate = new Date(event.eventStartDate);
                var eEndDate = new Date(event.eventEndDate);
                var todayDate = new Date(date);
                // console.log('todays date: ', date)
                // console.log('todays date todayDate: ', todayDate)
                // console.log('events start date: ', event.eventStartDate)
                // console.log('eStartDate: ', eStartDate)
                if(eStartDate.getTime() <= todayDate.getTime()){
                    console.log('no')
                    if(eEndDate.getTime() < todayDate.getTime()){
                        console.log('event already ended')
                        pastEventArr.push(event);
                        const getEventDone = await fetch (`/api/closeEvent/${event._id}`).then( res => res.json());
                    } else if (eEndDate.getTime() > todayDate.getTime()){
                        console.log('event is ongoing and ending is later than today')
                        ongoingEventArr.push(event);
                    } else {
                        console.log('event is ongoing and ending date is today')
                        ongoingEventArr.push(event);
                    }
                }else if(eStartDate.getTime() > todayDate.getTime()){
                    console.log('event is upcoming');
                    upCommingEventArr.push(event);
                } else{

                }
                // if(event.eventStartDate.getTime() > date.getTime()){
                //     console.log('yes')
                // }
                // if(event.eventStartDate < date){
                //     console.log('date is earlier than today', event.eventStartDate.slice(0,10))
                //     if(event.eventEndDate < date){
                //         console.log('event already ended')
                //     }
                // }
                // if(event.eventStartDate >= date){
                //     console.log('date is later than today')
                //     upCommingEventArr.push(event);
                // }
            }
            if(event.closed === true ){
                pastEventArr.push(event);
            }
        })
        setOngoingEvents(ongoingEventArr)
        setPastEvents(pastEventArr)
        setUpcomingEvents(upCommingEventArr)
        setEvents(fetchEvents)
    }
    async function submitNewEvent(){
        let today = new Date();
        let todaySdate  = today.getDate();
        let todaySMonth  = today.getMonth()+1;
        var time = today.getHours() + ":" + today.getMinutes();
        var nowTime = today.getHours() + ":" + today.getMinutes() ;
        var nowHour = today.getHours()
        if(today.getDate()<10){
            todaySdate = '0'+today.getDate()
        }
        if(today.getMonth()+1<10){
            todaySMonth = '0'+(today.getMonth()+1)
        }
        let date = today.getFullYear()+'-'+todaySMonth+'-'+ todaySdate;
        if(newEvent.eventTitle == ''){
            inputEventTitle.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide Title of the Event!' } );
            return;
        }
        if( newEvent.eventTitle.length>60){
            inputEventTitle.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please make sure the title is not more than 60 characters!' } );
            return;
        }
        if(newEvent.eventPost == ''){
            inputEventPost.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide Post !' } );
            return;
        }
        if(newEvent.eventStartDate == ''){
            inputEventStartDate.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please Select a date' } );
            return;
        }
        if(newEvent.eventStartTime == ''){
            inputEventStartTime.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please Select starting Time for the events' } );
            return;
        }
        if(newEvent.eventStartDate == date &&  newEvent.eventStartTime !== ''){
            if(newEvent.eventStartTime < nowTime){
                inputEventStartTime.current.focus();
                setAlertMessage( { type: 'danger', message: 'Please Select a later time than now' } );
                return;
            }
        }
        if(newEvent.eventStartDate < date){
            console.log('todays date: ', date)
            console.log('selected date: ', newEvent.eventStartDate)
            inputEventStartDate.current.focus();
            setAlertMessage( { type: 'danger', message: 'the start date cannot be days before today' } );
            return;
        }
        if(newEvent.eventEndDate == ''){
            inputEventEndDate.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please select the ending date for the events' } );
            return;
        }
        if(newEvent.eventEndDate < newEvent.eventStartDate){
            inputEventEndDate.current.focus();
            setAlertMessage( { type: 'danger', message: 'the end date cannot be before start date' } );
            return;
        }
        if(newEvent.eventEndTime == ''){
            inputEventEndTime.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please select the events end time' } );
            return;
        }
        if(newEvent.eventStartDate == newEvent.eventEndDate){

            if(newEvent.eventEndTime < newEvent.eventStartTime){
                inputEventEndTime.current.focus();
                setAlertMessage( { type: 'danger', message: 'End time cannot be before start time' } );
                return;
            }
        }
        let eventObj = newEvent;
        setAlertMessage( { type: 'primary', message: 'Good to go!' } );
        setTimeout(() => {
            setAlertMessage( { type: '', message: '' } );
        }, 1000);
        const apiResult = await fetch('/api/postEvent', 
        {   method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventObj)
        }).then( result=>result.json());
        localStorage.setItem("unUploaded", '');
        setNewEvent({
            teamId: `${teamId}`, creatorId: `${userId}`, eventTitle: '', eventStartDate: '', eventStartTime: '', eventEndDate: '',eventEndTime: '', eventPost: '', eventImg: localStorage.unUploaded
        })
        setLgShow(false)
        loadEvent()
    }
    async function loadMembers(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        allMembs = fetchMembers;
        setMembers(fetchMembers)
    }
    async function loadProfiles(){
        if(userType==="Admin"){
            const getAdmnDetail = await fetch (`/api/adminProfile/${userId}`).then( res => res.json());
            allMembs.push(getAdmnDetail);
            setAllMembers(allMembs)
            return
        }
        if(userType==="Member"){
            const fetchTeamDetail = await fetch (`/api/teamDetails/${teamId}`).then( res => res.json());
            const getAdmnDetail = await fetch (`/api/adminProfile/${fetchTeamDetail.teamAdmin}`).then( res => res.json());
            allMembs.push(getAdmnDetail);
            setAllMembers(allMembs)
            return
        }
    }
    async function loadMyProfile(){
        if(userType==="Admin"){
            const myDetail = await fetch (`/api/adminProfile/${userId}`).then( res => res.json());
            setMyEvents(myDetail.myDiscussions)
            return
        }
        if(userType==="Member"){
            const myDetail = await fetch (`/api/memberProfile/${userId}`).then( res => res.json());
            setMyEvents(myDetail.myDiscussions)
            return
        }
    }
    useEffect(function(){
        loadEvent();
        loadMembers();
        loadProfiles();
        loadMyProfile()
    },[])
    return (
        <div>
            <div className="d-flex justify-content-end  mx-auto col-11">
                <div className="myBtnNew2" onClick={() => setLgShow(true)}>Create New Event</div>
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
                        <div>
                            <div class="form-group">
                                <div className="card">
                                    <div className="card-body">
                                        <h5>Event Title</h5>
                                        <input type="text" class="form-control mb-2"
                                        maxlength="60"
                                        ref={inputEventTitle}
                                        id="eventTitle" aria-describedby="taskHelp" onChange={handleInputChange} 
                                        value={newEvent.eventTitle}/>
                                        <hr/>
                                        <h5>Event Post</h5>
                                        <input type="text" class="form-control mb-2" ref={inputEventPost}
                                        id="eventPost" aria-describedby="taskHelp" onChange={handleInputChange} 
                                        value={newEvent.eventPost}/>
                                        <hr/>
                                        { /*    { start }     */ }
                                        {/* <input type="date" id="start" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31"/> */}
                                        { /*    { start }     */ }
                                        {/* eventStartDate: '', eventStartTime: '', eventEndDate: '',eventEndTime: '' */}
                                        <div className="d-flex justify-content-between">
                                            <div className="col-6">
                                                <h5>Event Start Date</h5>
                                                <input type="date" class="form-control mb-2" ref={inputEventStartDate}
                                                id="eventStartDate" aria-describedby="taskHelp" onChange={handleInputChange} 
                                                value={newEvent.eventStartDate}/>
                                                <h5>Event Start Time</h5>
                                                <input type="time" class="form-control mb-2" ref={inputEventStartTime}
                                                id="eventStartTime" aria-describedby="taskHelp" onChange={handleInputChange} 
                                                value={newEvent.eventStartTime}/>
                                            </div>
                                            <div className="col-6">
                                                <h5>Event End Date</h5>

                                                <input type="date" class="form-control mb-2" ref={inputEventEndDate}
                                                id="eventEndDate" aria-describedby="taskHelp" onChange={handleInputChange} min={new Date ()}
                                                value={newEvent.eventEndDate}/>

                                                <h5>Event End Time</h5>

                                                <input type="time" class="form-control mb-2" ref={inputEventEndTime}
                                                id="eventEndTime" aria-describedby="taskHelp" onChange={handleInputChange} 
                                                value={newEvent.eventEndTime}/>
                                            </div>
                                        </div>
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
                                    {!newEvent.eventImg ? ''
                                    :<div className="uploadingDiscPic">
                                        <i class="fas fa-times cancelImg" onClick={cancelImg}></i>
                                        <img className="discnImgUp" src={newEvent.eventImg} alt=""/>
                                    </div>
                                    }
                                    </div>
                                </div>
                            </div>
                            <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert"> {alertMessage.message}</div>
                            <div className="card">
                                <div className="d-flex justify-content-between">
                                    <div class="myBtnNew2" onClick={submitNewEvent}>Submit</div>
                                    <div className="d-flex">
                                        <div className="myBtnNew2" onClick={showImgForm} ><i class="far fa-images"></i> Add Image</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="row mx-auto">
                {/* className={theme === 'Dark' ? "myCardDark mx-auto col-md-8" : "myCard mx-auto col-md-8"} */}
                <div className={theme === 'Dark' ? "myCardDark mx-auto col-md-8" : "myCard mx-auto col-md-8"}>
                    <div>
                        <h4>Upcoming Events</h4>
                        <hr className="col-6 mx-auto"/>
                        {
                        upcomingEvents ? 
                        upcomingEvents.map((event, idx)=>{ 
                            const eventDate = event.eventStartDate.slice(8,10)
                            const eventMonth = event.eventStartDate.slice(5,7)
                            const eventYear = event.eventStartDate.slice(0,4)
                            let trialDate = month[eventMonth-1] + ' ' + eventDate + ', ' + eventYear
                            let trialDateWithOutYear = month[eventMonth-1] + ' ' + eventDate
                            var d = new Date(trialDate);
                            let day =d.getDay()
                                return ( <div key={`event${idx}`} className="discBoards mx-auto">
                                <div className="d-flex justify-content-between">
                                    <div className="">
                                        <img className="eventThmbImg" src={event.eventImg == '' || !event.eventImg ?"https://image.freepik.com/free-vector/events-concept-illustration_114360-931.jpg" :event.eventImg} alt="eventImage"/>
                                    </div>
                                    <div className="col-6 text-left">
                                        <div className="d-flex">
                                            <h1 style={{color: '#ff9fb0',fontSize: "2.9rem", marginTop:" -11px"}}>
                                            { dayArr[day]}
                                            </h1>
                                            <div>
                                                <h6 style={{margin:'0'}}>{trialDateWithOutYear}</h6>
                                                <p style={{margin:'0'}}>{eventYear}</p>
                                            </div>
                                        </div>
                                        <h4 className="discnName">{event.eventTitle}</h4>
                                            {allMembers.map((member, idx)=>
                                                member._id === event.creatorId ? 
                                                <div className="d-flex" key={`member${idx}`} >
                                                    <img className="repImgThmb mr-3 mt-1" src={member.profileImg} alt=""/> 
                                                    <div>
                                                        <p style={{margin: '0'}}>Created by {member.name}</p>
                                                        <p style={{margin: '0'}}>{new Date( event.created ).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                : '')}
                                    </div>
                                    <div className="followersGrp ">
                                        <div className="">
                                            {event.guests.length>0 ?
                                            event.guests.map((guest, idx)=>
                                                allMembers.map(member=>
                                                    member._id === guest.userId ?
                                                        <img  key={`guestMemb${idx}`} className="repImgThmb" src={member.profileImg} alt=""/> : ''
                                                    )
                                                ) :''}
                                            {event.guests.length>0 ?
                                            <p>{event.guests.length} going</p>
                                            : ''}
                                        </div>
                                        <div className="d-flex mt-2">
                                            {event.comments.length>0 ?
                                            <p>{event.comments.length} Comments</p>
                                            : ''}
                                        </div>
                                    </div>
                                    {/*   <Route exact path={[`/TeamDetail/:teamId/TeamDashboard/EventsPage`]} component={EventsPage}/>      */}
                                    <div className="pt-4 col-3 ">
                                        <Link to={`/TeamDetail/${teamId}/TeamDashboard/EventsPage/Event/${event._id}`} className="myBtnNew2">
                                        View Event
                                        </Link>

                                    </div>
                                </div>
                            </div>)}
                            ):<div><h5>there are no upcoming events</h5></div>}
                    </div>
                    {ongoingEvents.length>0 ? 
                    <div>
                        <hr/>
                        <h4>Ongoing Events</h4>
                        <hr className="col-6 mx-auto"/>
                        {ongoingEvents.map((event, idx)=>{ 
                            const eventDate = event.eventStartDate.slice(8,10)
                            const eventMonth = event.eventStartDate.slice(5,7)
                            const eventYear = event.eventStartDate.slice(0,4)
                            let trialDate = month[eventMonth-1] + ' ' + eventDate + ', ' + eventYear
                            let trialDateWithOutYear = month[eventMonth-1] + ' ' + eventDate
                            var d = new Date(trialDate);
                            let day =d.getDay()
                                return ( <div key={`event${idx}`} className="discBoards mx-auto">
                                <div className="d-flex justify-content-between">
                                    <div className="">
                                        <img className="eventThmbImg" src={event.eventImg === '' ?"https://image.freepik.com/free-vector/events-concept-illustration_114360-931.jpg" : event.eventImg} alt="eventImage"/>
                                    </div>
                                    <div className="col-6 text-left">
                                        <div className="d-flex">
                                            <h1 style={{color: '#ff9fb0',fontSize: "2.9rem", marginTop:" -11px"}}>
                                            { dayArr[day]}
                                            </h1>
                                            <div>
                                                <h6 style={{margin:'0'}}>{trialDateWithOutYear}</h6>
                                                <p style={{margin:'0'}}>{eventYear}</p>
                                            </div>
                                        </div>
                                        <h4 className="discnName">{event.eventTitle}</h4>
                                            {allMembers.map((member, idx)=>
                                                member._id === event.creatorId ? 
                                                <div className="d-flex" key={`member${idx}`} >
                                                    <img className="repImgThmb mr-3 mt-1" src={member.profileImg} alt=""/> 
                                                    <div>
                                                        <p style={{margin: '0'}}>Created by {member.name}</p>
                                                        <p style={{margin: '0'}}>{new Date( event.created ).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                : '')}
                                    </div>
                                    <div className="followersGrp ">
                                        <div className="">
                                            {event.guests.length>0 ?
                                            event.guests.map((guest, idx)=>
                                                allMembers.map(member=>
                                                    member._id === guest.userId ?
                                                        <img  key={`guestMemb${idx}`} className="repImgThmb" src={member.profileImg} alt=""/> : ''
                                                    )
                                                ) :''}
                                            {event.guests.length>0 ?
                                            <p>{event.guests.length} going</p>
                                            : ''}
                                        </div>
                                        <div className="d-flex mt-2">
                                            {event.comments.length>0 ?
                                            <p>{event.comments.length} Comments</p>
                                            : ''}
                                        </div>
                                    </div>
                                    {/*   <Route exact path={[`/TeamDetail/:teamId/TeamDashboard/EventsPage`]} component={EventsPage}/>      */}
                                    <div className="pt-4 col-3 ">
                                        <Link to={`/TeamDetail/${teamId}/TeamDashboard/EventsPage/Event/${event._id}`} className="myBtnNew2">
                                        View Event
                                        </Link>

                                    </div>
                                </div>
                            </div>)}
                            )}
                    </div> : "" }
                    {  pastEvents ? 
                    <div>
                        <hr/>
                        <h4>Past Events</h4>
                        <hr className="col-6 mx-auto"/>
                        {pastEvents.map((event, idx)=>{ 
                            const eventDate = event.eventStartDate.slice(8,10)
                            const eventMonth = event.eventStartDate.slice(5,7)
                            const eventYear = event.eventStartDate.slice(0,4)
                            let trialDate = month[eventMonth-1] + ' ' + eventDate + ', ' + eventYear
                            let trialDateWithOutYear = month[eventMonth-1] + ' ' + eventDate
                            var d = new Date(trialDate);
                            let day =d.getDay()
                                return ( <div key={`event${idx}`} className="discBoards mx-auto">
                                <div className="d-flex justify-content-between">
                                    <div className="">
                                        <img className="eventThmbImg" src={event.eventImg == ''?"https://image.freepik.com/free-vector/events-concept-illustration_114360-931.jpg" :event.eventImg} alt="eventImage"/>
                                    </div>
                                    <div className="col-6 text-left">
                                        <div className="d-flex">
                                            <h1 style={{color: '#ff9fb0',fontSize: "2.9rem", marginTop:" -11px"}}>
                                            { dayArr[day]}
                                            </h1>
                                            <div>
                                                <h6 style={{margin:'0'}}>{trialDateWithOutYear}</h6>
                                                <p style={{margin:'0'}}>{eventYear}</p>
                                            </div>
                                        </div>
                                        <h4 className="discnName">{event.eventTitle}</h4>
                                            {allMembers.map((member, idx)=>
                                                member._id === event.creatorId ? 
                                                <div className="d-flex" key={`member${idx}`} >
                                                    <img className="repImgThmb mr-3 mt-1" src={member.profileImg} alt=""/> 
                                                    <div>
                                                        <p style={{margin: '0'}}>Created by {member.name}</p>
                                                        <p style={{margin: '0'}}>{new Date( event.created ).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                : '')}
                                    </div>
                                    <div className="followersGrp ">
                                        <div className="">
                                            {event.guests.length>0 ?
                                            event.guests.map((guest, idx)=>
                                                allMembers.map(member=>
                                                    member._id === guest.userId ?
                                                        <img  key={`guestMemb${idx}`} className="repImgThmb" src={member.profileImg} alt=""/> : ''
                                                    )
                                                ) :''}
                                            {event.guests.length>0 ?
                                            <p>{event.guests.length} going</p>
                                            : ''}
                                        </div>
                                        <div className="d-flex mt-2">
                                            {event.comments.length>0 ?
                                            <p>{event.comments.length} Comments</p>
                                            : ''}
                                        </div>
                                    </div>
                                    {/*   <Route exact path={[`/TeamDetail/:teamId/TeamDashboard/EventsPage`]} component={EventsPage}/>      */}
                                    <div className="pt-4 col-3 ">
                                        <Link to={`/TeamDetail/${teamId}/TeamDashboard/EventsPage/Event/${event._id}`} className="myBtnNew2">
                                        View Event
                                        </Link>

                                    </div>
                                </div>
                            </div>)}
                            )}
                    </div> : ''}
                </div>
                <div className={theme === 'Dark' ? "col-md-2 myCardDark mx-auto" : " col-md-2 myCard mx-auto"}>
                    <h4>Following</h4>
                    <hr/>
                    {/* {myevents ? myevents.map(myDiscussion=>
                        <div>
                            {events.map(event=>
                                event._id === myDiscussion.discId ? 
                                <Link to={`/TeamDetail/${teamId}/TeamDashboard/DiscussionBoard/DiscussionPage/${event._id}`}>
                                <div className="card mb-3">
                                    <div style={{padding: "8px 20px"}}>
                                        <div className="d-flex text-center">
                                            {allMembers.map(member=>
                                            member._id === event.creatorId ? <img className="repImgThmb mr-4" src={member.profileImg} alt=""/> : '' )}
                                            {event.eventTitle}
                                        </div>
                                    </div>
                                </div>
                                </Link>
                                : ''
                                )}

                        </div> 
                        
                        )
                        : ''} */}


                </div>
            </div>
        </div>
    )
}

export default EventsPage
