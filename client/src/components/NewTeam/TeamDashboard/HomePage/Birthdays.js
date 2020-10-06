import React from 'react'
import { Link, useParams } from "react-router-dom";

function Birthdays(props) {
    const { teamId } = useParams();

    return (
        <div className="col-6 mx-auto">
            <div className={ props.theme === 'Dark' ? "myCardDark col-12" : "myCard col-12 row"} style={{padding: '30px' ,  height: "100vh"}}>
                <div className="col-12 mx-auto" >
                    <h4>Birthdays</h4>
                    <hr style={{"width": "100%"}}/>
                    <div style={ props.theme === 'Dark' ? {height:'75vh', background:'#343a40', borderRadius:'5px'}: {height:'75vh', background:'#eaeaea', borderRadius:'5px'}}>
                    <props.OnHoverScrollContainer >
                        <div className="mx-auto col-12 membersBirthday">
                            <h5 className="pt-4">Today Birthdays</h5>
                            <hr style={{"width": "60%"}}/>
                            { props.todayBirth ? props.todayBirth.map((member,idx)=>
                                <div key={idx} className={ props.theme === 'Dark' ? "myCardDark mx-auto d-flex" : "myCard mx-auto d-flex"}>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${member.name}/${member._id}/TimeLine`} >
                                        <img className="houseMmb" src={member.profileImg?member.profileImg: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"} alt="housemembThumb" style={{borderColor: 'white'}}/>
                                    </Link>
                                    <div className="description text-left">
                                        <h6>{member.name}</h6>
                                        <p>{member.birthday}</p>
                                    </div>
                                </div> ) : <p>there are no birthdays today</p> }
                            <hr/>
                        </div>
                        <div className="mx-auto col-12 membersBirthday"> 
                        <h5>Upcoming Birthdays</h5>
                            <hr style={{"width": "60%"}}/>

                        { props.upcomingBirthday ? props.upcomingBirthday.map((member,idx)=>
                            <div key={idx} className={ props.theme === 'Dark' ? "myCardDark mx-auto d-flex" : "myCard mx-auto d-flex"}>
                                <Link to={`/TeamDetail/${teamId}/MemberProfile/${member.name}/${member._id}/TimeLine`} >
                                    <img className="houseMmb" src={member.profileImg?member.profileImg: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"} alt="housemembThumb" style={{borderColor: 'white'}}/>
                                </Link>
                                <div className="description text-left">
                                    <h6>{member.name}</h6>
                                    <p>{member.birthday}</p>
                                </div>
                            </div> ) : '' }
                    </div>
                    </props.OnHoverScrollContainer>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Birthdays
