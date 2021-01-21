import React, {useState, useEffect} from 'react';
import { Link, useParams } from "react-router-dom";
function UpcomingEvents(props) {
    const [month, setMonth]= useState(['January','February','March','April','May','June','July','August','September','October','November','December'])
    const [dayArr, setDayArr]= useState(['Sun','Mon','Tue','Wed','Thur','Fri','Sat'])
    const [ upcomingEvents, setUpcomingEvents ]= useState([]);
    
    const [ ongoingEvents, setOngoingEvents ]= useState([]);

    async function loadEvent(){
        const fetchEvents = await fetch (`/api/getEvents/${props.teamId}`).then( res => res.json());
        // console.log('fetchEvents: ', fetchEvents)
        let eventsArr = [];
        let today = new Date();
        let todaySdate  = today.getDate();
        let todaySMonth  = today.getMonth()+1;

        if(today.getDate()<10){
            todaySdate = '0'+today.getDate()
        }
        if(today.getMonth()+1<10){
            todaySMonth = today.getMonth()+1;
        }
        let date = today.getFullYear()+'-'+todaySMonth+'-'+ todaySdate;
        let pastEventArr = []
        let ongoingEventArr = []
        let upCommingEventArr = []
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
            }
            if(event.closed === true ){
                pastEventArr.push(event);
            }
        })
        setOngoingEvents(ongoingEventArr)
        setUpcomingEvents(upCommingEventArr)
        // setEvents(fetchEvents)
    }

    useEffect(function(){
        loadEvent();
    },[])


    return (
        <div className="col-lg-6 mx-auto">
            <div className={ props.theme === 'Dark' ? "myCardDark col-12 m-0" : "myCard col-12 row m-0"} style={{padding: '15px' ,  height: "100vh"}}>
                <div className="col-12 mx-auto">
                    <h4>Events</h4>
                    <hr style={{"width": "100%"}}/>
                    <div style={ props.theme === 'Dark' ? {height:'75vh', background:'#343a40', borderRadius:'5px'}: {height:'75vh', background:'#eaeaea', borderRadius:'5px'}}>
                        <props.OnHoverScrollContainer >
                        <div className="mx-auto col-12 membersBirthday">
                            <h5 className="pt-4">Ongoing Events</h5>
                            <hr style={{"width": "60%"}}/>
                            {
                        ongoingEvents ? 
                        ongoingEvents.map((event, idx)=>{ 
                            const eventDate = event.eventStartDate.slice(8,10)
                            const eventMonth = event.eventStartDate.slice(5,7)
                            const eventYear = event.eventStartDate.slice(0,4)
                            let trialDate = month[eventMonth-1] + ' ' + eventDate + ', ' + eventYear
                            let trialDateWithOutYear = month[eventMonth-1] + ' ' + eventDate
                            var d = new Date(trialDate);
                            let day =d.getDay()
                                return ( 
                            <div key={`event${idx}`} className={ props.theme === 'Dark' ? "myCardDark mx-auto d-flex" : "myCard mx-auto d-flex"}>
                                <div className="col-12 d-flex justify-content-between mx-auto">
                                    <div className="col-7 text-left mx-auto">
                                        <div className="d-flex">
                                            <h1 style={{color: '#ff9fb0',fontSize: "2.4rem", marginTop:" -11px"}}>
                                            { dayArr[day]}
                                            </h1>
                                            <div>
                                                <h6 style={{margin:'0'}}>{trialDateWithOutYear}</h6>
                                                <p style={{margin:'0'}}>{eventYear}</p>
                                            </div>
                                        </div>
                                        <h4 className="discnName">{event.eventTitle}</h4>
                                    </div>
                                    <div className="pt-4 col-5 mx-auto ">
                                        <Link to={`/TeamDetail/${props.teamId}/TeamDashboard/EventsPage/Event/${event._id}`} className="myBtnNew2">
                                        View Event
                                        </Link>
                                    </div>
                                </div>
                            </div>)}
                            ):<div><h5>there are no upcoming events</h5></div>}
                            <hr/>
                            <h5 className="pt-4">Upcoming Events</h5>
                            <hr style={{"width": "60%"}}/>
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
                                return ( 
                            <div key={`event${idx}`} className={ props.theme === 'Dark' ? "myCardDark mx-auto d-flex" : "myCard mx-auto d-flex"}>
                                <div className="col-12 d-flex justify-content-between mx-auto">
                                    <div className="col-7 text-left mx-auto">
                                        <div className="d-flex">
                                            <h1 style={{color: '#ff9fb0',fontSize: "2.4rem", marginTop:" -11px"}}>
                                            { dayArr[day]}
                                            </h1>
                                            <div>
                                                <h6 style={{margin:'0'}}>{trialDateWithOutYear}</h6>
                                                <p style={{margin:'0'}}>{eventYear}</p>
                                            </div>
                                        </div>
                                        <h4 className="discnName">{event.eventTitle}</h4>
                                    </div>
                                    <div className="pt-4 col-5 mx-auto ">
                                        <Link to={`/TeamDetail/${props.teamId}/TeamDashboard/EventsPage/Event/${event._id}`} className="myBtnNew2">
                                        View Event
                                        </Link>
                                    </div>
                                </div>
                            </div>)}
                            ):<div><h5>there are no upcoming events</h5></div>}
                        </div>
                        </props.OnHoverScrollContainer >
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UpcomingEvents
