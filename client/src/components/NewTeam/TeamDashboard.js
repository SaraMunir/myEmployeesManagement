import React, {useState, useEffect} from 'react';
import { Link, useParams } from "react-router-dom";
import MyCalendar from "./Calendar/MyCalendar"
const userType = localStorage.type
const theme = localStorage.theme;

function TeamDashboard() {
    const { teamId } = useParams();
    const [teamDetail, setTeamDetail]= useState( {});
    const [members, setMember] = useState([]);
    // const [membersBirth, setMembersBirth] = useState([]);
    const [closestBirth, setClosestBirth] = useState([]);
    const [todayBirth, setTodayBirth] = useState([]);
    const [houses, setHouses] = useState([]);

    async function loadTeamDetail(){
        const fetchTeamDetail = await fetch (`/api/teamDetails/${teamId}`).then( res => res.json());
        console.log('fetched team detail is: ', fetchTeamDetail)
        setTeamDetail(fetchTeamDetail)
    }
    async function loadMember(){
        const fetchMembers = await fetch (`/api/member/${teamId}`).then( res => res.json());
        console.log('fetched members are: ', fetchMembers)
        setMember(fetchMembers)
        const membBirthday=[];
        const membCurrentDateBirth=[];
        var d = new Date();
        var thisMonth = (d.getMonth() + 1);
        var today = d.getDate();
        fetchMembers.map((member)=>{
            if(member.birthday){
                let birthDay = member.birthday.split("-");
                let birthMonth = birthDay[1]
                let birthDate = birthDay[2]
                if (birthMonth == thisMonth){
                    membBirthday.push(member);
                    if(birthDate ==  today){
                        membCurrentDateBirth.push(member)
                    }
                    }
                }
            });
            membBirthday.sort(function(a, b){
                let birthDay1 = a.birthday.split("-");
                let birthDay2 = b.birthday.split("-");
                return (birthDay1[2] > birthDay2[2] ? 1 : -1 )} );
            console.log('members after sorting: ', membBirthday);
            // setMembersBirth(membBirthday);
            setClosestBirth(membBirthday)
            setTodayBirth(membCurrentDateBirth);
        }
    async function loadHouse(){
        const fetchHouses = await fetch (`/api/house/${teamId}`).then( res => res.json());
        console.log('fetched houses are: ', fetchHouses)
        setHouses(fetchHouses);
    }
    // function sortBirthdays(){
    //     members.map(member)
    // }
    useEffect(function(){
        loadTeamDetail()
        loadMember()
        loadHouse()
    },[])
    return (
        <div>
            <h3>{teamDetail.teamName}</h3>
            <div className={ theme === 'Dark' ? "myCardDark mx-auto col-11" : "myCard mx-auto col-11"} style={{padding: '30px'}}>
                {houses ? houses.map((house, idx)=>
                    <img key={idx} class="houseThmbs" src={house.profileImg} alt="bdsb"/>
                ): ''}
            </div>
            <div className={ theme === 'Dark' ? "myCardDark row mx-auto col-11" : "myCard mx-auto row col-11"} style={{padding: '30px'}}>
            {members.slice(0,17).map((memb, idx)=>
                <div key={idx} className="hoverShwo">
                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                        <img className="houseMmb" src={memb.profileImg?memb.profileImg: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"} alt="housemembThumb" style={{borderColor: 'white'}}/>
                    </Link>
                    <Link className="hoverName" to={`/TeamDetail/${teamId}/MemberProfile/${memb.name}/${memb._id}/TimeLine`} >
                    {memb.name}
                    </Link>
                </div>
                )}
                <Link style={{color: "#b1b1b1"}} to={`/TeamDetail/${teamId}/Members`}>
                    <div className="hoverShwo">
                        <div className="houseMmb ">
                            <h6 className="pt-3"> + {members.length-17}</h6>
                        </div>
                            <div className="hoverName">
                                <p>{members.length-17} More</p>
                            </div>
                    </div>
                </Link>
            </div>
            <div className="row col-11 mx-auto justify-content-between" style={{padding: '0'}}>
                <div className="col-7 mx-auto">
                    <div className={ theme === 'Dark' ? "myCardDark col-12 row" : "myCard col-12 row"} style={{ padding: '30px', height: "75vh"}}>
                        <div className="col-12 mx-auto">
                            <h4>Calendar</h4>
                            <hr/>
                            <MyCalendar/>
                        </div>
                    </div>
                </div>
                <div className="col-5 mx-auto">
                    <div className={ theme === 'Dark' ? "myCardDark col-12 row" : "myCard col-12 row"} style={{padding: '30px'}}>
                        <div className="col-12 mx-auto">
                            <h4>Birthdays</h4>
                            <hr/>
                            <div className="mx-auto col-12 membersBirthday">
                                <h5>Today Birthdays</h5>
                                <hr/>
                                { todayBirth ? todayBirth.map((member,idx)=>
                                    <div key={idx} className={ theme === 'Dark' ? "myCardDark mx-auto d-flex" : "myCard mx-auto d-flex"}>
                                        <Link to={`/TeamDetail/${teamId}/MemberProfile/${member.name}/${member._id}/TimeLine`} >
                                            <img className="houseMmb" src={member.profileImg?member.profileImg: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"} alt="housemembThumb" style={{borderColor: 'white'}}/>
                                        </Link>
                                        <div className="description text-left">
                                            <h6>{member.name}</h6>
                                            <p>{member.birthday}</p>
                                        </div>
                                    </div> ) : '' }
                            </div>
                            <div className="mx-auto col-12 membersBirthday"> 
                            <h5>Upcoming Birthdays</h5>
                            <hr/>
                            { closestBirth ? closestBirth.map((member,idx)=>
                                <div key={idx} className={ theme === 'Dark' ? "myCardDark mx-auto d-flex" : "myCard mx-auto d-flex"}>
                                    <Link to={`/TeamDetail/${teamId}/MemberProfile/${member.name}/${member._id}/TimeLine`} >
                                        <img className="houseMmb" src={member.profileImg?member.profileImg: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png"} alt="housemembThumb" style={{borderColor: 'white'}}/>
                                    </Link>
                                    <div className="description text-left">
                                        <h6>{member.name}</h6>
                                        <p>{member.birthday}</p>
                                    </div>
                                </div> ) : '' }
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamDashboard

