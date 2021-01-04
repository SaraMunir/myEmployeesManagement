import React,{useState, useRef} from 'react';
import { Link, useLocation, useParams } from "react-router-dom";

import {Modal} from 'react-bootstrap'

function EventsTimeLine(props) {
    const { teamId } = useParams();
    const { eventId } = useParams();
    const userId = localStorage.id
    const userType = localStorage.type;
    const [ lgShow, setLgShow] = useState(false);
    const [ newTimeLine, setNewTimeLine]= useState({ 
        timeLineTitle: '', 
        timeLinePost: '', 
        timeLineDate: '', 
        timeLineTime: ''
    })
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );
    const timeLineTitle = useRef();
    const timeLinePost = useRef();
    const timeLineDate = useRef();
    const timeLineTime = useRef();
    function handleInputChange( e ){
        e.preventDefault();
        const { id, value } = e.target; 
        setNewTimeLine( { ...newTimeLine, [id]: value } );
        }
    async function submitNewTimeLine(){
        if(newTimeLine.timeLineTitle === ''){
            timeLineTitle.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide Title of the timeline!' } );
            return;
        }
        if(newTimeLine.timeLineTime === ''){
            timeLineTime.current.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide Title of the Event!' } );
            return;
        }
        if(props.eventDetail.eventStartDate === props.eventDetail.eventEndDate){
            if(newTimeLine.timeLineTime < props.eventDetail.eventStartTime){
                timeLineTime.current.focus();
                setAlertMessage( { type: 'danger', message: `the selected time cannot be before ${props.eventDetail.eventStartTime}` } );
                return;
            }
            if(newTimeLine.timeLineTime > props.eventDetail.eventEndTime){
                timeLineTime.current.focus();
                setAlertMessage( { type: 'danger', message: `the time cannot be after events ${props.eventDetail.eventStartTime}` } );
                return;
            }
        }
        if(newTimeLine.timeLineDate !== ''){
            if(newTimeLine.timeLineDate < props.eventDetail.eventStartDate ){
                timeLineDate.current.focus();
                setAlertMessage( { type: 'danger', message: `timeline date cannot be before ${props.eventDetail.eventStartDate.slice(0,10)}` } );
                return;
            }
            if(newTimeLine.timeLineDate > props.eventDetail.eventEndDate ){
                timeLineDate.current.focus();
                setAlertMessage( { type: 'danger', message: `timeline date cannot be after ${props.eventDetail.eventEndDate.slice(0,10)}` } );
                return;
            }
        }
        setAlertMessage( { type: 'primary', message: 'Good to go!' } );
        setTimeout(() => {
            setAlertMessage( { type: '', message: '' } );
        }, 1000);
        const apiResult = await fetch(`/api/postEventTimeLine/${eventId}`, 
        {   method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTimeLine)
        }).then( result=>result.json());
        setNewTimeLine({timeLineTitle: '',timeLinePost: '',timeLineDate: '', timeLineTime: ''})
        setLgShow(false);
        props.loadEventDetail()
    }
    return (
        <div style={{color: 'white'}} className='mx-auto'>
            <div className="d-flex  justify-content-end">
                { props.eventDetail.creatorId === userId ?<div className="myBtnNew2" onClick={() => setLgShow(true)}>add</div> :'' }
                
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
                                        <h5>TimeLine Title</h5>
                                        <input type="text" class="form-control mb-2"
                                        maxlength="60"
                                        ref={timeLineTitle}
                                        id="timeLineTitle" aria-describedby="taskHelp" onChange={handleInputChange} 
                                        value={newTimeLine.timeLineTitle}/>
                                        <hr/>
                                        <h5>TimeLine Post</h5>
                                        <input type="text" class="form-control mb-2" ref={timeLinePost}
                                        id="timeLinePost" aria-describedby="taskHelp" onChange={handleInputChange} 
                                        value={newTimeLine.timeLinePost}/>
                                        <hr/>
                                        <div className="d-flex justify-content-between">
                                            {props.eventDetail.eventStartDate == props.eventDetail.eventEndDate ? ''
                                            :
                                            <div>
                                                <h5>Time Line Date</h5>
                                                <input type="date" class="form-control mb-2" ref={timeLineDate}
                                                id="timeLineDate" aria-describedby="taskHelp" onChange={handleInputChange} 
                                                value={newTimeLine.timeLineDate}/>
                                            </div> }
                                            <div>
                                                <h5>Event Start Time</h5>
                                                <input type="time" class="form-control mb-2" ref={timeLineTime}
                                                id="timeLineTime" aria-describedby="taskHelp" onChange={handleInputChange} 
                                                value={newTimeLine.timeLineTime}/>
                                            </div>
                                        </div>
                                        <hr/>
                                    </div>
                                </div>
                            </div>
                            <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert"> {alertMessage.message}</div>
                            <div className="card">
                                <div className="d-flex justify-content-between">
                                    <div class="myBtnNew2" onClick={submitNewTimeLine}>Submit</div>
                                    <div className="d-flex">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="start tmLineSctn d-flex">
                <div className="sm d-flex mx-auto">
                    <div className="mx-auto">
                        <div className="mx-auto">
                            <div className="timeLineItmTg mx-auto">
                                <h5 style={{margin: '0'}}>{props.daysObj.dayDate}  {props.daysObj.dayName}</h5>

                                <p style={{margin: '0'}}>
                                    {/* {parseInt(props.daysObj.startTime) < 12 ? (props.daysObj.startTime) :
                                    parseInt(props.daysObj.startTime)== 12 ? 
                                    (props.daysObj.startTime) :
                                    (props.daysObj.startTime)-12
                                    }  */}
                                    {parseInt(props.daysObj.startTime) < 12 ? (props.daysObj.startTime) :
                                    parseInt(props.daysObj.startTime)== 12 ? 
                                    (props.daysObj.startTime) :
                                    parseInt(props.daysObj.startTime)-12 + ':' + props.daysObj.startTime.slice(3,5)
                                    }
                                    
                                    {parseInt(props.daysObj.startTime)<12 ? 'am': 'pm'}</p>
                            </div>
                            <div className="timeLineItmTrngleDwn mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dot tmLineSctn d-flex mt-2 mb-2">
                <div className="sm"></div>
                <div className="midCrcl"></div>
                <div className="sm"></div>
            </div>
            {props.eventsTimeLine.length>0 ?
            props.eventsTimeLine.map((timeline, idx)=>
            idx%2 == 0 ?
            <div>
                <div className="middle tmLineSctn d-flex">
                    <div className="sm d-flex justify-content-end">
                        <div>
                            <div className="d-flex">
                                <div className="timeLineItmTg">
                                    <h4>{timeline.timeLineTitle} </h4>
                                    <p style={{margin: '0'}}>{timeline.timeLineDate}</p>
                                    <p style={{margin: '0'}}>
                                    {parseInt(timeline.timeLineTime) < 12 ? (timeline.timeLineTime) :
                                    parseInt(timeline.timeLineTime)== 12 ? 
                                    (timeline.timeLineTime) :
                                    parseInt(timeline.timeLineTime)-12 + ':' + timeline.timeLineTime.slice(3,5)
                                    }
                                    {(timeline.timeLineTime)<12 ? 'am':'pm'}</p>
                                </div>
                                <div  style={{margin: 'auto'}}>
                                    <div className="timeLineItmTrngleRight"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mid"></div>
                    <div className="sm"></div>
                </div>
                <div className="dot tmLineSctn d-flex mt-2 mb-2">
                    <div className="sm"></div>
                    <div className="midCrcl"></div>
                    <div className="sm"></div>
                </div>
            </div>
            :
            <div>
                <div className="middle tmLineSctn d-flex">
                    <div className="sm"></div>
                    <div className="mid"></div>
                    <div className="sm d-flex justify-content-start">
                        <div>
                            <div className="d-flex">
                                <div style={{margin: 'auto'}}>
                                    <div className="timeLineItmTrngleLeft"></div>
                                </div>
                                <div className="timeLineItmTg">
                                    <h4>{timeline.timeLineTitle}</h4>
                                    <p style={{margin: '0'}}>{timeline.timeLineDate}</p>
                                    <p style={{margin: '0'}}>
                                    {parseInt(timeline.timeLineTime) < 12 ? (timeline.timeLineTime) :
                                        parseInt(timeline.timeLineTime)== 12 ? 
                                        (timeline.timeLineTime) :
                                        parseInt(timeline.timeLineTime)-12 + ':' + timeline.timeLineTime.slice(3,5)
                                        }
                                    {parseInt(timeline.timeLineTime)<12 ? 'am': 'pm'}</p>
                                </div>
                            </div>
                </div>
                    </div>
                </div>
                <div className="dot tmLineSctn d-flex mt-2 mb-2">
                    <div className="sm"></div>
                    <div className="midCrcl"></div>
                    <div className="sm"></div>
                </div>
            </div>
            )
            : 
            <div>
            <div className="middle tmLineSctn d-flex">
                <div className="sm"></div>
                <div className="mid"></div>
                <div className="sm">
                    <div>
                        <div className="d-flex">
                            <div style={{margin: 'auto', height:'15vh'}}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dot tmLineSctn d-flex mt-2 mb-2">
                    <div className="sm"></div>
                    <div className="midCrcl"></div>
                    <div className="sm"></div>
                </div>

            </div>
        }
            <div className="end tmLineSctn d-flex">
                <div className="sm d-flex mx-auto">
                    <div className="mx-auto">
                        <div className="mx-auto">
                            <div className="timeLineItmTrngleUp mx-auto"></div>
                            <div className="timeLineItmTg mx-auto">
                                <h4 style={{margin: '0'}}>{props.daysObj.endDate}  {props.daysObj.endDayName}</h4>
                                <p style={{margin: '0'}}>
                                    {/* {parseInt(props.daysObj.endTime) < 12 ? props.daysObj.endTime :
                                    parseInt(props.daysObj.endTime) == 12 ? 
                                    props.daysObj.endTime :
                                    parseInt(props.daysObj.endTime)-12
                                    } */}
                                    {parseInt(props.daysObj.endTime) < 12 ? (props.daysObj.endTime) :
                                    parseInt(props.daysObj.endTime)== 12 ? 
                                    (props.daysObj.endTime) :
                                    parseInt(props.daysObj.endTime)-12 + ':' + props.daysObj.endTime.slice(3,5)
                                    }
                                    {/* {parseInt(props.daysObj.endTime) < 12 ? parseInt(props.daysObj.endTime) : parseInt(props.daysObj.endTime)-12}
                                    {props.daysObj.endTime} */}
                                    
                                    {parseInt(props.daysObj.endTime)<12 ? 'am': 'pm'}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventsTimeLine
